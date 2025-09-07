package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Customer;
import com.flightbookingsystem.database_api.model.Flight;
import com.flightbookingsystem.database_api.model.WaitList;
import com.flightbookingsystem.database_api.reposatories.CustomerRepository;
import com.flightbookingsystem.database_api.reposatories.FlightRepository;
import com.flightbookingsystem.database_api.reposatories.WaitListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/db/waitlist")
public class WaitlistController {


     WaitListRepository waitListRepository;
     CustomerRepository customerRepository;
     FlightRepository flightRepository;

    @Autowired
    public WaitlistController(WaitListRepository waitListRepository,
                              CustomerRepository customerRepository,
                              FlightRepository flightRepository) {
        this.waitListRepository = waitListRepository;
        this.customerRepository = customerRepository;
        this.flightRepository = flightRepository;
    }

    // Get all waitlists
    @GetMapping
    public List<WaitList> getAllWaitLists() {
        return waitListRepository.findAll();
    }

    // Get waitlist by ID
    @GetMapping("/{waitlistId}")
    public ResponseEntity<WaitList> getWaitListById(@PathVariable UUID waitlistId) {
        WaitList waitList = waitListRepository.findById(waitlistId.toString()).orElse(null);
        if (waitList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(waitList, HttpStatus.OK);
    }

    // Create new waitlist entry
    @PostMapping("/create/{customerId}/{flightId}")
    public ResponseEntity<WaitList> createWaitList(@PathVariable UUID customerId,
                                                   @PathVariable UUID flightId,
                                                   @RequestBody WaitList waitList) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        Flight flight = flightRepository.findById(flightId.toString()).orElse(null);

        if (customer == null || flight == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        waitList.setCustomer(customer);
        waitList.setFlight(flight);

        WaitList savedWaitList = waitListRepository.save(waitList);
        return new ResponseEntity<>(savedWaitList, HttpStatus.CREATED);
    }

    // Update waitlist
    @PutMapping("/{waitlistId}")
    public ResponseEntity<WaitList> updateWaitList(@PathVariable UUID waitlistId,
                                                   @RequestBody WaitList updatedWaitList) {
        WaitList waitList = waitListRepository.findById(waitlistId.toString()).orElse(null);
        if (waitList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        waitList.setPosition(updatedWaitList.getPosition());
        waitList.setStatus(updatedWaitList.getStatus());

        // Optionally update customer or flight
        if (updatedWaitList.getCustomer() != null) {
            waitList.setCustomer(updatedWaitList.getCustomer());
        }
        if (updatedWaitList.getFlight() != null) {
            waitList.setFlight(updatedWaitList.getFlight());
        }

        WaitList savedWaitList = waitListRepository.save(waitList);
        return new ResponseEntity<>(savedWaitList, HttpStatus.OK);
    }

    // Delete waitlist
    @DeleteMapping("/{waitlistId}")
    public ResponseEntity<Void> deleteWaitList(@PathVariable UUID waitlistId) {
        WaitList waitList = waitListRepository.findById(waitlistId.toString()).orElse(null);
        if (waitList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        waitListRepository.delete(waitList);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


