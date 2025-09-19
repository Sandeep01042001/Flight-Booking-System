package com.FBS.API.Flight_Api.controller;

import com.FBS.API.Flight_Api.dto.FlightRequestDto;
import com.FBS.API.Flight_Api.models.Flight;
import com.FBS.API.Flight_Api.services.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/flight")
public class FlightController {
    FlightService flightService;
    public FlightController(FlightService flightService){
        this.flightService=flightService;
    }

    @PostMapping("/create")
    public ResponseEntity createFlight(@Valid @RequestBody FlightRequestDto flightRequestDto){
        Flight flightDetailsDto1=flightService.createFlight(flightRequestDto);
        return ResponseEntity.ok(flightDetailsDto1);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable UUID id){
        Flight flight = flightService.getFlightById(id);
        if (flight == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(flight);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Flight>> getAllFlights(){
        List<Flight> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable UUID id, @Valid @RequestBody FlightRequestDto flightRequestDto){
        Flight updated = flightService.updateFlight(id, flightRequestDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable UUID id){
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
}
