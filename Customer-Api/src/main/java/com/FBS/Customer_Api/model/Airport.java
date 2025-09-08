package com.FBS.Customer_Api.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Airport {
    @Id
    @GeneratedValue
    private UUID airportId;

    private String airportCode;  // e.g., "DEL"
    private String name;
    private String city;
    private String country;


}
