package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Booking;
import com.flightbookingsystem.database_api.model.Customer;
import com.flightbookingsystem.database_api.model.Flight;
import com.flightbookingsystem.database_api.model.Seat;
import com.flightbookingsystem.database_api.reposatories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/booking")
public class BookingController {

      BookingRepository bookingRepository;
     CustomerRepository customerRepository;
     FlightRepository flightRepository;
     SeatRepository seatRepository;
     PaymentRepository paymentRepository;

    @Autowired
    public BookingController(BookingRepository bookingRepository,
                             CustomerRepository customerRepository,
                             FlightRepository flightRepository,
                             SeatRepository seatRepository,
                             PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.flightRepository = flightRepository;
        this.seatRepository = seatRepository;
        this.paymentRepository = paymentRepository;
    }


    // Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by ID
    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

    // Create a new booking
    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        // Validate related entities
        if (booking.getCustomer() == null || booking.getFlight() == null || booking.getSeat() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Customer customer = customerRepository.findById(booking.getCustomer().getCustomerId()).orElse(null);
        Flight flight = flightRepository.findById(booking.getFlight().getFlightId()).orElse(null);
        Seat seat = seatRepository.findById(booking.getSeat().getSeatId()).orElse(null);

        if (customer == null || flight == null || seat == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        booking.setCustomer(customer);
        booking.setFlight(flight);
        booking.setSeat(seat);
        booking.setBookingTime(ZonedDateTime.now());

        // Save payment if exists
        if (booking.getPayment() != null) {
            paymentRepository.save(booking.getPayment());
        }

        Booking savedBooking = bookingRepository.save(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    }

    // Delete booking
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        bookingRepository.delete(booking);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Update booking
    @PutMapping("/{bookingId}")
    public ResponseEntity<Booking> updateBooking(@PathVariable String bookingId, @RequestBody Booking updatedBooking) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        booking.setBookingStatus(updatedBooking.getBookingStatus());
        booking.setPnrNumber(updatedBooking.getPnrNumber());
        // Optionally update customer, flight, seat, payment
        if (updatedBooking.getPayment() != null) {
            booking.setPayment(paymentRepository.save(updatedBooking.getPayment()));
        }

        Booking savedBooking = bookingRepository.save(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.OK);
    }


}
