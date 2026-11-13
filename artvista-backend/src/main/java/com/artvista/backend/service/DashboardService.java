package com.artvista.backend.service;

import com.artvista.backend.dto.*;
import com.artvista.backend.entity.*;
import com.artvista.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ArtistApplicationRepository applicationRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private ArtistLogReposirory logReposirory;

    @Autowired
    private CuratorApplicationRepository curatorApplicationRepository;

    @Autowired
    private DisputeRepository disputeRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ExhibitionRepository exhibitionRepository;
    @Autowired
    private CuratorLogRepository curatorLogRepository;

    public DashboardResponse getDashboardData() {

        DashboardResponse response = new DashboardResponse();

        response.setTotalUsers(userRepository.count());

        response.setTotalArtists(
                userRepository.countByRole(("ARTIST"))
        );

        response.setTotalArtworks(
                artworkRepository.count()
        );

        response.setTotalRevenue(
                orderRepository.getTotalRevenue()
        );

        List<Object[]> revenueData =
                orderRepository.getMonthlyRevenueRaw();

        List<MonthlyRevenueDTO> revenueDTOs =
                revenueData.stream()
                        .map(obj -> new MonthlyRevenueDTO(
                                (String) obj[0],
                                ((Number) obj[1]).doubleValue()
                        ))
                        .toList();

        response.setRevenueAnalytics(revenueDTOs);

        List<CategoryDTO> categoryData = artworkRepository.getCategoryList();

        List<CategoryDTO> categoryDTOs =
                categoryData.stream()
                        .map(obj -> new CategoryDTO(
                                obj.getCategory(),
                                obj.getCount()
                        ))
                        .toList();

        response.setArtworkCategories(categoryDTOs);


        List<ActivityLog> activities =
                activityRepository.findTop5ByOrderByCreatedAtDesc();

        List<ActivityDTO> activityDTOs =
                activities.stream()
                        .map(activity -> new ActivityDTO(
                                activity.getMessage(),
                                activity.getCreatedAt()
                        ))
                        .collect(Collectors.toList());

        response.setRecentActivities(activityDTOs);

        return response;
    }

    public ApplicationDTO getApplications(){
        ApplicationDTO dto = new ApplicationDTO();

        dto.setPending(applicationRepository.countByStatus("PENDING"));
        dto.setTotal(applicationRepository.countByStatus("APPROVED"));
        dto.setRejected(applicationRepository.countByStatus("REJECTED"));
        return dto;
    }

    public ArtistDashboardDTO getArtistDashboard(Long artistId){
        ArtistDashboardDTO dto = new ArtistDashboardDTO();
        dto.setArtistId(artistId);
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new RuntimeException("NOT FOUND"));
        dto.setArtistName(artist.getArtistName());
        dto.setProfilePicture(artist.getProfilePicture());
        dto.setCategory(artist.getCategory());
        dto.setTotalArtworks(
                artworkRepository.countByArtistId(artistId)
        );

        Double totalSales = orderRepository.getTotalSales(artistId);

        dto.setTotalSales(totalSales != null ? totalSales : 0.0);

        dto.setPendingOrders(
                orderRepository.getPendingOrders(artistId)
        );
        List<Order> orders = orderRepository.findByArtistId(artistId);

        List<OrderSummaryDTO> orderSummaries = orders.stream().map(o -> {
            OrderSummaryDTO summary = new OrderSummaryDTO();
            List<Artwork> artworks = artworkRepository.findAllById(o.getArtworkId());

            User user = userRepository.findById(o.getUserId()).orElseThrow(()->new RuntimeException("User not found"));

            summary.setOrderId(o.getId());
            summary.setArtworkTitle(artworks.get(0).getTitle());
            summary.setArtworkImage(artworks.get(0).getImageUrl());
            summary.setBuyerName(user.getName());
            summary.setPrice(o.getTotalAmount());
            summary.setStatus(o.getStatus());
            return summary;
        }).collect(Collectors.toList());

        dto.setOrders(orderSummaries);
        List<ArtistLog> logs = logReposirory.findByArtistId(artistId);
        dto.setRecentActivities(logs);

        List<Object[]> result =
                orderRepository.getMonthlySales(artistId);

        List<MonthlySalesDTO> monthlySales =
                result.stream()
                        .map(row -> new MonthlySalesDTO(
                                Month.of((Integer) row[0])
                                        .getDisplayName(
                                                TextStyle.SHORT,
                                                Locale.ENGLISH
                                        ),
                                ((Number) row[1]).doubleValue()
                        ))
                        .toList();

        dto.setMonthlySales(monthlySales);

        return dto;
    }

    public StaffManagementResponse getStaffDashboard() {

        long total = curatorApplicationRepository.count();

        long approved = curatorApplicationRepository.countByApproved("APPROVED");

        long pending = curatorApplicationRepository.countByApproved("PENDING");

        long rejected = curatorApplicationRepository.countByApproved("REJECTED");

        CuratorStatsDTO stats = new CuratorStatsDTO(
                total,
                approved,
                pending,
                rejected
        );

        List<CuratorApplication> applications =
                curatorApplicationRepository.findAll();

        return new StaffManagementResponse(
                stats,
                applications
        );
    }

    public AdminAnalyticsDTO getAnalytics() {

        Long totalUsers = userRepository.count();
        Long totalArtists = artistRepository.count();
        Long totalArtworks = artworkRepository.count();
        Long totalOrders = orderRepository.count();

        Double revenue = orderRepository.getTotalRevenue();

        Long activeDisputes = disputeRepository.countByStatus("OPEN");
        Long resolvedDisputes = disputeRepository.countByStatus("RESOLVED");

        List<WeeklyPerformanceDTO> weekly = List.of(
                new WeeklyPerformanceDTO("Mon", 45L),
                new WeeklyPerformanceDTO("Tue", 70L),
                new WeeklyPerformanceDTO("Wed", 55L),
                new WeeklyPerformanceDTO("Thu", 90L),
                new WeeklyPerformanceDTO("Fri", 65L),
                new WeeklyPerformanceDTO("Sat", 100L),
                new WeeklyPerformanceDTO("Sun", 80L)
        );

        return new AdminAnalyticsDTO(
                totalUsers,
                totalArtists,
                totalArtworks,
                totalOrders,
                revenue,
                activeDisputes,
                resolvedDisputes,
                18.5,
                weekly
        );
    }

    public CuratorOverview getCuratorDashboardData() {
        CuratorOverview dto = new CuratorOverview();

        dto.setTotalVisitors(bookingRepository.count());
        dto.setActiveExhibitions(exhibitionRepository.countByStatus("ACTIVE"));

        String trending = exhibitionRepository.findTrendingCollection();
        dto.setTrendingCollection(trending != null ? trending : "None Active");

        dto.setAnalytics(exhibitionRepository.getExhibitionAnalytics());

        dto.setLiveActivities(curatorLogRepository.findTop3ByOrderByCreatedAtDesc());

        return dto;
    }

}
