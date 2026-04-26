package models

import "time"

type Order struct {
	Id         uint   `gorm:"primaryKey" json:"id"`
	UserId     uint   `gorm:"not null" json:"user_id"`
	SellerId   uint   `gorm:"not null" json:"seller_id"`
	Total      int    `gorm:"not null" json:"total"`
	IsVerified bool   `gorm:"default:false" json:"is_verified"`
	Proof      string `gorm:"size:255" json:"proof"`

	User       User        `gorm:"foreignKey:UserId" json:"user"`
	OrderItems []OrderItem `json:"order_items,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
