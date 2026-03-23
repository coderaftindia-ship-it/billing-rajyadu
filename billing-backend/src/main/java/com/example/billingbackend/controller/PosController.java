
package com.example.billingbackend.controller;

import com.example.billingbackend.model.Pos;
import com.example.billingbackend.service.PosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pos")
public class PosController {

    @Autowired
    private PosService posService;

    @GetMapping
    public List<Pos> getAllPos() {
        return posService.getAllPos();
    }

    @GetMapping("/{id}")
    public Pos getPosById(@PathVariable Long id) {
        return posService.getPosById(id);
    }

    @PostMapping
    public Pos createPos(@RequestBody Pos pos) {
        return posService.createPos(pos);
    }

    @PutMapping("/{id}")
    public Pos updatePos(@PathVariable Long id, @RequestBody Pos posDetails) {
        return posService.updatePos(id, posDetails);
    }

    @DeleteMapping("/{id}")
    public void deletePos(@PathVariable Long id) {
        posService.deletePos(id);
    }
}
