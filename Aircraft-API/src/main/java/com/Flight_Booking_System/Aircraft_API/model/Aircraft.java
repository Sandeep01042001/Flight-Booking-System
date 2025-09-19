package com.Flight_Booking_System.Aircraft_API.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Aircraft {
    private UUID aircraftId;
    private String aircraftNumber;
    private String type;
    private Integer capacity;
    private String configuration;
    private Airline airline;
    private List<Flight> flights;
}
