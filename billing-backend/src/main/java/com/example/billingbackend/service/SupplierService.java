
package com.example.billingbackend.service;

import com.example.billingbackend.model.Supplier;
import com.example.billingbackend.repository.SupplierRepository;
import com.example.billingbackend.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public java.util.List<com.example.billingbackend.model.SupplierSummary> getAllSupplierSummaries() {
        java.util.List<Supplier> suppliers = supplierRepository.findAll();
        java.util.List<com.example.billingbackend.model.SupplierSummary> summaries = new java.util.ArrayList<>();
        for (Supplier s : suppliers) {
            com.example.billingbackend.model.SupplierSummary sum = new com.example.billingbackend.model.SupplierSummary();
            sum.setSupplierId(s.getId());
            sum.setSupplierName(s.getName());

            java.util.List<com.example.billingbackend.model.Purchase> purchases = purchaseRepository
                    .findBySupplierId(s.getId());
            double totalPurchased = 0;
            double totalPaid = 0;
            int totalQty = 0;
            for (com.example.billingbackend.model.Purchase p : purchases) {
                if (p != null) {
                    totalPurchased += p.getTotalAmount();
                    totalPaid += p.getPaidAmount();
                    totalQty += p.getTotalQuantity();
                }
            }
            sum.setTotalPurchasedAmount(totalPurchased);
            sum.setTotalPaidAmount(totalPaid);
            sum.setTotalOutstandingAmount(totalPurchased - totalPaid);
            sum.setTotalQuantity(totalQty);
            sum.setPurchaseCount(purchases.size());
            summaries.add(sum);
        }
        return summaries;
    }

    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        Supplier supplier = supplierRepository.findById(id).orElse(null);
        if (supplier != null) {
            supplier.setName(supplierDetails.getName());
            supplier.setEmail(supplierDetails.getEmail());
            supplier.setPhone(supplierDetails.getPhone());
            supplier.setProductsSupplied(supplierDetails.getProductsSupplied());
            supplier.setContactPerson(supplierDetails.getContactPerson());
            supplier.setAddress(supplierDetails.getAddress());
            return supplierRepository.save(supplier);
        }
        return null;
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}
