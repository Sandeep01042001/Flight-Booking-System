package com.Flight_Booking_System.Aircraft_API.dto;


import com.Flight_Booking_System.Aircraft_API.model.Airline;
import com.Flight_Booking_System.Aircraft_API.model.Flight;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AircraftDetailsDTO {
    private String aircraftNumber;
    private String type;
    private Integer capacity;
    private String configuration;
}
