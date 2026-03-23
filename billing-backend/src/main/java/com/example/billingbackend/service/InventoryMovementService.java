package com.example.billingbackend.service;

import com.example.billingbackend.model.InventoryMovement;
import com.example.billingbackend.repository.InventoryMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryMovementService {

    @Autowired
    private InventoryMovementRepository repository;

    public List<InventoryMovement> getAllMovements() {
        return repository.findAll();
    }

    public InventoryMovement createMovement(InventoryMovement movement) {
        return repository.save(movement);
    }
}
