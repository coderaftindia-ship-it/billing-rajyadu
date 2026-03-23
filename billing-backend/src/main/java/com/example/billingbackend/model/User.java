package com.example.billingbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String name;
    private String email;
    private String password;
    private String role;
    private String status; // Active, Inactive
    private LocalDateTime lastActive;
    private String permissions; // Comma-separated list of modules
}
