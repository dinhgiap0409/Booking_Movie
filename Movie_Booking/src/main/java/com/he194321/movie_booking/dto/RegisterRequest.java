package com.he194321.movie_booking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Pattern(
            regexp = "^[a-zA-Z][a-zA-Z0-9_]{5,19}$",
            message = "Username phải bắt đầu bằng chữ cái, dài 6-20 ký tự, chỉ chứa chữ/số/dấu_"
    )
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
            message = "Email không đúng định dạng"
    )
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$",
            message = "Số điện thoại không hợp lệ (phải là số di động Việt Nam 10 số)"
    )
    private String phone;

    @NotBlank(message = "Họ tên không được để trống")
    @Pattern(
            regexp = "^[\\p{L}]+(?:[\\s'\\-][\\p{L}]+)+$",
            message = "Họ tên phải có ít nhất 2 từ, không chứa số hay ký tự đặc biệt"
    )
    private String fullName;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Mật khẩu tối thiểu 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)"
    )
    private String password;
}
