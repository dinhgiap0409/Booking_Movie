package com.he194321.movie_booking.service.impl;

import com.he194321.movie_booking.dto.RegisterRequest;
import com.he194321.movie_booking.entity.Role;
import com.he194321.movie_booking.entity.User;
import com.he194321.movie_booking.repository.RoleRepository;
import com.he194321.movie_booking.repository.UserRepository;
import com.he194321.movie_booking.service.AuthenService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.he194321.movie_booking.dto.LoginRequest;
import com.he194321.movie_booking.dto.LoginResponse;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Service
public class AuthenServiceImpl implements AuthenService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    private static final List<String> BLOCKED_USERNAMES = List.of(
            "admin", "root", "support", "administrator",
            "system", "superuser", "moderator", "mod"
    );
    public AuthenServiceImpl(RoleRepository roleRepository, UserRepository userRepository) {

        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }




    @Override
    public String register(RegisterRequest request) {
        if (BLOCKED_USERNAMES.contains(request.getUsername().toLowerCase())) {
            return "Lỗi: Tên đăng nhập này không được phép sử dụng!";
        }
        // Kiểm tra trùng username trong DB
        if (userRepository.existsByUsername(request.getUsername())) {
            return "Lỗi: Tên đăng nhập đã tồn tại!";
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        user.setIsActive(true);

        Role userRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy"));
        user.setRoles(Collections.singleton(userRole));

        userRepository.save(user);
        return "Đăng ký thành công!";
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không tồn tại!"));
        if (!bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng!");
        }
        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new RuntimeException("Tài khoản đã bị khóa!");
        }
        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName())
                .orElse("ROLE_CUSTOMER");

        String token = "TOKEN_" + user.getUsername() + "_" + System.currentTimeMillis();
        return new LoginResponse(token, user.getUsername(), role, user.getFullName());    }
}
