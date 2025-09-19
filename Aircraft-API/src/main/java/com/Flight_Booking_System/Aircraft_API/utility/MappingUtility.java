package com.Flight_Booking_System.Aircraft_API.utility;


import com.Flight_Booking_System.Aircraft_API.dto.AircraftDetailsDTO;
import com.Flight_Booking_System.Aircraft_API.model.Aircraft;
import com.Flight_Booking_System.Aircraft_API.model.Airline;
import com.Flight_Booking_System.Aircraft_API.model.Flight;
import jdk.dynalink.linker.LinkerServices;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Component
public class MappingUtility {

    public Aircraft mapAircraftToAircraftDetailsDTO(AircraftDetailsDTO aircraftDetailsDTO, Airline airline, List<Flight> flights){

        Aircraft aircraft=Aircraft.builder()
                .aircraftNumber(aircraftDetailsDTO.getAircraftNumber())
                .type(aircraftDetailsDTO.getType())
                .capacity(aircraftDetailsDTO.getCapacity())
                .configuration(aircraftDetailsDTO.getConfiguration())
                .airline(airline)
                .build();

            if (flights != null) {
                for (Flight flight : flights) {
                    flight.setAircraft(aircraft);
                }
            }
            return aircraft;

    }
}
