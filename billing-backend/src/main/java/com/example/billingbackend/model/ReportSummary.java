
package com.example.billingbackend.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ReportSummary {
    private double totalSales;
    private double totalProfit;
    private int totalOrders;
    private double averageTicketSize;
    private List<Map<String, Object>> salesOverTime;
    private List<Map<String, Object>> categorySales;
    private List<Map<String, Object>> topSellingProducts;
    private double totalExpenses;
    private double netProfit;
    private double gstCollected;
    private double gstPaid;
    private double netGstPayable;
    private long totalStockValue;
    private int lowStockItems;
}
