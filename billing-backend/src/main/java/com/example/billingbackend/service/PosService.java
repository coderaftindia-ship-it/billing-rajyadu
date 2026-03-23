
package com.example.billingbackend.service;

import com.example.billingbackend.model.Pos;
import com.example.billingbackend.repository.PosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PosService {

    @Autowired
    private PosRepository posRepository;

    public List<Pos> getAllPos() {
        return posRepository.findAll();
    }

    public Pos getPosById(Long id) {
        return posRepository.findById(id).orElse(null);
    }

    public Pos createPos(Pos pos) {
        return posRepository.save(pos);
    }

    public Pos updatePos(Long id, Pos posDetails) {
        Pos pos = posRepository.findById(id).orElse(null);
        if (pos != null) {
            pos.setTransactionDate(posDetails.getTransactionDate());
            pos.setTotalAmount(posDetails.getTotalAmount());
            pos.setPaymentMethod(posDetails.getPaymentMethod());
            pos.setCustomerId(posDetails.getCustomerId());
            pos.setItems(posDetails.getItems());
            return posRepository.save(pos);
        }
        return null;
    }

    public void deletePos(Long id) {
        posRepository.deleteById(id);
    }
}
