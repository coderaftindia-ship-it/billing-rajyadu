package com.example.billingbackend.model;

import lombok.Data;

import java.util.List;

@Data
public class SupplierSummary {
    private Long supplierId;
    private String supplierName;
    private double totalPurchasedAmount;
    private double totalPaidAmount;
    private double totalOutstandingAmount;
    private int totalQuantity;
    private int purchaseCount;
}
