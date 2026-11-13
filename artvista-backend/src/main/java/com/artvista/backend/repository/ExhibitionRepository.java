package com.artvista.backend.repository;

import com.artvista.backend.dto.AnalyticsDTO;
import com.artvista.backend.entity.Exhibition;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExhibitionRepository extends MongoRepository<Exhibition, String> {
    List<Exhibition> findByStatus(String status);

    // 1. Find Trending Collection (Active with highest ticket count)
    @Aggregation(pipeline = {
            "{ '$match': { 'status': 'ACTIVE' } }",
            "{ '$lookup': { 'from': 'tickets', 'localField': '_id', 'foreignField': 'exhibitionId', 'as': 'ticketDocs' } }",
            "{ '$project': { 'title': 1, 'ticketCount': { '$size': '$ticketDocs' } } }",
            "{ '$sort': { 'ticketCount': -1 } }",
            "{ '$limit': 1 }"
    })
    String findTrendingCollection();

    // 2. Exhibition Analytics Chart Data (Left Join + Group By + Conditional Projection)
    @Aggregation(pipeline = {
            "{ '$lookup': { 'from': 'tickets', 'localField': '_id', 'foreignField': 'exhibitionId', 'as': 'ticketDocs' } }",
            "{ '$unwind': { 'path': '$ticketDocs', 'preserveNullAndEmptyArrays': true } }",
            "{ '$group': { " +
                    "'_id': '$_id', " +
                    "'exhibitionTitle': { '$first': '$title' }, " +
                    "'rawCount': { '$sum': 1 }, " +
                    "'revenue': { '$sum': '$ticketDocs.price' }, " +
                    "'checkNull': { '$first': '$ticketDocs' }" +
                    "} }",
            "{ '$project': { " +
                    "'_id': 1, " +
                    "'exhibitionTitle': 1, " +
                    "'revenue': 1, " +
                    "'ticketsSold': { '$cond': [ { '$ifNull': [ '$checkNull', false ] }, '$rawCount', 0 ] }" +
                    "} }"
    })
    List<AnalyticsDTO> getExhibitionAnalytics();
    long countByStatus(String active);

    @Query("SELECT COUNT() > 0 FROM Exhibition  WHERE e.location = location " +
            "AND (startDate <= endDate AND endDate >= startDate)")
    boolean existsOverlappingExhibition(
            @Param("locationId") String locationId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
