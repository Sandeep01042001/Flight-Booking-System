package com.FBS.API.Flight_Api.utility;

import com.FBS.API.Flight_Api.dto.FlightRequestDto;
import com.FBS.API.Flight_Api.dto.FlightResponseDto;
import com.FBS.API.Flight_Api.models.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MappingUtility {

    /**
     * Maps FlightRequestDto to Flight entity
     */
    public Flight mapFlightRequestToFlight(FlightRequestDto dto,
                             Airport originAirport, 
                             Airport destinationAirport,
                             Airline airline,
                             Aircraft aircraft) {
        return Flight.builder()
                .flightName(dto.getFlightName())
                .originAirport(originAirport)
                .destinationAirport(destinationAirport)
                .departure(dto.getDeparture())
                .arrival(dto.getArrival())
                .status(dto.getStatus())
                .airline(airline)
                .aircraft(aircraft)
                .build();
    }


}
