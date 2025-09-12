package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Airline;
import com.flightbookingsystem.database_api.model.CompanySize;
import com.flightbookingsystem.database_api.reposatories.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/db/airline")
public class AirlineController {

     AirlineRepository airlineRepository;

    @Autowired
    public AirlineController(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }
    // Get all airlines
    @GetMapping("/get/all")
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }
  //get airline by id
    @GetMapping("/get/{airlineId}")
    public ResponseEntity<Airline> getAirlineById(@PathVariable UUID airlineId) {
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        if (airline == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(airline, HttpStatus.OK);
    }

    //create a new airline
    @PostMapping("/create")
    public Airline createAirline(@RequestBody Airline airline) {
        return airlineRepository.save(airline);
    }


    @PostMapping("/update/{airlineId}")
    public ResponseEntity<Airline> updateAirline(@PathVariable UUID airlineId, @RequestBody Airline updatedAirline) {
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        if (airline == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        airline.setName(updatedAirline.getName());
        airline.setOfficialName(updatedAirline.getOfficialName());
        airline.setAddress(updatedAirline.getAddress());
        airline.setCompanySize(CompanySize.Large); 
        airline.setLogo(updatedAirline.getLogo());
        airline.setStatus(updatedAirline.getStatus());

        Airline savedAirline = airlineRepository.save(airline);
        return new ResponseEntity<>(savedAirline, HttpStatus.OK);
    }

    // Delete airline
    @DeleteMapping("/delete/{airlineId}")
    public ResponseEntity<Void> deleteAirline(@PathVariable UUID airlineId) {
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        if (airline == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        airlineRepository.delete(airline);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
