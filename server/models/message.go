package models

import "time"

type Message struct {
	ID         uint
	FromUserID uint
	ToUserID   uint
	Message    string
	CreatedAt  time.Time

	FromUser User `gorm:"foreignKey:FromUserID"`
	ToUser   User `gorm:"foreignKey:ToUserID"`
}
