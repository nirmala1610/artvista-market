package com.artvista.backend.controller;

import com.artvista.backend.dto.AddressRequest;
import com.artvista.backend.entity.Address;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.AddressRepository;
import com.artvista.backend.repository.UserRepository;
import com.artvista.backend.service.UserDetailsImpl;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AddressRepository addressRepository;

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<?> addAddress(Authentication authentication,
                                        @RequestBody AddressRequest data) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("Incoming isDefault: " + data.isDefault());

        Address address = new Address();
        address.setUserId(user.getId());
        address.setFirstName(data.getFirstName());
        address.setLastName(data.getLastName());
        address.setAddressLine1(data.getAddressLine1());
        address.setAddressLine2(data.getAddressLine2());
        address.setCity(data.getCity());
        address.setState(data.getState());
        address.setCountry(data.getCountry());
        address.setZipcode(data.getZipcode());
        address.setPhoneNumber(data.getPhoneNumber());
        address.setEmail(data.getEmail());

        boolean hasAddresses = !addressRepository.findByUserId(user.getId()).isEmpty();

        if (data.isDefault()){
            addressRepository.updateAllDefaultsToFalse(user.getId());
            address.setDefault(true);
        } else if (!hasAddresses) {
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }
        System.out.println("Saving isDefault: " + address.isDefault());
        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(saved);
    }


    @GetMapping("/default")
    public ResponseEntity<?> getDefaultAddress(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Address> defaultAddress = addressRepository.findByUserIdAndIsDefaultTrue(user.getId());

        return defaultAddress.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/list")
    public ResponseEntity<?> listAddresses(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Address> addresses = addressRepository.findByUserId(user.getId());
        return ResponseEntity.ok(addresses);
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        addressRepository.updateAllDefaultsToFalse(user.getId());

        address.setDefault(true);
        addressRepository.save(address);

        return ResponseEntity.ok(address);
    }

    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<?> updateAddress(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody AddressRequest data) {

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setFirstName(data.getFirstName());
        address.setLastName(data.getLastName());
        address.setAddressLine1(data.getAddressLine1());
        address.setAddressLine2(data.getAddressLine2());
        address.setCity(data.getCity());
        address.setState(data.getState());
        address.setCountry(data.getCountry());
        address.setZipcode(data.getZipcode());
        address.setPhoneNumber(data.getPhoneNumber());
        address.setEmail(data.getEmail());

        if (data.isDefault()) {
            addressRepository.updateAllDefaultsToFalse(user.getId());
            address.setDefault(true);

        }
        Address updatedAddress = addressRepository.save(address);

        return ResponseEntity.ok(updatedAddress);
    }

}

