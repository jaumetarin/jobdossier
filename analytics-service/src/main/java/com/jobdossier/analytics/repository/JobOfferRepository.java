package com.jobdossier.analytics.repository;

import com.jobdossier.analytics.model.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    @Query(value = """
        SELECT "company" AS company, COUNT(*) AS count
        FROM "JobOffer"
        WHERE (:city IS NULL OR LOWER("location") LIKE LOWER(CONCAT('%', :city, '%')))
        GROUP BY "company"
        ORDER BY count DESC, "company" ASC
        LIMIT 10
        """, nativeQuery = true)
    List<TopCompanyProjection> findTopCompanies(@Param("city") String city);

    @Query(value = """
        SELECT LOWER(BTRIM(tech)) AS technology, COUNT(*) AS count
        FROM "JobOffer", UNNEST("technologies") AS tech
        WHERE tech IS NOT NULL AND BTRIM(tech) <> ''
        GROUP BY LOWER(BTRIM(tech))
        ORDER BY count DESC, technology ASC
        LIMIT :limit
        """, nativeQuery = true)
    List<TopTechnologyProjection> findTopTechnologies(@Param("limit") int limit);

    @Query(value = """
        SELECT LOWER(BTRIM(tech)) AS technology, "salaryText" AS salaryText
        FROM "JobOffer", UNNEST("technologies") AS tech
        WHERE "salaryText" IS NOT NULL
          AND tech IS NOT NULL
          AND BTRIM(tech) <> ''
        """, nativeQuery = true)
    List<SalarySampleProjection> findSalarySamplesByTechnology();
}
