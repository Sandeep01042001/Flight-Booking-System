package com.Flight_Booking_System.Aircraft_API.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Airport {
    private UUID airportId;

    private String airportCode;  // e.g., "DEL"
    private String name;
    private String city;
    private String country;
}
