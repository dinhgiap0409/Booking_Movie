package com.he194321.movie_booking.controller;

import com.he194321.movie_booking.dto.RegisterRequest;
import com.he194321.movie_booking.service.AuthenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private AuthenService authService;

   @PostMapping("/register")
   public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {

       String message = authService.register(request);

       if (message.contains("Lỗi")) {
           return ResponseEntity.badRequest().body(message);
       }

       return ResponseEntity.ok(message);
   }
}
