package com.example.billingbackend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PosItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long productId;
    private int quantity;
    private double price;
}
