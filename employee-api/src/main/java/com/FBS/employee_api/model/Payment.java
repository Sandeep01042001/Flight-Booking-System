package com.FBS.employee_api.model;

import java.util.UUID;

import com.FBS.employee_api.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    private UUID paymentId;
    private Double amount;
    private String method;
    private PaymentStatus paymentStatus;
    private String txnReference;
    private Booking booking;
}
