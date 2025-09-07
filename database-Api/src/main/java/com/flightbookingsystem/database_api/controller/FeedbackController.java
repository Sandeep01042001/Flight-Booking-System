package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Customer;
import com.flightbookingsystem.database_api.model.FeedBack;
import com.flightbookingsystem.database_api.model.Flight;
import com.flightbookingsystem.database_api.reposatories.CustomerRepository;
import com.flightbookingsystem.database_api.reposatories.FeedBackRepository;
import com.flightbookingsystem.database_api.reposatories.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/db/feedback")
public class FeedbackController {

     FeedBackRepository feedBackRepository;
     CustomerRepository customerRepository;
     FlightRepository flightRepository;

    @Autowired
    public FeedbackController(FeedBackRepository feedBackRepository,
                              CustomerRepository customerRepository,
                              FlightRepository flightRepository) {
        this.feedBackRepository = feedBackRepository;
        this.customerRepository = customerRepository;
        this.flightRepository = flightRepository;
    }

    // Get all feedbacks
    @GetMapping
    public List<FeedBack> getAllFeedbacks() {
        return feedBackRepository.findAll();
    }

    // Get feedback by ID
    @GetMapping("/{feedbackId}")
    public ResponseEntity<FeedBack> getFeedbackById(@PathVariable UUID feedbackId) {
        FeedBack feedback = feedBackRepository.findById(feedbackId.toString()).orElse(null);
        if (feedback == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(feedback, HttpStatus.OK);
    }

    // Create new feedback
    @PostMapping("/create/{customerId}/{flightId}")
    public ResponseEntity<FeedBack> createFeedback(@PathVariable UUID customerId,
                                                   @PathVariable UUID flightId,
                                                   @RequestBody FeedBack feedback) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        Flight flight = flightRepository.findById(flightId.toString()).orElse(null);

        if (customer == null || flight == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        feedback.setCustomer(customer);
        feedback.setFlight(flight);
        feedback.setCreatedAt(ZonedDateTime.now());

        FeedBack savedFeedback = feedBackRepository.save(feedback);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    // Update feedback
    @PutMapping("/{feedbackId}")
    public ResponseEntity<FeedBack> updateFeedback(@PathVariable UUID feedbackId,
                                                   @RequestBody FeedBack updatedFeedback) {
        FeedBack feedback = feedBackRepository.findById(feedbackId.toString()).orElse(null);
        if (feedback == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        feedback.setRating(updatedFeedback.getRating());
        feedback.setComments(updatedFeedback.getComments());
        // Optionally update customer or flight if needed
        if (updatedFeedback.getCustomer() != null) {
            feedback.setCustomer(updatedFeedback.getCustomer());
        }
        if (updatedFeedback.getFlight() != null) {
            feedback.setFlight(updatedFeedback.getFlight());
        }

        FeedBack savedFeedback = feedBackRepository.save(feedback);
        return new ResponseEntity<>(savedFeedback, HttpStatus.OK);
    }

    // Delete feedback
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable UUID feedbackId) {
        FeedBack feedback = feedBackRepository.findById(feedbackId.toString()).orElse(null);
        if (feedback == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        feedBackRepository.delete(feedback);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}



