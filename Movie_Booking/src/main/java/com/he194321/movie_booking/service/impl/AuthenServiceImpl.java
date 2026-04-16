package com.he194321.movie_booking.service.impl;

import com.he194321.movie_booking.dto.RegisterRequest;
import com.he194321.movie_booking.entity.Role;
import com.he194321.movie_booking.entity.User;
import com.he194321.movie_booking.repository.RoleRepository;
import com.he194321.movie_booking.repository.UserRepository;
import com.he194321.movie_booking.service.AuthenService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthenServiceImpl implements AuthenService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    public AuthenServiceImpl(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }


    @Override
    public String register(RegisterRequest request) {
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
}
