package com.artvista.backend.service;

import com.artvista.backend.entity.ActivityLog;
import com.artvista.backend.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public void logActivity(String message) {

        ActivityLog log = new ActivityLog();

        log.setMessage(message);

        activityRepository.save(log);
    }
}
