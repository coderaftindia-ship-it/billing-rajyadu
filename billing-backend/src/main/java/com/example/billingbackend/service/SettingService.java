
package com.example.billingbackend.service;

import com.example.billingbackend.model.Setting;
import com.example.billingbackend.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SettingService {

    @Autowired
    private SettingRepository settingRepository;

    public List<Setting> getAllSettings() {
        return settingRepository.findAll();
    }

    public Setting getSettingById(Long id) {
        return settingRepository.findById(id).orElse(null);
    }

    public Setting createSetting(Setting setting) {
        return settingRepository.save(setting);
    }

    @Transactional
    public List<Setting> updateSettingsBatch(List<Setting> settings) {
        List<Setting> updatedSettings = new ArrayList<>();
        if (settings == null) return updatedSettings;
        
        for (Setting s : settings) {
            if (s.getKey() == null) continue;
            
            Optional<Setting> existing = settingRepository.findByKey(s.getKey());
            if (existing.isPresent()) {
                Setting existingSetting = existing.get();
                existingSetting.setValue(s.getValue());
                updatedSettings.add(settingRepository.save(existingSetting));
            } else {
                updatedSettings.add(settingRepository.save(s));
            }
        }
        return updatedSettings;
    }

    public Setting updateSetting(Long id, Setting settingDetails) {
        Setting setting = settingRepository.findById(id).orElse(null);
        if (setting != null) {
            setting.setKey(settingDetails.getKey());
            setting.setValue(settingDetails.getValue());
            return settingRepository.save(setting);
        }
        return null;
    }

    public void deleteSetting(Long id) {
        settingRepository.deleteById(id);
    }
}
