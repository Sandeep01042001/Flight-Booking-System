package com.FBS.Airline_api.model;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aircraft {
     private UUID aircraftId;

    private String aircraftNumber;
    private String type;
    private Integer capacity;
    private String configuration;
    private Airline airline;
    private List<Flight> flights;
}
