package com.artvista.backend.controller;

import com.artvista.backend.dto.*;
import com.artvista.backend.entity.Address;
import com.artvista.backend.entity.EmailOtp;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.AddressRepository;
import com.artvista.backend.repository.OtpRepository;
import com.artvista.backend.repository.UserRepository;
import com.artvista.backend.service.EmailService;
import com.artvista.backend.service.UserDetailsImpl;
import com.artvista.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepo;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final OtpRepository otpRepository;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
       if(userRepo.findByEmail(request.getEmail()).isEmpty()){
           User user = new User();
           user.setName(request.getName());
           user.setEmail(request.getEmail());
           user.setPassword(passwordEncoder.encode(request.getPassword()));
           user.setImage("https://img.icons8.com/?size=100&id=23265&format=png&color=000000");
           user.setIsArtist("NOT APPLIED");
           user.setIsCurater("NOT APPLIED");
           user.setRole("CUSTOMER");
           user.setJoinedAt(LocalDateTime.now());
           user.setVerified(false);
           userRepo.save(user);

           String otp = EmailService.OtpUtil.generateOtp();

           EmailOtp emailOtp = new EmailOtp();

           emailOtp.setEmail(request.getEmail());
           emailOtp.setOtp(otp);
           emailOtp.setExpiryTime(
                   LocalDateTime.now().plusMinutes(5)
           );

           otpRepository.save(emailOtp);

           emailService.sendOtp(request.getEmail(), otp);

           return ResponseEntity.ok(
                   Map.of(
                           "message", "OTP Sent"
                   )
           );
       }else{
           return ResponseEntity.badRequest()
                   .body(Map.of(
                           "message", "User already exists"
                   ));
       }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyRequest request){

        EmailOtp otpData =
                otpRepository.findByEmail(request.getEmail())
                        .orElse(null);

        if (otpData == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message", "OTP not found"
                    ));
        }

        if(LocalDateTime.now()
                .isAfter(otpData.getExpiryTime())){

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message", "OTP expired"
                    ));
        }

        if(!otpData.getOtp().equals(request.getOtp())){

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message", "Invalid OTP"
                    ));
        }

        User user =
                userRepo.findByEmail(request.getEmail())
                        .orElseThrow();

        user.setVerified(true);
        userRepo.save(user);

        otpRepository.delete(otpData);

        Authentication auth  = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = JwtUtil.generateToken(auth);

        return ResponseEntity.ok(Map.of(
                "token",token,
                "role",JwtUtil.extractRole(token)
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        Authentication auth  = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        String token = JwtUtil.generateToken(auth);

        return ResponseEntity.ok(Map.of(
                "token",token,
                    "role",JwtUtil.extractRole(token)
        ));
    }

   @PostMapping("/google")
    public  ResponseEntity<?> googleLogin(@RequestBody Map<String,String> body){
        String accessToken =  body.get("accessToken");

       RestTemplate restTemplate = new RestTemplate();
       String url = "https://www.googleapis.com/oauth2/v3/userinfo";

       HttpHeaders headers = new HttpHeaders();
       headers.setBearerAuth(accessToken);

       HttpEntity<String> entity = new HttpEntity<>(headers);

       ResponseEntity<Map> response = restTemplate.exchange(
               url,
               HttpMethod.GET,
               entity,
               Map.class
       );

       Map userInfo = response.getBody();

       String email = (String) userInfo.get("email");
       String name = (String) userInfo.get("name");
       String image = (String) userInfo.get("picture");

       User user = userRepo.findByEmail(email)
               .orElseGet(()->{
                   User newuser = new User();
                   newuser.setEmail(email);
                   newuser.setName(name);
                   newuser.setImage(image);
                   newuser.setRole("ROLE_CUSTOMER");
                   newuser.setPassword("");
                   newuser.setIsArtist("NOT APPLIED");
                   newuser.setIsCurater("NOT APPLIED");
                   newuser.setJoinedAt(LocalDateTime.now());
                   return  userRepo.save(newuser);
               });

       String token = JwtUtil.generateTokenByEmail(email);

       return  ResponseEntity.ok(Map.of(
               "token",token,
               "role",user.getRole()
       ));
   }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String,String> request){

        String email = request.get("email");

        User user = userRepo.findByEmail(email).orElse(null);

        if(user == null){
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message","User not found"
                    ));
        }

        otpRepository.findByEmail(email)
                .ifPresent(otpRepository::delete);

        String otp = EmailService.OtpUtil.generateOtp();

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setOtp(otp);
        emailOtp.setExpiryTime(
                LocalDateTime.now().plusMinutes(5)
        );

        otpRepository.save(emailOtp);

        emailService.sendOtp(email,otp);

        return ResponseEntity.ok(
                Map.of(
                        "message","OTP sent"
                )
        );
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request){

        EmailOtp otpData =
                otpRepository.findByEmail(request.getEmail())
                        .orElse(null);

        if(otpData == null){
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message","OTP not found"
                    ));
        }

        if(LocalDateTime.now()
                .isAfter(otpData.getExpiryTime())){

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message","OTP expired"
                    ));
        }

        if(!otpData.getOtp().equals(request.getOtp())){

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message","Invalid OTP"
                    ));
        }

        User user =
                userRepo.findByEmail(request.getEmail())
                        .orElseThrow();

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepo.save(user);

        otpRepository.delete(otpData);

        Authentication auth =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getNewPassword()
                        )
                );

        String token = JwtUtil.generateToken(auth);

        return ResponseEntity.ok(
                Map.of(
                        "token",token,
                        "role",JwtUtil.extractRole(token)
                )
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication){

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(Authentication authentication,@RequestBody UpdateRequset data){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(data.getPhone() != null && !data.getPhone().equals(user.getPhone())){
            user.setPhone(data.getPhone());
        }

        if(data.getCountry() != null && !data.getCountry().equals(user.getCountry())){
            user.setCountry(data.getCountry());
        }
        userRepo.save(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profilePic-update")
    public ResponseEntity<?> updateProfilePicture(Authentication authentication,@RequestParam String image){
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        user.setImage(image);
        userRepo.save(user);
        return ResponseEntity.ok(user);
    }
}
