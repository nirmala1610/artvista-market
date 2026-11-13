package com.artvista.backend.controller;

import com.artvista.backend.entity.Artwork;
import com.artvista.backend.entity.Cart;
import com.artvista.backend.entity.CartItem;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.ArtworkRepository;
import com.artvista.backend.repository.CartRepository;
import com.artvista.backend.repository.UserRepository;
import com.artvista.backend.service.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final UserRepository userRepository;
    private final ArtworkRepository artworkRepository;
    private final CartRepository cartRepository;

    public CartController(UserRepository userRepository, ArtworkRepository artworkRepository, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.artworkRepository = artworkRepository;
        this.cartRepository = cartRepository;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addToCart(Authentication authentication,
                                       @RequestParam String artworkId) {

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(user.getId());
                    newCart.setItems(new ArrayList<>());
                    return newCart;
                });

        // extra safety
        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        boolean exists = cart.getItems().stream()
                .anyMatch(i -> i.getArtworkId().equals(artworkId));

        if (exists) {
            return ResponseEntity.badRequest()
                    .body("Artwork already exists in cart");
        }

        CartItem item = new CartItem();

        item.setArtworkId(artworkId);
        item.setTitle(artwork.getTitle());
        item.setImageUrl(artwork.getImageUrl());
        item.setPrice(artwork.getPrice());
        item.setEdition(artwork.getEdition());
        item.setYear(artwork.getYear());
        item.setCategory(artwork.getCategory());
        item.setOrientation(artwork.getOrientation());

        cart.getItems().add(item);

        cartRepository.save(cart);

        return ResponseEntity.ok(cart);
    }


    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getMyCart(Authentication authentication){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(cartRepository.findByUserId(user.getId()).orElse(null));
    }

    @DeleteMapping("/remove")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> removeItem(Authentication authentication,@RequestParam String artworkId){

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow();

        cart.getItems().removeIf(cartItem -> cartItem.getArtworkId().equals(artworkId));
        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }
}
