package com.Flight_Booking_System.Aircraft_API.controler;

import com.Flight_Booking_System.Aircraft_API.connector.AirLineApiConnector;
import com.Flight_Booking_System.Aircraft_API.connector.FlightApiConnector;
import com.Flight_Booking_System.Aircraft_API.dto.AircraftDetailsDTO;
import com.Flight_Booking_System.Aircraft_API.exception.AircraftDoesNotExist;
import com.Flight_Booking_System.Aircraft_API.exception.InvalidOperationException;
import com.Flight_Booking_System.Aircraft_API.model.Aircraft;
import com.Flight_Booking_System.Aircraft_API.model.Airline;
import com.Flight_Booking_System.Aircraft_API.model.Flight;
import com.Flight_Booking_System.Aircraft_API.service.AircraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/aircraft")
public class AircraftController {

    AircraftService aircraftService;
    AirLineApiConnector airLineApiConnector;
    FlightApiConnector flightApiConnector;
    @Autowired
    public AircraftController(AircraftService aircraftService,
                              AirLineApiConnector airLineApiConnector,
                              FlightApiConnector flightApiConnector){
        this.aircraftService=aircraftService;
        this.airLineApiConnector=airLineApiConnector;
        this.flightApiConnector=flightApiConnector;
    }

    @PostMapping("/register")
    public Aircraft aircraftRegistration(@RequestBody AircraftDetailsDTO aircraftDetailsDTO,
                                         @RequestParam UUID airlineID,
                                         @RequestParam List<UUID> flightID){
        Airline airline=airLineApiConnector.getAirlineDetails(airlineID);
        List<Flight> flight=flightApiConnector.getFlightDetails(flightID);
        return  aircraftService.airCraftRegistration(aircraftDetailsDTO,airline,flight);

    }

    @GetMapping("/get/airCraftById/{aircraftId}")
    public ResponseEntity getAirCraftById(@PathVariable UUID aircraftId){

        try{
            Aircraft aircraft=aircraftService.getAirCraftsById(aircraftId);
            return new ResponseEntity<>(aircraft, HttpStatus.OK);
        }catch (InvalidOperationException invalidOperationException){
            return new ResponseEntity<>(invalidOperationException.getMessage(),HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("get/all/aircraft")
    public ResponseEntity getAllAirCrafts() {
        try {
            List<Aircraft> aircraftList = aircraftService.getAllAirCrafts();
            return new ResponseEntity<>(aircraftList, HttpStatus.OK);

        } catch (AircraftDoesNotExist aircraftDoesNotExist) {
            return new ResponseEntity<>(aircraftDoesNotExist.getMessage(), HttpStatus.NOT_FOUND);
        }catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
