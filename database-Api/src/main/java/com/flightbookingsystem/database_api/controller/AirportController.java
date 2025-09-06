package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Airport;
import com.flightbookingsystem.database_api.reposatories.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/airport")
public class AirportController {

    AirportRepository airportRepository;

    @Autowired
    public AirportController(AirportRepository airportRepository) {
        this.airportRepository = airportRepository;
    }


    // Get all airports
    @GetMapping
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    // Get airport by ID
    @GetMapping("/{airportId}")
    public ResponseEntity<Airport> getAirportById(@PathVariable UUID airportId) {
        Airport airport = airportRepository.findById(airportId).orElse(null);
        if (airport == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(airport, HttpStatus.OK);
    }


    // Create a new airport
    @PostMapping("/create")
    public Airport createAirport(@RequestBody Airport airport) {
        return airportRepository.save(airport);
    }


    // Update an existing airport
    @PutMapping("/{airportId}")
    public ResponseEntity<Airport> updateAirport(@PathVariable UUID airportId, @RequestBody Airport updatedAirport) {
        Airport airport = airportRepository.findById(airportId).orElse(null);
        if (airport == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        airport.setAirportCode(updatedAirport.getAirportCode());
        airport.setName(updatedAirport.getName());
        airport.setCity(updatedAirport.getCity());
        airport.setCountry(updatedAirport.getCountry());

        Airport savedAirport = airportRepository.save(airport);
        return new ResponseEntity<>(savedAirport, HttpStatus.OK);
    }

    // Delete an airport
    @DeleteMapping("/{airportId}")
    public ResponseEntity<Void> deleteAirport(@PathVariable UUID airportId) {
        Airport airport = airportRepository.findById(airportId).orElse(null);
        if (airport == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        airportRepository.delete(airport);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
