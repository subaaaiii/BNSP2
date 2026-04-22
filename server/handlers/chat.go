package handlers

import (
	"net/http"
	"strconv"

	"bnsp2/server/database"
	"bnsp2/server/models"
	"bnsp2/server/services"

	"github.com/gin-gonic/gin"
)

type MessageRequest struct {
	To      string `json:"to" binding:"required"`
	Message string `json:"message" binding:"required"`
}

type MessageResponse struct {
	From      string `json:"from"`
	To        string `json:"to"`
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

func SendMessage(c *gin.Context) {
	// 🔐 ambil user dari middleware
	userID := c.MustGet("user_id").(uint)
	userIDStr := strconv.FormatUint(uint64(userID), 10)

	var req MessageRequest

	// ✅ binding
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 🔥 convert target ke uint
	toUint, err := strconv.ParseUint(req.To, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid target user"})
		return
	}
	toID := uint(toUint)

	if userID == toID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot send message to yourself"})
		return
	}

	// 💾 simpan ke DB
	msgDB := models.Message{
		FromUserID: userID,
		ToUserID:   toID,
		Message:    req.Message,
	}

	if err := database.DB.Create(&msgDB).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message"})
		return
	}

	// 🧠 response pakai data DB (lebih valid)
	msg := MessageResponse{
		From:      userIDStr,
		To:        req.To,
		Message:   msgDB.Message,
		Timestamp: msgDB.CreatedAt.Unix(),
	}

	// 🎯 channel tujuan
	channel := "private-chat-" + req.To

	// 🚀 kirim realtime via :contentReference[oaicite:0]{index=0}
	if err := services.Client.Trigger(channel, "new-message", msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	sender := "private-chat-" + userIDStr
	if err := services.Client.Trigger(sender, "new-message", msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "sent",
		"data":   msg,
	})
}
