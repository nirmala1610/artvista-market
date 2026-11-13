package com.artvista.backend.service;

import com.artvista.backend.dto.DisputeRequest;
import com.artvista.backend.dto.DisputeStatsDTO;
import com.artvista.backend.entity.Artwork;
import com.artvista.backend.entity.Dispute;
import com.artvista.backend.entity.Order;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.ArtworkRepository;
import com.artvista.backend.repository.DisputeRepository;
import com.artvista.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ArtworkRepository artworkRepository;

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    public Dispute createDispute(User user, DisputeRequest request){
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Target Artwork record not found"));

        Artwork artwork = artworkRepository.findById(order.getArtworkId().get(0))
                .orElseThrow(() -> new RuntimeException("Target Artwork record not found"));

        Dispute dispute = new Dispute();
        dispute.setOrderId(order.getId());
        dispute.setUserId(user.getId());
        dispute.setArtworkTitle(artwork.getTitle());
        dispute.setArtistName(artwork.getArtistName());
        dispute.setReason(request.getReason());
        dispute.setPriorityLevel(request.getPriorityLevel());
        dispute.setDescription(request.getDescription());
        dispute.setEvidence(request.getEvidence());
        dispute.setStatus("OPEN");
        dispute.setCreatedAt(LocalDateTime.now());

        disputeRepository.save(dispute);

        return dispute;
    }

    public Dispute updateStatus(Long id, String status) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));
        if(status.equals("REFUNDED")){
            dispute.setRefundAmount(500.0);
        }
        dispute.setStatus(status);

        return disputeRepository.save(dispute);
    }

    public DisputeStatsDTO getStats() {
        List<Dispute> disputes = disputeRepository.findAll();

        long open = disputes.stream()
                .filter(d -> "OPEN".equals(d.getStatus()))
                .count();

        long resolved = disputes.stream()
                .filter(d -> "RESOLVED".equals(d.getStatus()))
                .count();

        long highRisk = disputes.stream()
                .filter(d -> d.getPriorityLevel() != null &&
                        d.getPriorityLevel().equals("HIGH"))
                .count();

        double refundAmount = disputes.stream()
                .filter(d -> "REFUNDED".equals(d.getStatus()))
                .mapToDouble(d -> d.getRefundAmount() == null ? 0 : d.getRefundAmount())
                .sum();

        return new DisputeStatsDTO(open, resolved, highRisk, refundAmount);
    }
}
