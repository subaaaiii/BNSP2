package structs

// Struct ini digunakan untuk menampilkan data user sebagai response API
type UserResponse struct {
	Id        uint    `json:"id"`
	Name      string  `json:"name"`
	Username  string  `json:"username"`
	Email     string  `json:"email"`
	CreatedAt string  `json:"created_at"`
	UpdatedAt string  `json:"updated_at"`
	Token     *string `json:"token,omitempty"`
	Role      string  `json:"role"`
	Picture   string  `json:"picture"`
}

type UserProfileResponse struct {
	Id            uint   `json:"id"`
	Name          string `json:"name"`
	Username      string `json:"username"`
	Email         string `json:"email"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
	Birthday      string `json:"birthday"`
	Gender        string `json:"gender"`
	AccountNumber string `json:"account_number"`
	Bank          string `json:"bank"`
	Address       string `json:"address"`
	Picture       string `json:"picture"`
}

// Struct ini digunakan untuk menerima data saat proses create user
type UserCreateRequest struct {
	Name     string `json:"name" binding:"required"`
	Username string `json:"username" binding:"required" gorm:"unique;not null"`
	Email    string `json:"email" binding:"required" gorm:"unique;not null"`
	Password string `json:"password" binding:"required"`
}

// Struct ini digunakan untuk menerima data saat proses update user
type UserUpdateRequest struct {
	Username      *string `json:"username,omitempty"`
	Email         *string `json:"email,omitempty"`
	Name          *string `json:"name,omitempty"`
	Birthday      *string `json:"birthday,omitempty"`
	Gender        *string `json:"gender,omitempty"`
	AccountNumber *string `json:"account_number,omitempty"`
	Bank          *string `json:"bank,omitempty"`
	Address       *string `json:"address,omitempty"`
	Picture       *string `json:"picture,omitempty"`
}

// Struct ini digunakan saat user melakukan proses login
type UserLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}
