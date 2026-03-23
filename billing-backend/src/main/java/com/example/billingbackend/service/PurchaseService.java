
package com.example.billingbackend.service;

import com.example.billingbackend.model.Purchase;
import com.example.billingbackend.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    public Purchase getPurchaseById(Long id) {
        return purchaseRepository.findById(id).orElse(null);
    }

    public Purchase createPurchase(Purchase purchase) {
        return purchaseRepository.save(purchase);
    }

    public Purchase updatePurchase(Long id, Purchase purchaseDetails) {
        Purchase purchase = purchaseRepository.findById(id).orElse(null);
        if (purchase != null) {
            purchase.setPurchaseOrderNumber(purchaseDetails.getPurchaseOrderNumber());
            purchase.setSupplierId(purchaseDetails.getSupplierId());
            purchase.setPurchaseDate(purchaseDetails.getPurchaseDate());
            purchase.setTotalAmount(purchaseDetails.getTotalAmount());
            purchase.setStatus(purchaseDetails.getStatus());
            purchase.setPaymentStatus(purchaseDetails.getPaymentStatus());
            return purchaseRepository.save(purchase);
        }
        return null;
    }

    public void deletePurchase(Long id) {
        purchaseRepository.deleteById(id);
    }
}
