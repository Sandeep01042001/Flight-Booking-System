package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Fare;
import com.flightbookingsystem.database_api.model.Flight;
import com.flightbookingsystem.database_api.model.Seat;
import com.flightbookingsystem.database_api.reposatories.FareRepository;
import com.flightbookingsystem.database_api.reposatories.FlightRepository;
import com.flightbookingsystem.database_api.reposatories.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/db/seat")
public class SeatController {

     SeatRepository seatRepository;
     FlightRepository flightRepository;
     FareRepository fareRepository;

    @Autowired
    public SeatController(SeatRepository seatRepository,
                          FlightRepository flightRepository,
                          FareRepository fareRepository) {
        this.seatRepository = seatRepository;
        this.flightRepository = flightRepository;
        this.fareRepository = fareRepository;
    }

    // Get all seats
    @GetMapping
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    // Get seat by ID
    @GetMapping("/{seatId}")
    public ResponseEntity<Seat> getSeatById(@PathVariable UUID seatId) {
        Seat seat = seatRepository.findById(seatId.toString()).orElse(null);
        if (seat == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(seat, HttpStatus.OK);
    }

    // Create new seat
    @PostMapping("/create/{flightId}/{fareId}")
    public ResponseEntity<Seat> createSeat(@PathVariable UUID flightId,
                                           @PathVariable UUID fareId,
                                           @RequestBody Seat seat) {
        Flight flight = flightRepository.findById(flightId.toString()).orElse(null);
        Fare fare = fareRepository.findById(fareId).orElse(null);

        if (flight == null || fare == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        seat.setFlight(flight);
        seat.setFare(fare);

        Seat savedSeat = seatRepository.save(seat);
        return new ResponseEntity<>(savedSeat, HttpStatus.CREATED);
    }

    // Update seat
    @PutMapping("/{seatId}")
    public ResponseEntity<Seat> updateSeat(@PathVariable UUID seatId,
                                           @RequestBody Seat updatedSeat) {
        Seat seat = seatRepository.findById(seatId.toString()).orElse(null);
        if (seat == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        seat.setSeatNumber(updatedSeat.getSeatNumber());
        seat.setSeatClass(updatedSeat.getSeatClass());
        seat.setSeatType(updatedSeat.getSeatType());
        seat.setSeatStatus(updatedSeat.getSeatStatus());

        // Optional: update flight or fare
        if (updatedSeat.getFlight() != null) {
            seat.setFlight(updatedSeat.getFlight());
        }
        if (updatedSeat.getFare() != null) {
            seat.setFare(updatedSeat.getFare());
        }

        Seat savedSeat = seatRepository.save(seat);
        return new ResponseEntity<>(savedSeat, HttpStatus.OK);
    }

    // Delete seat
    @DeleteMapping("/{seatId}")
    public ResponseEntity<Void> deleteSeat(@PathVariable UUID seatId) {
        Seat seat = seatRepository.findById(seatId.toString()).orElse(null);
        if (seat == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        seatRepository.delete(seat);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


