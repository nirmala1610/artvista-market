package com.artvista.backend.controller;

import com.artvista.backend.dto.*;
import com.artvista.backend.entity.*;
import com.artvista.backend.repository.*;
import com.artvista.backend.service.AnalyticsService;
import com.artvista.backend.service.DashboardService;
import com.artvista.backend.service.DisputeService;
import com.artvista.backend.service.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;
    @Autowired
    private ArtistApplicationRepository artistApplicationRepository;
    @Autowired
    private ArtistRepository artistRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private CuratorApplicationRepository curatorApplicationRepository;
    @Autowired
    private CuratorRepository curatorRepository;
    @Autowired
    private DisputeService disputeService;
    @Autowired
    private AnalyticsService analyticsService;
    @Autowired
    private DisputeRepository disputeRepository;
    @Autowired
    private ReportRepository reportRepository;


    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }

    @GetMapping("/application-stats")
    @PreAuthorize("hasRole(('ADMIN'))")
    public ResponseEntity<?> getApplicationStats() {
        return ResponseEntity.ok(dashboardService.getApplications());
    }


    @GetMapping("/artist-application")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<ArtistApplication> getApplications(

            @RequestParam(defaultValue = "") String search,

            @RequestParam(defaultValue = "ALL") String status,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "6") int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id")
        );

        if (!search.isEmpty() && !status.equals("ALL")) {

            return artistApplicationRepository
                    .findByArtistNameContainingIgnoreCaseAndStatus(
                            search,
                            status,
                            pageable
                    );
        }

        if (!search.isEmpty()) {

            return artistApplicationRepository
                    .findByArtistNameContainingIgnoreCase(
                            search,
                            pageable
                    );
        }

        if (!status.equals("ALL")) {

            return artistApplicationRepository
                    .findByStatus(
                            status,
                            pageable
                    );
        }

        return artistApplicationRepository.findAll(pageable);
    }

    @GetMapping("/applications/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ArtistApplication getApplicationById(@PathVariable Long id) {
        return artistApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @PutMapping("/applications-status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        ArtistApplication application = artistApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        artistApplicationRepository.save(application);

        User user = userRepository.findById(application.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsArtist("REJECTED");

        if (status.equalsIgnoreCase("APPROVED")) {
            Artist artist = new Artist();

            user.setIsArtist("APPROVED");
            user.setRole("ARTIST");

            artist.setUserId(application.getUserId());
            artist.setFullName(application.getFullName());
            artist.setEmail(application.getEmail());
            artist.setArtistName(application.getArtistName());
            artist.setCategory(application.getCategory());
            artist.setExperience(application.getExperience());
            artist.setLocation(application.getLocation());
            artist.setArtistBio(application.getArtistBio());
            artist.setPortfolioUrl(application.getPortfolioUrl());
            artist.setPortfolioSize(application.getPortfolioSize());
            artist.setInstagram(application.getInstagram());
            artist.setAdditionalLink(application.getAdditionalLink());
            artist.setArtStation(application.getArtStation());
            artist.setProfilePicture(application.getProfilePicture());
            artist.setApproved(true);
            artist.setArtworkIds(application.getSampleArtworks());

            artistRepository.save(artist);

            ActivityLog log = new ActivityLog();
            log.setCreatedAt(LocalDateTime.now());
            log.setMessage("The New Artist was Approved");

            activityRepository.save(log);
        }
        userRepository.save(user);

        return ResponseEntity.ok("Application status updated to " + status);
    }

    @GetMapping("/staff-management")
    public ResponseEntity<StaffManagementResponse> getStaffManagement() {
        return ResponseEntity.ok(dashboardService.getStaffDashboard());
    }

    @PutMapping("/curator-status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setCuratorStatus(
            @PathVariable String id,
            @RequestParam String status) {

        CuratorApplication application = curatorApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setApproved(status);
        curatorApplicationRepository.save(application);

        User user = userRepository.findById(application.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsArtist("REJECTED");

        if (status.equalsIgnoreCase("APPROVED")) {
            Curator curator = new Curator();

            user.setIsArtist("APPROVED");
            user.setRole("CURATOR");

            curator.setFullName(application.getFullName());
            curator.setUserId(application.getUserId());
            curator.setEmail(application.getEmail());
            curator.setPhone(application.getPhone());
            curator.setProfilePhoto(application.getProfilePhoto());
            curator.setCurrentRole(application.getCurrentRole());
            curator.setSpecializations(application.getSpecializations());
            curator.setExperience(application.getExperience());
            curator.setPortfolioUrl(application.getPortfolioUrl());
            curator.setInstagram(application.getInstagram());
            curator.setBehance(application.getBehance());
            curator.setLinkedin(application.getLinkedin());
            curator.setMotivation(application.getMotivation());
            curator.setCurationStyle(application.getCurationStyle());
            curator.setSkills(application.getSkills());
            curator.setResumeUrl(application.getResumeUrl());
            curator.setPortfolioPdfUrl(application.getPortfolioPdfUrl());
            curator.setAdditionalNotes(application.getAdditionalNotes());
            curator.setSince(LocalDateTime.now());

            curatorRepository.save(curator);

            ActivityLog log = new ActivityLog();
            log.setCreatedAt(LocalDateTime.now());
            log.setMessage("The New Curator was Approved");

            activityRepository.save(log);
        }
        userRepository.save(user);

        return ResponseEntity.ok("Application status updated to " + status);
    }

    @GetMapping("/allUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }


    @GetMapping("/disputes")
    public List<Dispute> getAllDisputes() {
        return disputeService.getAllDisputes();
    }

    @PutMapping("/{id}/resolve")
    public Dispute resolveDispute(
            @PathVariable Long id) {

        Dispute dispute =
                disputeRepository.findById(id)
                        .orElseThrow();

        dispute.setStatus("Resolved");

        return disputeRepository.save(dispute);
    }

    @GetMapping("/analytics")
    public AdminAnalyticsDTO getAnalytics() {
        return dashboardService.getAnalytics();
    }

    @GetMapping("/download/analytics")
    public ResponseEntity<InputStreamResource> downloadReport() {

        AdminReportDTO analytics = analyticsService.generateAnalytics();

        ReportDTO report = new ReportDTO();
        report.setGeneratedBy("Nirmaladevi S");
        report.setDate(LocalDate.now().toString());
        report.setTotalRevenue(analytics.getTotalRevenue());
        report.setTotalUsers(analytics.getTotalUsers());
        report.setTotalArtworks(analytics.getTotalArtworks());
        report.setActiveDisputes(analytics.getPendingDisputes());

        report.setWeeklyRevenue(analyticsService.getWeeklyRevenue());

        ByteArrayInputStream pdf = analyticsService.generatePdfReport(report);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition",
                "attachment; filename=report_.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }

    @PutMapping("/update-dispute/{id}/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public  ResponseEntity<?> updateDisputeStaus(@PathVariable Long id,@PathVariable String status){
        return ResponseEntity.ok(disputeService.updateStatus(id,status));
    }

}
