package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Fare;
import com.flightbookingsystem.database_api.reposatories.FareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/db/fare")
public class FareController {


    FareRepository fareRepository;

    @Autowired
    public FareController(FareRepository fareRepository) {
        this.fareRepository = fareRepository;
    }

    // Get all fares
    @GetMapping
    public List<Fare> getAllFares() {
        return fareRepository.findAll();
    }

    // Get fare by ID
    @GetMapping("/{fareId}")
    public ResponseEntity<Fare> getFareById(@PathVariable UUID fareId) {
        Fare fare = fareRepository.findById(fareId).orElse(null);
        if (fare == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(fare, HttpStatus.OK);
    }

    // Create new fare
    @PostMapping("/create")
    public Fare createFare(@RequestBody Fare fare) {
        return fareRepository.save(fare);
    }

    // Update fare
    @PutMapping("/{fareId}")
    public ResponseEntity<Fare> updateFare(@PathVariable UUID fareId, @RequestBody Fare updatedFare) {
        Fare fare = fareRepository.findById(fareId).orElse(null);
        if (fare == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        fare.setSeatClass(updatedFare.getSeatClass());
        fare.setBasePrice(updatedFare.getBasePrice());
        fare.setTax(updatedFare.getTax());
        fare.setCurrency(updatedFare.getCurrency());

        Fare savedFare = fareRepository.save(fare);
        return new ResponseEntity<>(savedFare, HttpStatus.OK);
    }

    // Delete fare
    @DeleteMapping("/{fareId}")
    public ResponseEntity<Void> deleteFare(@PathVariable UUID fareId) {
        Fare fare = fareRepository.findById(fareId).orElse(null);
        if (fare == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        fareRepository.delete(fare);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
