package com.artvista.backend.service;

import com.artvista.backend.dto.ExhibitionRequest;
import com.artvista.backend.entity.Artist;
import com.artvista.backend.entity.CuratorLog;
import com.artvista.backend.entity.Exhibition;
import com.artvista.backend.repository.ArtistRepository;
import com.artvista.backend.repository.CuratorLogRepository;
import com.artvista.backend.repository.ExhibitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExhibitionService {
    @Autowired
    private ExhibitionRepository repository;
    @Autowired
    private ArtistRepository artistRepository; // Inject your ArtistRepository
    @Autowired
    private CuratorLogRepository curatorLogRepository;

    public Exhibition createExhibition(ExhibitionRequest request) {

        List<Long> selectedArtistNames = request.getSelectedArtists();
        if (selectedArtistNames != null && !selectedArtistNames.isEmpty()) {
            List<Artist> artistsToUpdate = artistRepository.findAllById(selectedArtistNames);

            artistsToUpdate.forEach(artist -> artist.setFeatured(true));

            artistRepository.saveAll(artistsToUpdate);
        }


        Exhibition exhibition = new Exhibition(
                null,
                request.getTitle(),
                request.getThemeName(),
                request.getCategory(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate(),
                request.getOpenTime(),
                request.getCloseTime(),
                request.getVisibility(),
                request.getStatus(),
                request.getIsPaid(),
                request.getTicketPrice(),
                request.getVipPrice(),
                request.getMaxVisitors(),
                request.getBannerUrl(),
                request.getSelectedArtists(),
                0,
                0,
                0.0,
                LocalDateTime.now(),
                new ArrayList<>(),
                request.getLocation()
        );

        CuratorLog log = new CuratorLog();
        log.setMessage("A New Exhibition Was planned");
        log.setCreatedAt(LocalDateTime.now());
        curatorLogRepository.save(log);

        return repository.save(exhibition);
    }

    public List<Exhibition> getAllExhibitions() {
        return repository.findAll();
    }

    public Exhibition getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteExhibition(String id) {
        repository.deleteById(id);
    }


    public Exhibition updateExhibition(String id, Exhibition details) {
        Exhibition exhibition = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exhibition instance matching ID not found: " + id));

        // Maps structural string properties
        exhibition.setTitle(details.getTitle());
        exhibition.setThemeName(details.getThemeName());
        exhibition.setCategory(details.getCategory());
        exhibition.setDescription(details.getDescription());

        // Maps timing configuration elements
        exhibition.setStartDate(details.getStartDate());
        exhibition.setEndDate(details.getEndDate());
        exhibition.setOpenTime(details.getOpenTime());
        exhibition.setCloseTime(details.getCloseTime());

        // Maps operational logic toggles
        exhibition.setVisibility(details.getVisibility());
        exhibition.setStatus(details.getStatus());

        // Maps structural calculations
        exhibition.setIsPaid(details.getIsPaid());
        exhibition.setTicketPrice(details.getTicketPrice());
        exhibition.setVipPrice(details.getVipPrice());
        exhibition.setMaxVisitors(details.getMaxVisitors());

        // Maps the cloud upload asset path pointer updated by the user
        exhibition.setBannerUrl(details.getBannerUrl());
        exhibition.setSelectedArtists(details.getSelectedArtists());

        CuratorLog log = new CuratorLog();
        log.setMessage("A New Exhibition Plan was changed");
        log.setCreatedAt(LocalDateTime.now());
        curatorLogRepository.save(log);

        return repository.save(exhibition);
    }

    public boolean isLocationAvailable(String locationId, LocalDate startDate, LocalDate endDate) {
        // If count > 0, it means an overlap exists, so the location is NOT available
        return !repository.existsOverlappingExhibition(locationId, startDate, endDate);
    }
}
