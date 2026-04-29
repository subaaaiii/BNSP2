package controllers

import (
	"bnsp2/server/database"
	"bnsp2/server/models"
	"bnsp2/server/structs"
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

const (
	StatusPending = "PENDING"
	StatusPaid    = "PAID"
	StatusFailed  = "FAILED"
	StatusExpired = "EXPIRED"
)

func CreateOrder(c *gin.Context) {
	var req structs.OrderRequest
	var order models.Order
	var product models.Product

	userId := c.MustGet("user_id").(uint)

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
		})
		return
	}

	if req.Qty <= 0 {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Quantity must be greater than 0",
		})
		return
	}

	if err := database.DB.First(&product, "id = ?", req.ProductId).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Product not found",
		})
		return
	}

	if product.Stock < req.Qty {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Product stock not enough",
		})
		return
	}

	order = models.Order{
		Id:        uuid.NewString(),
		Invoice:   fmt.Sprintf("INV-%d%d", time.Now().Unix(), rand.Intn(1000)),
		ProductId: req.ProductId,
		UserId:    userId,
		SellerId:  product.UserId,
		Qty:       req.Qty,
		Total:     product.Price * req.Qty,
		Status:    StatusPending,
	}

	if err := database.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create order",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Order successfully created",
		Data:    order,
	})
}

func PaymentCallback(c *gin.Context) {
	var payload structs.CallbackRequest
	var order models.Order

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
		})
		return
	}

	validStatus := map[string]bool{
		StatusPaid:    true,
		StatusFailed:  true,
		StatusExpired: true,
	}

	if !validStatus[payload.Status] {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Status not valid",
		})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var product models.Product

		if err := tx.First(&order, "id = ?", payload.OrderID).Error; err != nil {
			return err
		}

		if order.Status != StatusPending {
			return nil
		}

		if payload.Status == StatusPaid {
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
				First(&product, order.ProductId).Error; err != nil {
				return err
			}

			if product.Stock < order.Qty {
				return errors.New("stock not enough")
			}

			product.Stock -= order.Qty

			if product.Stock == 0 {
				product.Status = "sold"
			}

			if err := tx.Save(&product).Error; err != nil {
				return err
			}
		}

		order.Status = payload.Status
		return tx.Save(&order).Error
	})

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Order successfully created",
		Data:    order,
	})
}

func GetOrder(c *gin.Context) {
	id := c.Param("id")

	var order models.Order

	if err := database.DB.First(&order, "id = ?", id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(200, order)
}
