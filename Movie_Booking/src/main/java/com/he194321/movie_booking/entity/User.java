package com.he194321.movie_booking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // Giúp tạo object dễ dàng hơn
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "full_name")
    private String fullName;

    private String phone;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Date createdAt;

    // Quan hệ Nhiều-Nhiều với bảng Roles
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "User_Roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<com.he194321.movie_booking.entity.Role> roles = new HashSet<>();
}