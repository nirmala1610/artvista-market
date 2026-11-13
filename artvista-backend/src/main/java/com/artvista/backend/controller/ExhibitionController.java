package com.artvista.backend.controller;

import com.artvista.backend.dto.ArtworkResponse;
import com.artvista.backend.dto.ExhibitionArtwork;
import com.artvista.backend.dto.ExhibitionRequest;
import com.artvista.backend.dto.VisitorAnalyticsResponse;
import com.artvista.backend.entity.Artwork;
import com.artvista.backend.entity.CuratorLog;
import com.artvista.backend.entity.Exhibition;
import com.artvista.backend.repository.*;
import com.artvista.backend.service.ExhibitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/exhibitions")
public class ExhibitionController {

    @Autowired
    private ExhibitionService service;
    @Autowired
    private ExhibitionRepository exhibitionRepository;
    @Autowired
    private ArtworkRepository artworkRepository;
    @Autowired
    private CuratorLogRepository curatorLogRepository;
    @Autowired
    private SavedRepository savedRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/add")
    public ResponseEntity<?> createExhibition(
            @RequestBody ExhibitionRequest request) {

        try {
            Exhibition exhibition = service.createExhibition(request);
            return new ResponseEntity<>(exhibition, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/fetch")
    public ResponseEntity<List<Exhibition>> getAll() {
        return ResponseEntity.ok(service.getAllExhibitions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exhibition> getById(@PathVariable String id) {
        Exhibition exhibition = service.getById(id);

        if (exhibition == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(exhibition);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        service.deleteExhibition(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @GetMapping("/active")
    public ResponseEntity<List<Exhibition>> getActiveExhibitions() {
        return ResponseEntity.ok(
                exhibitionRepository.findByStatus("UPCOMING")
        );
    }

    @PostMapping("/{exhibitionId}/add-artwork")
    public ResponseEntity<?> addArtwork(
            @PathVariable String exhibitionId,
            @RequestBody ExhibitionArtwork artworkRequest
    ) {
        Exhibition exhibition = exhibitionRepository
                .findById(exhibitionId)
                .orElseThrow(() -> new RuntimeException("Exhibition not found"));

        if (exhibition.getArtworks() == null) {
            exhibition.setArtworks(new ArrayList<>());
        }
        Artwork artwork = artworkRepository.findById(artworkRequest.getArtworkId()).orElseThrow(()->new RuntimeException("not found"));
        artwork.setFeatured(true);
        artworkRepository.save(artwork);

        boolean alreadyExists = exhibition.getArtworks()
                .stream()
                .anyMatch(a -> a.getArtworkId().equals(artworkRequest.getArtworkId()));

        if (alreadyExists) {
            return ResponseEntity.badRequest()
                    .body("Artwork already added");
        }

        exhibition.getArtworks().add(artworkRequest);
        exhibitionRepository.save(exhibition);

        return ResponseEntity.ok("Artwork added successfully");
    }

    @PutMapping("/publish/{id}")
    public ResponseEntity<?> publishExhibition(@PathVariable String id){
        Exhibition exhibition = exhibitionRepository.findById(id).orElseThrow(()->new RuntimeException("not found"));
        exhibition.setStatus("ACTIVE");
        exhibitionRepository.save(exhibition);

        CuratorLog log = new CuratorLog();
        log.setMessage("A New Exhibition is published");
        log.setCreatedAt(LocalDateTime.now());
        curatorLogRepository.save(log);

        return ResponseEntity.ok(exhibition);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exhibition> updateExhibition(
            @PathVariable String id,
            @RequestBody Exhibition exhibitionDetails) {

        Exhibition updatedExhibition = service.updateExhibition(id, exhibitionDetails);
        return ResponseEntity.ok(updatedExhibition);
    }

    @GetMapping("/visitor")
    public ResponseEntity<VisitorAnalyticsResponse> getVisitorAnalytics() {

        List<Map<String, Object>> hourlyTraffic = curatorLogRepository.getHourlyActivityDistribution();

        long exhibitionActions = exhibitionRepository.count();
        long collectorSaves = savedRepository.count();
        long cartAdditions = cartRepository.count();
        long checkoutBookings = bookingRepository.count();

        long grandTotal = exhibitionActions + collectorSaves + cartAdditions + checkoutBookings;

        int viewPercent = grandTotal > 0 ? (int) ((exhibitionActions * 100) / grandTotal) : 25;
        int savePercent = grandTotal > 0 ? (int) ((collectorSaves * 100) / grandTotal) : 25;
        int cartPercent = grandTotal > 0 ? (int) ((cartAdditions * 100) / grandTotal) : 25;
        int bookingPercent = grandTotal > 0 ? (int) ((checkoutBookings * 100) / grandTotal) : 25;

        List<Map<String, Object>> heatmapZones = Arrays.asList(
                Map.of("zoneName", "Exhibition Showcase", "intensity", viewPercent, "topOffset", "25%", "leftOffset", "25%"),
                Map.of("zoneName", "Saved Collection", "intensity", savePercent, "topOffset", "25%", "leftOffset", "75%"),
                Map.of("zoneName", "Cart System", "intensity", cartPercent, "topOffset", "70%", "leftOffset", "75%"),
                Map.of("zoneName", "Ticket Booking Panel", "intensity", bookingPercent, "topOffset", "70%", "leftOffset", "25%")
        );

        List<ArtworkResponse> artworks = Arrays.asList(
                new ArtworkResponse("Dragon", "Paintings", "https://res.cloudinary.com/dxd1wajan/image/upload/v1778581974/jynbat0mjhmrrq6ax8kx.jpg", "Landscape", 21, "2017"),
                new ArtworkResponse("Chromatic Persona", "Concept Artwork", "https://res.cloudinary.com/dxd1wajan/image/upload/v1780891004/artvista/lwtku3c68r75h2zkwo5o.jpg", "Landscape", 14, "2023")
        );

        VisitorAnalyticsResponse response = new VisitorAnalyticsResponse(
                "100",
                "+18% this week",
                "4m",
                "Digital Art",
                "34% engagement spike",
                "5.4%",
                artworks,
                hourlyTraffic,
                heatmapZones // INJECTED DYNAMIC HEATMAP DATA
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam String locationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        boolean isAvailable = service.isLocationAvailable(locationId, startDate, endDate);
        return ResponseEntity.ok(isAvailable);
    }
}
