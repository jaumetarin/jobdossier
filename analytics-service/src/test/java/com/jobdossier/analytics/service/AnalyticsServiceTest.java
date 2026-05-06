package com.jobdossier.analytics.service;

import com.jobdossier.analytics.dto.SalaryByStackDto;
import com.jobdossier.analytics.dto.TopCompanyDto;
import com.jobdossier.analytics.dto.TopTechnologyDto;
import com.jobdossier.analytics.repository.JobOfferRepository;
import com.jobdossier.analytics.repository.SalarySampleProjection;
import com.jobdossier.analytics.repository.TopCompanyProjection;
import com.jobdossier.analytics.repository.TopTechnologyProjection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class AnalyticsServiceTest {

    private JobOfferRepository repository;
    private AnalyticsService service;

    @BeforeEach
    void setUp() {
        repository = mock(JobOfferRepository.class);
        service = new AnalyticsService(repository);
    }

    @Test
    void getTopCompaniesMapsRepositoryResult() {
        when(repository.findTopCompanies("valencia")).thenReturn(List.of(
                topCompany("UST", 19L),
                topCompany("GMV", 13L)
        ));

        List<TopCompanyDto> result = service.getTopCompanies("valencia");

        assertThat(result).containsExactly(
                new TopCompanyDto("UST", 19L),
                new TopCompanyDto("GMV", 13L)
        );
    }

    @Test
    void getTopTechnologiesClampsLimitToTwenty() {
        when(repository.findTopTechnologies(20)).thenReturn(List.of(
                topTechnology("java", 40L),
                topTechnology("spring", 32L)
        ));

        List<TopTechnologyDto> result = service.getTopTechnologies(50);

        verify(repository).findTopTechnologies(20);
        assertThat(result).containsExactly(
                new TopTechnologyDto("java", 40L),
                new TopTechnologyDto("spring", 32L)
        );
    }

    @Test
    void getSalaryByStackParsesRangesAndCalculatesAverage() {
        when(repository.findSalarySamplesByTechnology()).thenReturn(List.of(
                salarySample("java", "30k - 40k"),
                salarySample("java", "45k"),
                salarySample("react", "28000 - 32000"),
                salarySample("react", "salario a convenir")
        ));

        List<SalaryByStackDto> result = service.getSalaryByStack();

        assertThat(result).containsExactly(
                new SalaryByStackDto("java", 40000.0, 2L),
                new SalaryByStackDto("react", 30000.0, 1L)
        );
    }

    private TopCompanyProjection topCompany(String company, Long count) {
        return new TopCompanyProjection() {
            @Override
            public String getCompany() {
                return company;
            }

            @Override
            public Long getCount() {
                return count;
            }
        };
    }

    private TopTechnologyProjection topTechnology(String technology, Long count) {
        return new TopTechnologyProjection() {
            @Override
            public String getTechnology() {
                return technology;
            }

            @Override
            public Long getCount() {
                return count;
            }
        };
    }

    private SalarySampleProjection salarySample(String technology, String salaryText) {
        return new SalarySampleProjection() {
            @Override
            public String getTechnology() {
                return technology;
            }

            @Override
            public String getSalaryText() {
                return salaryText;
            }
        };
    }
}
