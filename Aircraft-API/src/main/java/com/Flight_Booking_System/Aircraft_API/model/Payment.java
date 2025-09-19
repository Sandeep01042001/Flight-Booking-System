package com.Flight_Booking_System.Aircraft_API.model;

import com.Flight_Booking_System.Aircraft_API.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    private UUID paymentId;

    private Double amount;
    private String method;

    private PaymentStatus paymentStatus;

    private String txnReference;

    private Booking booking;
}
