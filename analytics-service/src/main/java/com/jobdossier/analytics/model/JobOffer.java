package com.jobdossier.analytics.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "\"JobOffer\"")
public class JobOffer {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "source", nullable = false)
    private String source;

    @Column(name = "\"externalId\"")
    private String externalId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "company", nullable = false)
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "modality")
    private String modality;

    @Column(name = "\"salaryText\"")
    private String salaryText;

    @Column(name = "url", nullable = false, unique = true)
    private String url;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "\"technologiesRaw\"", columnDefinition = "TEXT")
    private String technologiesRaw;

    @Column(name = "\"publishedAt\"")
    private OffsetDateTime publishedAt;

    @Column(name = "\"createdAt\"")
    private OffsetDateTime createdAt;

    @Column(name = "\"updatedAt\"")
    private OffsetDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public String getSource() {
        return source;
    }

    public String getExternalId() {
        return externalId;
    }

    public String getTitle() {
        return title;
    }

    public String getCompany() {
        return company;
    }

    public String getLocation() {
        return location;
    }

    public String getModality() {
        return modality;
    }

    public String getSalaryText() {
        return salaryText;
    }

    public String getUrl() {
        return url;
    }

    public String getDescription() {
        return description;
    }

    public String getTechnologiesRaw() {
        return technologiesRaw;
    }

    public OffsetDateTime getPublishedAt() {
        return publishedAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
