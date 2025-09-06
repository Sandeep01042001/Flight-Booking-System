package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Aircraft;
import com.flightbookingsystem.database_api.model.Airline;
import com.flightbookingsystem.database_api.reposatories.AircraftRepository;
import com.flightbookingsystem.database_api.reposatories.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/aircraft")
public class AircraftController {

      AircraftRepository aircraftRepository;
      AirlineRepository airlineRepository;

    @Autowired
    public AircraftController(AircraftRepository aircraftRepository, AirlineRepository airlineRepository) {
        this.aircraftRepository = aircraftRepository;
        this.airlineRepository = airlineRepository;
    }

    @GetMapping
    public List<Aircraft> getAllAircrafts() {
        return aircraftRepository.findAll();
    }

    @GetMapping("/{aircraftId}")
    public ResponseEntity<Aircraft> getAircraftById(@PathVariable String aircraftId) {
        Aircraft aircraft = aircraftRepository.findById(aircraftId).orElse(null);
        if (aircraft == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(aircraft, HttpStatus.OK);
    }

    @PostMapping("/create/{airlineId}")
    public ResponseEntity<Aircraft> createAircraft(@PathVariable String airlineId, @RequestBody Aircraft aircraft) {
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        if (airline == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        aircraft.setAirline(airline);
        Aircraft savedAircraft = aircraftRepository.save(aircraft);
        return new ResponseEntity<>(savedAircraft, HttpStatus.CREATED);
    }

    @PutMapping("/{aircraftId}")
    public ResponseEntity<Aircraft> updateAircraft(@PathVariable String aircraftId, @RequestBody Aircraft updatedAircraft) {
        Aircraft aircraft = aircraftRepository.findById(aircraftId).orElse(null);
        if (aircraft == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        aircraft.setAircraftNumber(updatedAircraft.getAircraftNumber());
        aircraft.setType(updatedAircraft.getType());
        aircraft.setCapacity(updatedAircraft.getCapacity());
        aircraft.setConfiguration(updatedAircraft.getConfiguration());

        // Optional: Update airline if needed
        if (updatedAircraft.getAirline() != null) {
            aircraft.setAirline(updatedAircraft.getAirline());
        }

        Aircraft savedAircraft = aircraftRepository.save(aircraft);
        return new ResponseEntity<>(savedAircraft, HttpStatus.OK);
    }

    // Get all flights of an aircraft
    @GetMapping("/{aircraftId}/flights")
    public ResponseEntity<List> getFlightsOfAircraft(@PathVariable String aircraftId) {
        Aircraft aircraft = aircraftRepository.findById(aircraftId).orElse(null);
        if (aircraft == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(aircraft.getFlights(), HttpStatus.OK);
    }
    }





