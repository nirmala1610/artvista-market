package com.artvista.backend.controller;

import com.artvista.backend.dto.CuratorApplicationDTO;
import com.artvista.backend.dto.CuratorOverview;
import com.artvista.backend.entity.CuratorApplication;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.CuratorApplicationRepository;
import com.artvista.backend.repository.UserRepository;
import com.artvista.backend.service.DashboardService;
import com.artvista.backend.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/curator")
public class CuratorController {
    @Autowired
    private CuratorApplicationRepository curatorApplicationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DashboardService dashboardService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyCurator(Authentication authentication,@Valid @RequestBody CuratorApplicationDTO request){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsCurater("APPLIED");
        userRepository.save(user);

        CuratorApplication application = new CuratorApplication();

        application.setFullName(request.getFullName());
        application.setUserId(user.getId());
        application.setEmail(email);
        application.setPhone(request.getPhone());
        application.setProfilePhoto(user.getImage());
        application.setCurrentRole(request.getCurrentRole());
        application.setSpecializations(request.getSpecializations());
        application.setExperience(request.getExperience());
        application.setPortfolioUrl(request.getPortfolioUrl());
        application.setInstagram(request.getInstagram());
        application.setBehance(request.getBehance());
        application.setLinkedin(request.getLinkedin());
        application.setMotivation(request.getMotivation());
        application.setCurationStyle(request.getCurationStyle());
        application.setSkills(request.getSkills());
        application.setResumeUrl(request.getResumeUrl());
        application.setPortfolioPdfUrl(request.getPortfolioPdfUrl());
        application.setAdditionalNotes(request.getAdditionalNotes());
        application.setApproved("PENDING");
        application.setCreatedAt(LocalDateTime.now());

        curatorApplicationRepository.save(application);

        return  ResponseEntity.ok(application);
    }

    @GetMapping("/stats")
    public CuratorOverview getStats() {
        return dashboardService.getCuratorDashboardData();
    }

}
