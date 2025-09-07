package com.flightbookingsystem.database_api.model;


import java.util.UUID;

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
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID paymentId;

    private Double amount;
    private String method;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String txnReference;

    @OneToOne(mappedBy = "payment")
    private Booking booking;

}
