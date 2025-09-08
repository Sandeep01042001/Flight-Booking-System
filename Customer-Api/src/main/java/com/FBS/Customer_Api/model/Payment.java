package com.FBS.Customer_Api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Payment {
    @Id
    private String paymentId;

    private Double amount;
    private String method;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String txnReference;

    @OneToOne(mappedBy = "payment")
    private Booking booking;

}
