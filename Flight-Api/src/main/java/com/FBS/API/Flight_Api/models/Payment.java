package com.FBS.API.Flight_Api.models;


import com.FBS.API.Flight_Api.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payment {

    private UUID paymentId;

    private Double amount;
    private String method;

    private PaymentStatus paymentStatus;

    private String txnReference;

    private Booking booking;

}

