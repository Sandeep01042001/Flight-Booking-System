package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Booking;
import com.flightbookingsystem.database_api.model.Payment;
import com.flightbookingsystem.database_api.model.PaymentStatus;
import com.flightbookingsystem.database_api.reposatories.BookingRepository;
import com.flightbookingsystem.database_api.reposatories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/db/payment")
public class PaymentController {

     PaymentRepository paymentRepository;
     BookingRepository bookingRepository;

    @Autowired
    public PaymentController(PaymentRepository paymentRepository,
                             BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    // Get all payments
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get payment by ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

    // Create new payment
    @PostMapping("/create/{bookingId}")
    public ResponseEntity<Payment> createPayment(@PathVariable UUID bookingId,
                                                 @RequestBody Payment payment) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        payment.setPaymentStatus(payment.getPaymentStatus() != null ? payment.getPaymentStatus() : PaymentStatus.PENDING);
        payment.setBooking(booking);

        Payment savedPayment = paymentRepository.save(payment);
        return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
    }

    // Update payment
    @PutMapping("/{paymentId}")
    public ResponseEntity<Payment> updatePayment(@PathVariable UUID paymentId,
                                                 @RequestBody Payment updatedPayment) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        payment.setAmount(updatedPayment.getAmount());
        payment.setMethod(updatedPayment.getMethod());
        payment.setPaymentStatus(updatedPayment.getPaymentStatus());
        payment.setTxnReference(updatedPayment.getTxnReference());

        // Optionally update booking
        if (updatedPayment.getBooking() != null) {
            payment.setBooking(updatedPayment.getBooking());
        }

        Payment savedPayment = paymentRepository.save(payment);
        return new ResponseEntity<>(savedPayment, HttpStatus.OK);
    }

    // Delete payment
    @DeleteMapping("/{paymentId}")
    public ResponseEntity<Void> deletePayment(@PathVariable UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        paymentRepository.delete(payment);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


