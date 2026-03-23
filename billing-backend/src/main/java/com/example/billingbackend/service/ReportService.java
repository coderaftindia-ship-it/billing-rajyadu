
package com.example.billingbackend.service;

import com.example.billingbackend.model.*;
import com.example.billingbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private PosRepository posRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public ReportSummary getReportSummary() {
        ReportSummary summary = new ReportSummary();

        List<Pos> sales = posRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<Expense> expenses = expenseRepository.findAll();

        // Sales calculations
        double totalSales = sales.stream().mapToDouble(Pos::getTotalAmount).sum();
        int totalOrders = sales.size();
        double averageTicketSize = (totalOrders > 0) ? totalSales / totalOrders : 0;

        summary.setTotalSales(totalSales);
        summary.setTotalOrders(totalOrders);
        summary.setAverageTicketSize(averageTicketSize);

        // Sales over time (monthly for the current year)
        Map<YearMonth, Double> monthlySales = new HashMap<>();
        for (Pos sale : sales) {
            YearMonth month = YearMonth.from(sale.getTransactionDate());
            monthlySales.merge(month, sale.getTotalAmount(), Double::sum);
        }
        List<Map<String, Object>> salesOverTime = new ArrayList<>();
        monthlySales.forEach((month, amount) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", month.getMonth().name().substring(0, 3));
            map.put("sales", amount);
            salesOverTime.add(map);
        });
        summary.setSalesOverTime(salesOverTime);

        // Category sales (based on current stock value)
        Map<String, Double> categoryStockValue = new HashMap<>();
        for (Product product : products) {
            categoryStockValue.merge(product.getCategory(), product.getPrice() * product.getStock(), Double::sum);
        }
        List<Map<String, Object>> categorySales = new ArrayList<>();
        categoryStockValue.forEach((category, value) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", category);
            map.put("value", value);
            categorySales.add(map);
        });
        summary.setCategorySales(categorySales);

        // Top selling products (by quantity sold in POS)
        Map<Long, Integer> productSalesCount = new HashMap<>();
        for (Pos sale : sales) {
            for (PosItem item : sale.getItems()) {
                productSalesCount.merge(item.getProductId(), item.getQuantity(), Integer::sum);
            }
        }
        List<Map<String, Object>> topSellingProducts = productSalesCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    Product p = productRepository.findById(entry.getKey()).orElse(null);
                    map.put("name", (p != null) ? p.getName() : "Unknown");
                    map.put("quantity", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        summary.setTopSellingProducts(topSellingProducts);

        // Profit & Loss
        double totalExpenses = expenses.stream().mapToDouble(Expense::getAmount).sum();
        // Simplified profit calculation (assuming 20% margin for now)
        double totalProfit = totalSales * 0.20;
        double netProfit = totalProfit - totalExpenses;
        summary.setTotalExpenses(totalExpenses);
        summary.setTotalProfit(totalProfit);
        summary.setNetProfit(netProfit);

        // GST Summary (assuming 18% GST on sales and 8% on purchases for now)
        double gstCollected = totalSales * 0.18;
        double gstPaid = totalSales * 0.08; // Simplified
        double netGstPayable = gstCollected - gstPaid;
        summary.setGstCollected(gstCollected);
        summary.setGstPaid(gstPaid);
        summary.setNetGstPayable(netGstPayable);

        // Stock Report
        long totalStockValue = (long) products.stream().mapToDouble(p -> p.getPrice() * p.getStock()).sum();
        int lowStockItems = (int) products.stream().filter(p -> p.getStock() < 10).count();
        summary.setTotalStockValue(totalStockValue);
        summary.setLowStockItems(lowStockItems);

        return summary;
    }
}
