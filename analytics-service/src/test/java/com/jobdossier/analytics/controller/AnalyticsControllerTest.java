package com.jobdossier.analytics.controller;

import com.jobdossier.analytics.dto.SalaryByStackDto;
import com.jobdossier.analytics.dto.TopCompanyDto;
import com.jobdossier.analytics.dto.TopTechnologyDto;
import com.jobdossier.analytics.service.AnalyticsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnalyticsController.class)
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @Test
    void pingReturnsStatusOk() throws Exception {
        mockMvc.perform(get("/analytics/ping"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.service").value("analytics-service"));
    }

    @Test
    void topCompaniesReturnsJsonList() throws Exception {
        when(analyticsService.getTopCompanies("valencia")).thenReturn(List.of(
                new TopCompanyDto("UST", 19L)
        ));

        mockMvc.perform(get("/analytics/top-companies").param("city", "valencia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].company").value("UST"))
                .andExpect(jsonPath("$[0].count").value(19));

        verify(analyticsService).getTopCompanies("valencia");
    }

    @Test
    void topTechnologiesReturnsJsonList() throws Exception {
        when(analyticsService.getTopTechnologies(5)).thenReturn(List.of(
                new TopTechnologyDto("java", 40L)
        ));

        mockMvc.perform(get("/analytics/top-technologies").param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].technology").value("java"))
                .andExpect(jsonPath("$[0].count").value(40));

        verify(analyticsService).getTopTechnologies(5);
    }

    @Test
    void salaryByStackReturnsJsonList() throws Exception {
        when(analyticsService.getSalaryByStack()).thenReturn(List.of(
                new SalaryByStackDto("java", 40000.0, 2L)
        ));

        mockMvc.perform(get("/analytics/salary-by-stack"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].technology").value("java"))
                .andExpect(jsonPath("$[0].averageSalary").value(40000.0))
                .andExpect(jsonPath("$[0].sampleSize").value(2));

        verify(analyticsService).getSalaryByStack();
    }
}
