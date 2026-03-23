
package com.example.billingbackend.controller;

import com.example.billingbackend.model.Setting;
import com.example.billingbackend.service.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend to connect
public class SettingController {

    @Autowired
    private SettingService settingService;

    @GetMapping
    public List<Setting> getAllSettings() {
        return settingService.getAllSettings();
    }

    @GetMapping("/{id}")
    public Setting getSettingById(@PathVariable Long id) {
        return settingService.getSettingById(id);
    }

    @PostMapping
    public Setting createSetting(@RequestBody Setting setting) {
        return settingService.createSetting(setting);
    }

    @PutMapping("/batch")
    public List<Setting> updateSettingsBatch(@RequestBody List<Setting> settings) {
        return settingService.updateSettingsBatch(settings);
    }

    @DeleteMapping("/{id}")
    public void deleteSetting(@PathVariable Long id) {
        settingService.deleteSetting(id);
    }
}
