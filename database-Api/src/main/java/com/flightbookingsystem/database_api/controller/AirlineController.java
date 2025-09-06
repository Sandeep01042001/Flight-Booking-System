package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Airline;
import com.flightbookingsystem.database_api.reposatories.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/airline")
public class AirlineController {

     AirlineRepository airlineRepository;

    @Autowired
    public AirlineController(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }
    // Get all airlines
    @GetMapping
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }
  //get all airline by id
    @GetMapping("/{airlineId}")
    public ResponseEntity<Airline> getAirlineById(@PathVariable String airlineId) {
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        if (airline == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(airline, HttpStatus.OK);
    }
    @PostMapping("/create")
    public Airline createAirline(@RequestBody Airline airline) {
        return airlineRepository.save(airline);
    }
    @PutMapping("/{airlineId}")
    public ResponseEntity<Airline> updateAirline(@PathVariable String airlineId, @RequestBody Airline updatedAirline) {
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        if (airline == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        airline.setName(updatedAirline.getName());
        airline.setOfficialName(updatedAirline.getOfficialName());
        airline.setAddress(updatedAirline.getAddress());
        airline.setCompanySize(updatedAirline.getCompanySize());
        airline.setLogo(updatedAirline.getLogo());
        airline.setStatus(updatedAirline.getStatus());

        Airline savedAirline = airlineRepository.save(airline);
        return new ResponseEntity<>(savedAirline, HttpStatus.OK);
    }

    // Delete airline
    @DeleteMapping("/{airlineId}")
    public ResponseEntity<Void> deleteAirline(@PathVariable String airlineId) {
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        if (airline == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        airlineRepository.delete(airline);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
