package com.he194321.movie_booking.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Lấy mã Token từ header của Request (thường có chữ "Bearer ")
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Không có mã Token -> Cho đi tiếp (SecurityConfig sẽ tự chặn nếu đường dẫn đó yêu cầu đăng nhập)
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Cắt bỏ chữ "Bearer " để lấy đúng cái mã Token
        String jwtToken = authHeader.substring(7);

        try {
            // 3. GIẢI MÃ TOKEN (Sau này chúng ta sẽ dùng thư viện JJWT ở đây)
            // Tạm thời giả lập: Từ jwtToken, ta lấy ra được Username và Role từ Database
            String username = "giapnd"; // Giả lập giải mã ra username
            String userRole = "ROLE_ADMIN"; // Giả lập giải mã ra Role
            boolean isForceChangePassword = false; // Lấy trạng thái ép đổi mật khẩu

            // =========================================================
            // TÍCH HỢP LOGIC "ÉP ĐỔI MẬT KHẨU" CỦA BẠN VÀO ĐÂY
            // =========================================================
            String uri = request.getRequestURI();
            if (isForceChangePassword && !uri.endsWith("/change-password")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Ban phai doi mat khau de tiep tuc!");
                return; // Chặn đứng luôn tại đây
            }

            // 4. "BÁO CÁO" CHO SPRING SECURITY
            // Tạo một thẻ chứng nhận chứa Tên và Quyền của User
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    Collections.singleton(() -> userRole) // Gắn Role vào đây
            );

            // Cất thẻ chứng nhận vào "Két sắt" của Spring
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            // Nếu token hết hạn hoặc bị sửa đổi giả mạo -> Xóa thông tin đăng nhập
            SecurityContextHolder.clearContext();
        }

        // 5. Cho phép Request đi tiếp tới SecurityConfig và Controller
        filterChain.doFilter(request, response);
    }
}