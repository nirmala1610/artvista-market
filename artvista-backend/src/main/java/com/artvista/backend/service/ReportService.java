package com.artvista.backend.service;


import com.artvista.backend.dto.AdminReportDTO;
import com.artvista.backend.dto.ReportDTO;
import com.artvista.backend.dto.ReportRequest;
import com.artvista.backend.entity.Artwork;
import com.artvista.backend.entity.Order;
import com.artvista.backend.entity.Report;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.*;
import java.io.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DisputeRepository disputeRepository;

    public Report createReport(ReportRequest request, User user) {

        Artwork artwork = artworkRepository.findById(request.getArtworkId())
                .orElseThrow(() -> new RuntimeException("Target Artwork record not found"));

        Report report = new Report();
        report.setArtworkId(artwork.getId());
        report.setArtistName(artwork.getArtistName());
        report.setArtworkTitle(artwork.getTitle());
        report.setReason(request.getReason());
        report.setCreatedAt(LocalDateTime.now());
        report.setStatus("UNDER_REVIEW");
        report.setUserId(user.getId());
        report.setDescription(request.getDescription());
        report.setEvidence(request.getEvidence());

        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }

}
