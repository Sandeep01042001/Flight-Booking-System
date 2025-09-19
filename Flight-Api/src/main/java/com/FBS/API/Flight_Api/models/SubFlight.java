package com.FBS.API.Flight_Api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubFlight {
    private UUID subFlightId;

    private String originAirport;
    private String destinationAirport;
    private ZonedDateTime departure;
    private ZonedDateTime arrival;

    private UUID flightId; // Reference to main Flight

    private Aircraft aircraft;
}