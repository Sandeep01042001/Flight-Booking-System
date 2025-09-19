package com.Flight_Booking_System.Aircraft_API.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WaitList {

    private UUID waitlistId;

    private Integer position;
    private String status;

    private Customer customer;

    private Flight flight;
}
