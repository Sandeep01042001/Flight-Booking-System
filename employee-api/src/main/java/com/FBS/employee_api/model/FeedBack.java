package com.FBS.employee_api.model;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedBack {
   
    private String feedbackId;
    private Integer rating;
    private String comments;
    private ZonedDateTime createdAt;
    private Customer customer;
    private Flight flight;
}
