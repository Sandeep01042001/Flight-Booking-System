package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Aircraft;
import com.flightbookingsystem.database_api.model.Airline;
import com.flightbookingsystem.database_api.model.Airport;
import com.flightbookingsystem.database_api.model.Flight;
import com.flightbookingsystem.database_api.reposatories.AircraftRepository;
import com.flightbookingsystem.database_api.reposatories.AirlineRepository;
import com.flightbookingsystem.database_api.reposatories.AirportRepository;
import com.flightbookingsystem.database_api.reposatories.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/flight")
public class FlightController {

     FlightRepository flightRepository;
     AirportRepository airportRepository;
     AirlineRepository airlineRepository;
     AircraftRepository aircraftRepository;

    @Autowired
    public FlightController(FlightRepository flightRepository,
                            AirportRepository airportRepository,
                            AirlineRepository airlineRepository,
                            AircraftRepository aircraftRepository) {
        this.flightRepository = flightRepository;
        this.airportRepository = airportRepository;
        this.airlineRepository = airlineRepository;
        this.aircraftRepository = aircraftRepository;
    }

    // Get all flights
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // Get flight by ID
    @GetMapping("/{flightId}")
    public ResponseEntity<Flight> getFlightById(@PathVariable String flightId) {
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(flight, HttpStatus.OK);
    }

    // Create new flight
    @PostMapping("/create/{originId}/{destinationId}/{airlineId}/{aircraftId}")
    public ResponseEntity<Flight> createFlight(@PathVariable UUID originId,
                                               @PathVariable UUID destinationId,
                                               @PathVariable String airlineId,
                                               @PathVariable String aircraftId,
                                               @RequestBody Flight flight) {
        Airport origin = airportRepository.findById(originId).orElse(null);
        Airport destination = airportRepository.findById(destinationId).orElse(null);
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        Aircraft aircraft = aircraftRepository.findById(aircraftId).orElse(null);

        if (origin == null || destination == null || airline == null || aircraft == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        flight.setOriginAirport(origin);
        flight.setDestinationAirport(destination);
        flight.setAirline(airline);
        flight.setAircraft(aircraft);

        Flight savedFlight = flightRepository.save(flight);
        return new ResponseEntity<>(savedFlight, HttpStatus.CREATED);
    }

    // Update flight
    @PutMapping("/{flightId}")
    public ResponseEntity<Flight> updateFlight(@PathVariable String flightId,
                                               @RequestBody Flight updatedFlight) {
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        flight.setDeparture(updatedFlight.getDeparture());
        flight.setArrival(updatedFlight.getArrival());
        flight.setPrice(updatedFlight.getPrice());
        flight.setStatus(updatedFlight.getStatus());

        // Optional: Update relationships
        if (updatedFlight.getOriginAirport() != null) {
            flight.setOriginAirport(updatedFlight.getOriginAirport());
        }
        if (updatedFlight.getDestinationAirport() != null) {
            flight.setDestinationAirport(updatedFlight.getDestinationAirport());
        }
        if (updatedFlight.getAirline() != null) {
            flight.setAirline(updatedFlight.getAirline());
        }
        if (updatedFlight.getAircraft() != null) {
            flight.setAircraft(updatedFlight.getAircraft());
        }

        Flight savedFlight = flightRepository.save(flight);
        return new ResponseEntity<>(savedFlight, HttpStatus.OK);
    }

    // Delete flight
    @DeleteMapping("/{flightId}")
    public ResponseEntity<Void> deleteFlight(@PathVariable String flightId) {
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        flightRepository.delete(flight);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}



