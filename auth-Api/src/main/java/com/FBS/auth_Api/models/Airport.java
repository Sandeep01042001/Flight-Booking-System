package com.FBS.auth_Api.models;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
