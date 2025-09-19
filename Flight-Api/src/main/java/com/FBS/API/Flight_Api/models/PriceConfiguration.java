package com.FBS.API.Flight_Api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceConfiguration {

    private UUID configId;

    private Flight flight;    // Ya SubFlight, depending on level

    private String seatType;       // "Window", "Aisle", "Middle"
    private String seatClass;      // "Economy", "Business", "First"
    private Double price;          // Price for this combination

    private String additionalServices;  // Optional: e.g., "ExtraBaggage"


}