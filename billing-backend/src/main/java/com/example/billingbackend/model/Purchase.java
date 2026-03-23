package com.example.billingbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String purchaseOrderNumber;
    private Long supplierId;
    private LocalDateTime purchaseDate;
    private double totalAmount;
    private String status; // e.g., PENDING, RECEIVED
    private String paymentStatus; // e.g., PAID, UNPAID, PARTIAL
}
