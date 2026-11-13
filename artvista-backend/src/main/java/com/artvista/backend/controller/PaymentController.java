package com.artvista.backend.controller;

import com.artvista.backend.dto.PaymentVerificationRequest;
import com.artvista.backend.entity.Booking;
import com.artvista.backend.entity.CuratorLog;
import com.artvista.backend.entity.Exhibition;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.BookingRepository;
import com.artvista.backend.repository.CuratorLogRepository;
import com.artvista.backend.repository.ExhibitionRepository;
import com.artvista.backend.repository.UserRepository;
import com.artvista.backend.service.PaymentService;
import com.artvista.backend.service.UserDetailsImpl;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ExhibitionRepository exhibitionRepository;
    @Autowired
    private CuratorLogRepository curatorLogRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam Integer amount)
            throws Exception {

        String order = paymentService.createOrder(amount);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(
            @RequestBody PaymentVerificationRequest request, Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean verified = paymentService.verifyPayment(request);

        if (verified) {
            Booking booking = new Booking();
            booking.setExhibitionId(request.getExhibitionId());
            booking.setUserId(user.getId());
            booking.setQuantity(request.getQuantity());
            booking.setTotalAmount(request.getTotalAmount());
            booking.setPaymentId(request.getRazorpay_payment_id());
            booking.setOrderId(request.getRazorpay_order_id());
            booking.setVisitDate(LocalDate.parse(request.getVisitDate()));
            booking.setStatus("SUCCESS");
            bookingRepository.save(booking);

            Exhibition exhibition = exhibitionRepository.findById(request.getExhibitionId()).orElseThrow(()->new RuntimeException("not found"));

            CuratorLog log = new CuratorLog();
            log.setMessage(request.getQuantity()+" Tickets sold for "+exhibition.getTitle());
            log.setCreatedAt(LocalDateTime.now());
            curatorLogRepository.save(log);

            exhibition.setViews(exhibition.getViews()+1);
            exhibition.setTicketsSold(exhibition.getTicketsSold()+ request.getQuantity());
            exhibition.setRevenue(request.getTotalAmount());
            exhibitionRepository.save(exhibition);

            return ResponseEntity.ok("Payment verified");
        }

        return ResponseEntity.badRequest().body("Payment failed");
    }

    @PostMapping("/free")
    public ResponseEntity<?> bookFreeTicket(Authentication authentication,@RequestBody PaymentVerificationRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setExhibitionId(request.getExhibitionId());
        booking.setUserId(user.getId());
        booking.setQuantity(1);

        booking.setStatus("PAYMENT COMPLETED");
        bookingRepository.save(booking);

        Exhibition exhibition = exhibitionRepository.findById(request.getExhibitionId()).orElseThrow(()->new RuntimeException("not found"));

        exhibition.setViews(exhibition.getViews()+1);
        exhibition.setTicketsSold(exhibition.getTicketsSold()+ 1 );

        exhibitionRepository.save(exhibition);

        return ResponseEntity.ok("Payment verified");
    }

    @GetMapping("/availability/{exhibitionId}/{date}")
    public Map<String, Object> getAvailability(
            @PathVariable String exhibitionId,
            @PathVariable String date
    ) {
        Exhibition exhibition =
                exhibitionRepository.findById(exhibitionId).orElseThrow();

        LocalDate visitDate = LocalDate.parse(date);

        Integer booked =
                bookingRepository.getBookedTicketsForDay(exhibitionId, visitDate);

        int remaining = exhibition.getMaxVisitors() - booked;

        Map<String, Object> response = new HashMap<>();
        response.put("booked", booked);
        response.put("remaining", remaining);

        return response;
    }
}
