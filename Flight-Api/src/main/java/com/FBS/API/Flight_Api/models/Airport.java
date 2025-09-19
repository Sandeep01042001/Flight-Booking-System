package com.FBS.API.Flight_Api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Airport {
    private UUID airportId;

    private String airportCode;  // e.g., "DEL"
    private String name;
    private String city;
    private String country;


}