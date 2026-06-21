
package com.example.billingbackend.repository;

import com.example.billingbackend.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    java.util.List<Purchase> findBySupplierId(Long supplierId);
}
