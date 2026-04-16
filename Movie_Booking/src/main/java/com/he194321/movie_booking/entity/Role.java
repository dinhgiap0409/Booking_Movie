package com.he194321.movie_booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name; // ROLE_ADMIN, ROLE_STAFF, ROLE_CUSTOMER
}