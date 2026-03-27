package models

// import "time"

// type Store struct {
// 	Id      uint   `gorm:"primaryKey" json:"id"`
// 	UserId  uint   `gorm:"uniqueIndex;not null" json:"user_id"`
// 	Name    string `gorm:"size:100;not null" json:"name"`
// 	Address string `gorm:"type:text" json:"address"`
// 	Status  int    `gorm:"default:1" json:"status"`
// 	Picture string `gorm:"size:255" json:"picture"`

// 	User     User      `gorm:"foreignKey:UserId" json:"user"`
// 	Products []Product `json:"products,omitempty"`

// 	CreatedAt time.Time `json:"created_at"`
// 	UpdatedAt time.Time `json:"updated_at"`
// }
