package com.artvista.backend.controller;

import com.artvista.backend.dto.ArtistProfileDTO;
import com.artvista.backend.dto.ArtworkFilterDTO;
import com.artvista.backend.dto.ArtworkUpdateDTO;
import com.artvista.backend.dto.SavedResponse;
import com.artvista.backend.entity.*;
import com.artvista.backend.repository.*;
import com.artvista.backend.service.ArtworkService;
import com.artvista.backend.service.UserDetailsImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    @Autowired
    private ArtworkRepository artworkRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private SavedRepository savedRepository;
    @Autowired
    private ArtistRepository artistRepository;
    @Autowired
    private ArtworkService artworkService;
    @Autowired
    private MongoTemplate mongoTemplate;


    @PostMapping("/upload")
    public ResponseEntity<?> uploadArtwork(Authentication authentication,@Valid @RequestBody ArtworkUpdateDTO dto){

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        Artist artist = artistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Artwork artwork = new Artwork();
        artwork.setTitle(dto.getTitle());
        artwork.setCategory(dto.getCategory());
        artwork.setImageUrl(dto.getImageUrl());
        artwork.setArtistId(artist.getId());
        artwork.setArtistName(artist.getArtistName());
        artwork.setPrice(dto.getPrice());
        artwork.setEdition(dto.getEdition());
        artwork.setYear(dto.getYear());
        artwork.setMedium(dto.getMedium());
        artwork.setOrientation(dto.getOrientation());
        artwork.setStyle(dto.getStyle());
        artwork.setSubject(dto.getSubject());
        artwork.setMaterial(dto.getMaterial());
        artwork.setHeight(dto.getHeight());
        artwork.setWidth(dto.getWidth());
        artwork.setDepth(dto.getDepth());
        artwork.setDescription(dto.getDescription());

        artworkRepo.save(artwork);
        return ResponseEntity.ok(artwork);

    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllArtwork(){
        return ResponseEntity.ok(artworkRepo.findAll());
    }

    @GetMapping("/search")
    public List<Artwork> search(
            @RequestParam String keyword
    ) {

        Query query = new Query();

        query.addCriteria(

                new Criteria().orOperator(

                        Criteria.where("title")
                                .regex(keyword, "i"),

                        Criteria.where("artist")
                                .regex(keyword, "i")

                )

        );

        query.limit(10);

        return mongoTemplate.find(
                query,
                Artwork.class
        );
    }

    @GetMapping("/price/{max}")
    public List<Artwork> getByPrice(@PathVariable double max) {
        return artworkRepo.findByPriceLessThanEqual(max);
    }

    @GetMapping("/category")
    public List<Artwork> getByCategory(@RequestParam String category){
        return artworkRepo.findByCategory(category);
    }

    @GetMapping("/medium")
    public List<Artwork> getByMedium(@RequestParam String medium){
        return artworkRepo.findByMedium(medium);
    }

    @GetMapping("/orientation")
    public List<Artwork> getByOrientation(@RequestParam String orientation){
        return artworkRepo.findByOrientation(orientation);
    }

    @GetMapping("/artDetail")
    public ResponseEntity<?> fetchArtwork(@RequestParam String artworkId) {
        return artworkRepo.findById(artworkId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/saved")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addToSaved(
            Authentication authentication,
            @RequestParam String artworkId) {

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Artwork artwork = artworkRepo.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        Saved item = savedRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Saved newSave = new Saved();
                    newSave.setUserId(user.getId());
                    newSave.setArtworkIds(new ArrayList<>());
                    return newSave;
                });

        if (!item.getArtworkIds().contains(artworkId)) {
            item.getArtworkIds().add(artworkId);
        }
        savedRepository.save(item);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/mySaved")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> fetchSavedArtworks(Authentication authentication) {

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Saved saved = savedRepository.findByUserId(user.getId())
                .orElse(null);

        List<SavedResponse> savedResponses = new ArrayList<>();

        if (saved == null || saved.getArtworkIds() == null) {
            return ResponseEntity.ok(savedResponses);
        }

        for (String artworkId : saved.getArtworkIds()) {

            Optional<Artwork> optionalArtwork =
                    artworkRepo.findById(artworkId);

            if (optionalArtwork.isEmpty()) {
                continue;
            }

            Artwork artwork = optionalArtwork.get();

            SavedResponse response = new SavedResponse();

            response.setArtworkId(artwork.getId());
            response.setImageUrl(artwork.getImageUrl());

            savedResponses.add(response);
        }

        return ResponseEntity.ok(savedResponses);
    }

    @DeleteMapping("/delete-saved")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> removeSaved(
            Authentication authentication,
            @RequestParam String artworkId) {

        try {

            UserDetailsImpl userDetails =
                    (UserDetailsImpl) authentication.getPrincipal();

            String email = userDetails.getUsername();

            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Saved saved = savedRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Saved list not found"));

            saved.getArtworkIds().remove(artworkId);

            savedRepository.save(saved);

            return ResponseEntity.ok("Artwork removed successfully");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting saved artwork");
        }
    }


    @DeleteMapping("/delete-artwork/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<?> removeArtwork(@PathVariable String id){
        Optional<Artwork> artworkOptional = artworkRepo.findById(id);

        if (artworkOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Artwork not found with id: " + id);
        }

        artworkRepo.deleteById(id);
        return ResponseEntity.ok("Artwork deleted successfully");
    }

    @PutMapping("/edit-artwork/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<?> editArtwork(
            @PathVariable String id,
            @RequestBody ArtworkUpdateDTO artworkUpdateDTO
    ) {

        Optional<Artwork> artworkOptional = artworkRepo.findById(id);

        if (artworkOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Artwork not found with id: " + id);
        }

        Artwork artwork = artworkOptional.get();


        if (artworkUpdateDTO.getTitle() != null) {
            artwork.setTitle(artworkUpdateDTO.getTitle());
        }

        if (artworkUpdateDTO.getCategory() != null) {
            artwork.setCategory(artworkUpdateDTO.getCategory());
        }

        if (artworkUpdateDTO.getImageUrl() != null) {
            artwork.setImageUrl(artworkUpdateDTO.getImageUrl());
        }

        if (artworkUpdateDTO.getPrice() != 0) {
            artwork.setPrice(artworkUpdateDTO.getPrice());
        }

        if (artworkUpdateDTO.getEdition() != 0) {
            artwork.setEdition(artworkUpdateDTO.getEdition());
        }

        if (artworkUpdateDTO.getYear() != null) {
            artwork.setYear(artworkUpdateDTO.getYear());
        }

        if (artworkUpdateDTO.getMedium() != null) {
            artwork.setMedium(artworkUpdateDTO.getMedium());
        }

        if (artworkUpdateDTO.getOrientation() != null) {
            artwork.setOrientation(artworkUpdateDTO.getOrientation());
        }

        if (artworkUpdateDTO.getStyle() != null) {
            artwork.setStyle(artworkUpdateDTO.getStyle());
        }

        if (artworkUpdateDTO.getSubject() != null) {
            artwork.setSubject(artworkUpdateDTO.getSubject());
        }

        if (artworkUpdateDTO.getMaterial() != null) {
            artwork.setMaterial(artworkUpdateDTO.getMaterial());
        }

        if(artworkUpdateDTO.getHeight() != null){
            artwork.setHeight(artworkUpdateDTO.getHeight());
        }

        if(artworkUpdateDTO.getWidth() != null){
            artwork.setWidth(artworkUpdateDTO.getWidth());
        }

        if(artworkUpdateDTO.getDepth() != null){
            artwork.setDepth(artworkUpdateDTO.getDepth());
        }

        if(artworkUpdateDTO.getDescription() != null){
            artwork.setDescription(artworkUpdateDTO.getDescription());
        }

        artworkRepo.save(artwork);

        return ResponseEntity.ok(artwork);
    }

    @PostMapping("/filter")
    public List<Artwork> filter(
            @RequestBody ArtworkFilterDTO dto
    ) {

        return artworkService.filterArtworks(dto);
    }

    @GetMapping("/random")
    public List<Artwork> getRandomArtworks() {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.sample(30)
        );

        AggregationResults<Artwork> results =
                mongoTemplate.aggregate(
                        aggregation,
                        "artworks",
                        Artwork.class
                );

        return results.getMappedResults();
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getArtistProfile(@PathVariable Long id) {

        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist Not found"));

        List<Artwork> artworks = artworkRepo.findByArtistId(id);
        System.out.println(artworks);


        ArtistProfileDTO dto = new ArtistProfileDTO();

        dto.setArtistId(artist.getId());
        dto.setArtistName(artist.getArtistName());

        dto.setCategory(artist.getCategory());
        dto.setExperience(artist.getExperience());
        dto.setLocation(artist.getLocation());

        dto.setPortfolioUrl(artist.getPortfolioUrl());
        dto.setPortfolioSize(artist.getPortfolioSize());

        dto.setInstagram(artist.getInstagram());
        dto.setArtStation(artist.getArtStation());
        dto.setAdditionalLink(artist.getAdditionalLink());

        dto.setArtistBio(artist.getArtistBio());
        dto.setProfilePicture(artist.getProfilePicture());

        dto.setApproved(artist.isApproved());

        dto.setArtworks(artworks);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/available")
    public ResponseEntity<?> availableExhibition(){
        return ResponseEntity.ok(artworkRepo.findByFeatured(false));
    }

}
