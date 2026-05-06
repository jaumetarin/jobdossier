package com.jobdossier.analytics.service;

import com.jobdossier.analytics.dto.SalaryByStackDto;
import com.jobdossier.analytics.dto.TopCompanyDto;
import com.jobdossier.analytics.dto.TopTechnologyDto;
import com.jobdossier.analytics.repository.JobOfferRepository;
import com.jobdossier.analytics.repository.SalarySampleProjection;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AnalyticsService {

    private static final Pattern SALARY_TOKEN = Pattern.compile("(\\d+(?:[.,]\\d+)?)\\s*([kK]?)");
    private final JobOfferRepository jobOfferRepository;

    public AnalyticsService(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    public List<TopCompanyDto> getTopCompanies(String city) {
        return jobOfferRepository.findTopCompanies(city).stream()
                .map(row -> new TopCompanyDto(row.getCompany(), row.getCount()))
                .toList();
    }

    public List<TopTechnologyDto> getTopTechnologies(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 20));
        return jobOfferRepository.findTopTechnologies(safeLimit).stream()
                .map(row -> new TopTechnologyDto(row.getTechnology(), row.getCount()))
                .toList();
    }

    public List<SalaryByStackDto> getSalaryByStack() {
        Map<String, List<Double>> salariesByTechnology = new HashMap<>();

        for (SalarySampleProjection row : jobOfferRepository.findSalarySamplesByTechnology()) {
            Double parsedSalary = parseSalary(row.getSalaryText());
            if (parsedSalary == null) continue;
            salariesByTechnology
                    .computeIfAbsent(row.getTechnology(), key -> new ArrayList<>())
                    .add(parsedSalary);
        }

        return salariesByTechnology.entrySet().stream()
                .map(entry -> {
                    double average = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0);
                    double rounded = Math.round(average * 100.0) / 100.0;
                    return new SalaryByStackDto(entry.getKey(), rounded, (long) entry.getValue().size());
                })
                .sorted(Comparator.comparing(SalaryByStackDto::averageSalary).reversed())
                .toList();
    }

    private Double parseSalary(String salaryText) {
        if (salaryText == null || salaryText.isBlank()) return null;

        List<Double> values = new ArrayList<>();
        Matcher matcher = SALARY_TOKEN.matcher(salaryText);

        while (matcher.find()) {
            String rawNumber = matcher.group(1).replace(",", ".");
            boolean isK = !matcher.group(2).isBlank();

            try {
                double value = Double.parseDouble(rawNumber);
                if (isK) value *= 1000;
                if (!isK && value < 1000) continue;
                values.add(value);
            } catch (NumberFormatException ignored) {
            }
        }

        if (values.isEmpty()) return null;
        if (values.size() == 1) return values.get(0);
        return (values.get(0) + values.get(1)) / 2.0;
    }
}
