package helpers

import (
	"fmt"
	"gopkg.in/gomail.v2"
)

func SendOTPEmail(to string, otp string) error {

	m := gomail.NewMessage()
	m.SetHeader("From", "subairibairi689@gmail.com")
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Kode Verifikasi Email")

	body := fmt.Sprintf("Kode OTP untuk mengubah email adalah: %s", otp)

	m.SetBody("text/plain", body)

	d := gomail.NewDialer(
		"smtp.gmail.com",
		587,
		"subairibairi689@gmail.com",
		"osuk ykvs vwor dbeh",
	)

	return d.DialAndSend(m)
}
