package com.FBS.API.Flight_Api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaitList {
    private UUID waitlistId;

    private Integer position;
    private String status;

    private Customer customer;

    private Flight flight;
}