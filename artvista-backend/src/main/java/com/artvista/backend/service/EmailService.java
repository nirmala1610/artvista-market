package com.artvista.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public class OtpUtil {

        public static String generateOtp() {

            Random random = new Random();

            return String.valueOf(
                    100000 + random.nextInt(900000)
            );
        }
    }

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("ArtVista | Email Verification Code");

        message.setText(
                "Welcome to ArtVista! 🎨\n\n" +
                        "Where creativity meets connection.\n" +
                        "Thank you for joining our art community.\n\n" +
                        "Your email verification code is: " + otp + "\n\n" +
                        "This code is valid for 5 minutes.\n" +
                        "Please do not share this code with anyone for security reasons.\n\n" +
                        "At ArtVista, we help artists showcase their masterpieces and help art lovers discover inspiring creations.\n\n" +
                        "Verify your email to continue your journey with us.\n\n" +
                        "Regards,\n" +
                        "Team ArtVista"
        );

        mailSender.send(message);
    }
}
