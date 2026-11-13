package com.artvista.backend.controller;

import com.artvista.backend.dto.DisputeRequest;
import com.artvista.backend.dto.ReportRequest;
import com.artvista.backend.dto.TicketRequest;
import com.artvista.backend.entity.Report;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.DisputeRepository;
import com.artvista.backend.repository.ReportRepository;
import com.artvista.backend.repository.UserRepository;
import com.artvista.backend.service.DisputeService;
import com.artvista.backend.service.ReportService;
import com.artvista.backend.service.SupportTicketService;
import com.artvista.backend.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private SupportTicketService supportTicketService;
    @Autowired
    private ReportService reportService;
    @Autowired
    private DisputeService disputeService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DisputeRepository disputeRepository;
    @Autowired
    private ReportRepository reportRepository;


    @PostMapping("/ticket")
    public ResponseEntity<?> createTicket(@RequestBody TicketRequest request,Authentication authentication) {
        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        supportTicketService.createTicket(email,request);

        return ResponseEntity.ok(
                "Ticket Submitted Successfully"
        );
    }

    @GetMapping("/getAllTicket")
    public ResponseEntity<?> getAllTickets(){
        return ResponseEntity.ok(
                reportRepository.findAll()
        );
    }

    @GetMapping("/getTicket")
    public ResponseEntity<?> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(
                supportTicketService.getMyTickets(
                        authentication.getName()
                )
        );
    }

    @PostMapping("/create-report")
    public ResponseEntity<?> submitReport(Authentication authentication,@RequestBody ReportRequest request) {

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report savedReport = reportService.createReport(request,user);
        return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
    }

    @GetMapping("/get-reports")
    public ResponseEntity<?> fetchReports(){
        return ResponseEntity.ok(reportRepository.findAll());
    }


    @PostMapping("/add-dispute")
    public ResponseEntity<?> createDispute(Authentication authentication,@RequestBody DisputeRequest request){
        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(disputeService.createDispute(user,request));
    }

    @GetMapping("/get-disputes")
    public ResponseEntity<?> getDisputes(Authentication authentication){
        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(disputeRepository.findByUserId(user.getId()));
    }

    @GetMapping("/dispute-stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(disputeService.getStats());
    }
}
