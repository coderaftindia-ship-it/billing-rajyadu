package com.example.billingbackend.controller;

import com.example.billingbackend.model.InventoryMovement;
import com.example.billingbackend.service.InventoryMovementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory-movements")
public class InventoryMovementController {

    @Autowired
    private InventoryMovementService service;

    @GetMapping
    public List<InventoryMovement> getAllMovements() {
        return service.getAllMovements();
    }

    @PostMapping
    public InventoryMovement createMovement(@RequestBody InventoryMovement movement) {
        return service.createMovement(movement);
    }
}
