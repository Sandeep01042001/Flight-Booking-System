package com.FBS.API.Flight_Api.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedBack {
    private UUID feedbackId;

    private Integer rating;
    private String comments;
    private ZonedDateTime createdAt;

    private Customer customer;

    private Flight flight;

}
