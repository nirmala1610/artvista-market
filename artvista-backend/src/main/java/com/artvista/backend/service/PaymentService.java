package com.artvista.backend.service;

import com.artvista.backend.dto.PaymentVerificationRequest;
import com.artvista.backend.entity.Booking;
import com.artvista.backend.entity.Exhibition;
import com.artvista.backend.repository.BookingRepository;
import com.artvista.backend.repository.ExhibitionRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.apache.commons.codec.binary.Hex;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
public class PaymentService {

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    @Autowired
    private ExhibitionRepository exhibitionRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public String createOrder(Integer amount) throws Exception {
        RazorpayClient client = new RazorpayClient(key, secret);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100); // rupees to paise
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = client.orders.create(options);
        return order.toString();
    }

    public boolean verifyPayment(PaymentVerificationRequest request) {
        try {
            String payload =
                    request.getRazorpay_order_id() + "|" +
                            request.getRazorpay_payment_id();

            String generatedSignature = hmacSha256(payload, secret);

            if (!generatedSignature.equals(request.getRazorpay_signature())) {
                return false;
            }

            Exhibition exhibition =
                    exhibitionRepository.findById(request.getExhibitionId())
                            .orElseThrow();

            int seatsLeft =
                    exhibition.getMaxVisitors() - exhibition.getTicketsSold();

            if (request.getQuantity() > seatsLeft) {
                throw new RuntimeException("Not enough seats");
            }

            exhibition.setTicketsSold(
                    exhibition.getTicketsSold() + request.getQuantity()
            );
            exhibitionRepository.save(exhibition);

            Booking booking = new Booking();
            booking.setExhibitionId(request.getExhibitionId());
            booking.setQuantity(request.getQuantity());
            booking.setTotalAmount(
                    request.getQuantity() * exhibition.getTicketPrice()
            );
            booking.setPaymentId(request.getRazorpay_payment_id());
            booking.setOrderId(request.getRazorpay_order_id());
            booking.setStatus("PAID");

            bookingRepository.save(booking);

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String hmacSha256(String data, String secret) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey =
                new SecretKeySpec(secret.getBytes(), "HmacSHA256");

        sha256Hmac.init(secretKey);
        byte[] hash = sha256Hmac.doFinal(data.getBytes());

        return Hex.encodeHexString(hash);
    }
}
