package models

import "time"

type Product struct {
	Id         uint   `gorm:"primaryKey" json:"id"`
	Code       string `gorm:"size:50;uniqueIndex;not null" json:"code"`
	Name       string `gorm:"size:150;not null" json:"name"`
	Price      int    `gorm:"not null" json:"price"`
	IsReady    bool   `gorm:"default:true" json:"is_ready"`
	Picture    string `gorm:"size:255" json:"picture"`
	CategoryId uint   `gorm:"not null" json:"category_id"`
	StoreID    uint   `gorm:"not null" json:"store_id"`

	Category Category `gorm:"foreignKey:CategoryId" json:"category"`
	Store    Store    `gorm:"foreignKey:StoreID" json:"store"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
