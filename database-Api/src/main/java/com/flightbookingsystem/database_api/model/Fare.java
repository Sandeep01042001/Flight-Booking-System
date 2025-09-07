package com.flightbookingsystem.database_api.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Fare {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID fareId;

    @Enumerated(EnumType.STRING)
    private SeatClass seatClass;

    private Double basePrice;
    private Double tax;
    private String currency;

}
