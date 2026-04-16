package com.he194321.movie_booking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. Khai báo cái "Người soát vé" JWT
    private final JwtAuthenticationFilter jwtAuthFilter;

    // 2. Tiêm (Inject) nó vào đây
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF (Bảo mật form) để dễ dàng test API bằng Postman/React
                .csrf(csrf -> csrf.disable())

                // BẮT BUỘC KHI DÙNG JWT: Không lưu trạng thái đăng nhập trên Server (Stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // BẮT ĐẦU PHÂN QUYỀN CÁC ĐƯỜNG DẪN
                .authorizeHttpRequests(auth -> auth

                        // 1. KHU VỰC CHUNG (Khách vãng lai cũng vào được)
                        .requestMatchers("/api/auth/**", "/api/movies/**").permitAll()

                        // 2. KHU VỰC KHÁCH HÀNG (Phải đăng nhập)
                        .requestMatchers("/api/profile/**", "/api/customer/**").authenticated()

                        // 3. KHU VỰC ĐẶT VÉ (Cả 3 vai trò đều được phép thao tác vé)
                        .requestMatchers("/api/bookings/**").hasAnyRole("CUSTOMER", "STAFF", "ADMIN")

                        // 4. KHU VỰC NHÂN VIÊN RẠP
                        .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN")

                        // 5. KHU VỰC ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Tất cả các request khác nếu không khớp ở trên thì đều bắt buộc phải đăng nhập
                        .anyRequest().authenticated()
                )

                // 3. Lắp Filter soát vé JWT vào TRƯỚC Filter kiểm tra User/Pass mặc định
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}