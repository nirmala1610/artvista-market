package com.artvista.backend.controller;

import com.artvista.backend.dto.ArtistMetadataResponse;
import com.artvista.backend.dto.ArtistProfileDTO;
import com.artvista.backend.dto.ArtistRequest;
import com.artvista.backend.entity.Artist;
import com.artvista.backend.entity.ArtistApplication;
import com.artvista.backend.entity.Artwork;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.ArtistApplicationRepository;
import com.artvista.backend.repository.ArtistRepository;
import com.artvista.backend.repository.ArtworkRepository;
import com.artvista.backend.repository.UserRepository;
import com.artvista.backend.service.CloudinaryService;
import com.artvista.backend.service.DashboardService;
import com.artvista.backend.service.UserDetailsImpl;
import com.cloudinary.Cloudinary;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final UserRepository userRepository;
    @Autowired
    private ArtistApplicationRepository artistApplicationRepository;
    @Autowired
    private ArtworkRepository artworkRepository;
    @Autowired
    private ArtistRepository artistRepository;
    @Autowired
    private DashboardService dashboardService;

    public ArtistController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/apply")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> applyingArtist(Authentication authentication,@Valid @RequestBody ArtistRequest request){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsArtist("APPLIED");
        userRepository.save(user);

        boolean alreadyApplied =
                artistApplicationRepository.existsByEmail(user.getEmail());

        if (alreadyApplied) {

            return ResponseEntity
                    .badRequest()
                    .body("You have already applied as an artist.");
        }

        ArtistApplication application = new ArtistApplication();

        application.setUserId(user.getId());
        application.setFullName(request.getFullName());
        application.setEmail(user.getEmail());
        application.setArtistName(request.getArtistName());
        application.setCategory(request.getCategory());
        application.setExperience(request.getExperience());
        application.setLocation(request.getLocation());
        application.setPortfolioUrl(request.getPortfolioUrl());
        application.setPortfolioSize(request.getPortfolioSize());
        application.setInstagram(request.getInstagram());
        application.setArtStation(request.getArtStation());
        application.setAdditionalLink(request.getAdditionalLink());
        application.setArtistBio(request.getArtistBio());
        application.setStatus("PENDING");

       application.setProfilePicture(request.getProfilePicture());

        List<String> artworkUrls = new ArrayList<>(request.getSampleArtworks());
        application.setSampleArtworks(artworkUrls);

        artistApplicationRepository.save(application);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/my-artworks")
    public ResponseEntity<?> getMyArtworks(Authentication authentication) {

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        Artist artist = artistRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Artist not found"));

        List<Artwork> artworks =
                artworkRepository.findByArtistId(artist.getId());

        return ResponseEntity.ok(artworks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArtistById(@PathVariable Long id) {
        return ResponseEntity.ok(artistRepository.findById(id));
    }


    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<?> getArtistDashboardData(Authentication authentication){

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        Artist artist = artistRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return ResponseEntity.ok(dashboardService.getArtistDashboard(artist.getId()));
    }

    @PutMapping("/profilePic-update")
    public ResponseEntity<?> updateProfilePicture(Authentication authentication,@RequestParam String image){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        Artist artist = artistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


       artist.setProfilePicture(image);
        artistRepository.save(artist);
        return ResponseEntity.ok(artist);
    }

    @GetMapping("/artist")
    public ResponseEntity<?> getFeaturedArtists() {
        return ResponseEntity.ok(artistRepository.findAll());
    }

    @GetMapping("/feturedArtist")
    public ResponseEntity<?> getFeaturedArtist() {
        return ResponseEntity.ok(artistRepository.findByFeatured(true));
    }

    @GetMapping("/artist-of-the-week")
    public ResponseEntity<?> getArtistOfWeek(){
        return ResponseEntity.ok(artistRepository.findById(7L));
    }



}
