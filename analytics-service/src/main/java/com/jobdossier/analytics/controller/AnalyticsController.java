package com.jobdossier.analytics.controller;

import com.jobdossier.analytics.dto.SalaryByStackDto;
import com.jobdossier.analytics.dto.TopCompanyDto;
import com.jobdossier.analytics.dto.TopTechnologyDto;
import com.jobdossier.analytics.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics/ping")
    public Map<String, String> ping() {
        return Map.of("status", "ok", "service", "analytics-service");
    }

    @GetMapping("/analytics/top-companies")
    public List<TopCompanyDto> getTopCompanies(@RequestParam(required = false) String city) {
        return analyticsService.getTopCompanies(city);
    }

    @GetMapping("/analytics/top-technologies")
    public List<TopTechnologyDto> getTopTechnologies(@RequestParam(defaultValue = "10") int limit) {
        return analyticsService.getTopTechnologies(limit);
    }

    @GetMapping("/analytics/salary-by-stack")
    public List<SalaryByStackDto> getSalaryByStack() {
        return analyticsService.getSalaryByStack();
    }
}
