package com.FBS.Customer_Api.model;

import java.util.UUID;

import com.FBS.Customer_Api.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


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
