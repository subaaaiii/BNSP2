package helpers

import (
	"time"

	"gorm.io/gorm"
)

type ChatList struct {
	UserID    uint      `json:"user_id"`
	Name      string    `json:"name"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
	Picture   string    `json:"picture"`
}

func GetChatList(db *gorm.DB, currentUserID uint) ([]ChatList, error) {
	var result []ChatList

	err := db.Raw(`
		SELECT 
			u.id AS user_id,
			u.name,
			u.picture,
			m.message,
			m.created_at
		FROM users u
		JOIN messages m ON (
			(u.id = m.from_user_id AND m.to_user_id = ?)
			OR
			(u.id = m.to_user_id AND m.from_user_id = ?)
		)
		WHERE m.created_at = (
			SELECT MAX(created_at)
			FROM messages
			WHERE 
				(from_user_id = u.id AND to_user_id = ?)
				OR
				(from_user_id = ? AND to_user_id = u.id)
		)
		ORDER BY m.created_at DESC
	`, currentUserID, currentUserID, currentUserID, currentUserID).
		Scan(&result).Error

	return result, err
}
