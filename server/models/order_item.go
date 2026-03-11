package models

import "time"

type OrderItem struct {
	Id        uint   `gorm:"primaryKey" json:"id"`
	OrderId   uint   `gorm:"not null" json:"order_id"`
	ProductId uint   `gorm:"not null" json:"product_id"`
	Quantity  int    `gorm:"not null" json:"quantity"`
	Total     int    `gorm:"not null" json:"total"`
	Note      string `gorm:"type:text" json:"Note"`

	Order   Order   `gorm:"foreignKey:OrderId" json:"order"`
	Product Product `gorm:"foreignKey:ProductId" json:"product"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
