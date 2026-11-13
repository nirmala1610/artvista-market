package com.artvista.backend.service;

import com.artvista.backend.entity.Artist;
import com.artvista.backend.entity.Exhibition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.mongodb.client.result.UpdateResult;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExhibitionLifecycleScheduler {

    @Autowired
    private MongoTemplate mongoTemplate;

    // Runs automatically at the top of every hour
    @Scheduled(cron = "0 0 * * * *")
    public void autoCloseExpiredExhibitions() {
        LocalDate today = LocalDate.now();
        String targetStatus = "COMPLETED";

        // 1. Step A: Find all exhibitions that are expiring right now before we update their status
        Query findExpiredQuery = new Query(
                Criteria.where("endDate").lt(today)
                        .and("status").ne(targetStatus)
        );

        // Select only the 'selectedArtists' field to save memory overhead
        findExpiredQuery.fields().include("selectedArtists");
        List<Exhibition> expiredExhibitions = mongoTemplate.find(findExpiredQuery, Exhibition.class);

        if (!expiredExhibitions.isEmpty()) {
            // 2. Step B: Extract all unique Artist IDs connected to these closing exhibitions
            List<?> artistIdsToReset = expiredExhibitions.stream()
                    .map(Exhibition::getSelectedArtists)
                    .filter(artists -> artists != null)
                    .flatMap(List::stream)
                    .distinct()
                    .collect(Collectors.toList());

            if (!artistIdsToReset.isEmpty()) {
                Query artistQuery = new Query(Criteria.where("id").in(artistIdsToReset));
                Update artistUpdate = new Update().set("featured", false);

                UpdateResult artistResult = mongoTemplate.updateMulti(artistQuery, artistUpdate, Artist.class);
                System.out.println("Mongo Lifecycle Scheduler: Reset " + artistResult.getModifiedCount() + " artists from featured status.");
            }
        }

        // 4. Step D: Now, batch update the exhibitions themselves to "COMPLETED"
        Query exhibitionStatusQuery = new Query(
                Criteria.where("endDate").lt(today)
                        .and("status").ne(targetStatus)
        );
        Update exhibitionStatusUpdate = new Update().set("status", targetStatus);
        UpdateResult exhibitionResult = mongoTemplate.updateMulti(exhibitionStatusQuery, exhibitionStatusUpdate, Exhibition.class);

        if (exhibitionResult.getModifiedCount() > 0) {
            System.out.println("Mongo Lifecycle Scheduler: Closed " + exhibitionResult.getModifiedCount() + " expired exhibitions.");
        }
    }
}