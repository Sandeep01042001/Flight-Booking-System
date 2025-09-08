package com.FBS.Airline_api.model;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedBack {
    private String feedbackId;
    private Integer rating;
    private String comments;
    private ZonedDateTime createdAt;
    private Customer customer;
    private Flight flight;
}
