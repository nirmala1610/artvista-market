package com.artvista.backend.controller;

import com.artvista.backend.dto.AllOrderResponse;
import com.artvista.backend.dto.ArtworkResponse;
import com.artvista.backend.entity.*;
import com.artvista.backend.repository.*;
import com.artvista.backend.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController{

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ArtworkRepository artworkRepository;
    private final ArtistRepository artistRepository;
    @Autowired
    private ArtistLogReposirory artistLogReposirory;

    public OrderController(UserRepository userRepository, CartRepository cartRepository, OrderRepository orderRepository, ArtworkRepository artworkRepository,ArtistRepository artistRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.artworkRepository = artworkRepository;
        this.artistRepository = artistRepository;

    }
    private String getOrderStatus(LocalDateTime createdAt) {

        LocalDateTime now = LocalDateTime.now();

        if (createdAt.plusDays(2).isBefore(now)) {
            return "DELIVERED";
        }
        else if (createdAt.plusDays(1).isBefore(now)) {
            return "SHIPPED";
        }
        else {
            return "PAID";
        }
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> checkout(Authentication authentication,@RequestParam double totalAmount,@RequestParam String artworkId){
        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Artwork artwork = artworkRepository.findById(artworkId) .orElseThrow(() -> new RuntimeException("Artwork not found"));
        ArtistLog log = new ArtistLog();
        log.setArtistId(artwork.getArtistId());
        log.setMessage("New Order placed by "+user.getName()+" for "+artwork.getTitle());
        log.setCreatedAt(LocalDateTime.now());
        artistLogReposirory.save(log);

        artwork.setEdition(artwork.getEdition()-1);
        artworkRepository.save(artwork);

        Order order = new Order();
        order.setUserId(user.getId());
        order.setTotalAmount(totalAmount);
        order.setStatus("PAID");
        order.setCreatedAt(LocalDateTime.now());
        order.setTrackingId(UUID.randomUUID().toString());
        order.getArtworkId().add(artworkId);
        order.setArtistId(artwork.getArtistId());

        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> myOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AllOrderResponse> allOrder = new ArrayList<>();
        List<Order> orders = orderRepository.findByUserId(user.getId());

        for (Order order : orders) {

            List<ArtworkResponse> artworkResponses = new ArrayList<>();

            for (String artworkId : order.getArtworkId()) {

                Optional<Artwork> optionalArtwork =
                        artworkRepository.findById(artworkId);

                if (optionalArtwork.isEmpty()) {
                    continue;
                }

                Artwork artwork = optionalArtwork.get();

                ArtworkResponse ar = new ArtworkResponse();

                ar.setTitle(artwork.getTitle());
                ar.setCategory(artwork.getCategory());
                ar.setImageUrl(artwork.getImageUrl());
                ar.setEdition(artwork.getEdition());
                ar.setYear(artwork.getYear());
                ar.setOrientation(artwork.getOrientation());

                artworkResponses.add(ar);
            }

            if (artworkResponses.isEmpty()) {
                continue;
            }

            AllOrderResponse newOrder = new AllOrderResponse();

            newOrder.setOrderId(order.getId());
            newOrder.setArtworks(artworkResponses);
            newOrder.setTotalAmount(order.getTotalAmount());

            String updatedStatus = getOrderStatus(order.getCreatedAt());

            order.setStatus(updatedStatus);
            orderRepository.save(order);

            newOrder.setStatus(order.getStatus());
            newOrder.setCreatedAt(order.getCreatedAt());
            newOrder.setTrackingId(order.getTrackingId());

            allOrder.add(newOrder);
        }
        return ResponseEntity.ok(allOrder);
    }

    @GetMapping("/current")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> fetchCurrentOrders(Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AllOrderResponse> currntOrder = new ArrayList<>();
        List<Order> orders = orderRepository.findByUserId(user.getId());

        for (Order order : orders) {

            String updatedStatus = getOrderStatus(order.getCreatedAt());
            order.setStatus(updatedStatus);
            orderRepository.save(order);

            if ("PAID".equals(order.getStatus()) ||
                    "SHIPPED".equals(order.getStatus())) {

                List<ArtworkResponse> artworkResponses = new ArrayList<>();

                for (String artworkId : order.getArtworkId()) {

                    Optional<Artwork> optionalArtwork =
                            artworkRepository.findById(artworkId);

                    if (optionalArtwork.isEmpty()) {
                        continue;
                    }

                    Artwork artwork = optionalArtwork.get();

                    ArtworkResponse ar = new ArtworkResponse();

                    ar.setTitle(artwork.getTitle());
                    ar.setCategory(artwork.getCategory());
                    ar.setImageUrl(artwork.getImageUrl());
                    ar.setEdition(artwork.getEdition());
                    ar.setYear(artwork.getYear());
                    ar.setOrientation(artwork.getOrientation());

                    artworkResponses.add(ar);
                }

                AllOrderResponse newOrder = new AllOrderResponse();

                newOrder.setArtworks(artworkResponses);
                newOrder.setTotalAmount(order.getTotalAmount());
                newOrder.setStatus(order.getStatus());
                newOrder.setCreatedAt(order.getCreatedAt());
                newOrder.setTrackingId(order.getTrackingId());

                currntOrder.add(newOrder);
            }
        }
        return ResponseEntity.ok(currntOrder);
    }

}
