package com.FBS.Customer_Api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Seat {
    @Id
    private String seatId;

    private String seatNumber;

    @Enumerated (EnumType.STRING)
    private SeatClass seatClass;

    private String seatType;

    @ManyToOne
    @JoinColumn(name = "fare_id")
    private Fare fare;

    @Enumerated(EnumType.STRING)
    private SeatStatus seatStatus;

    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @OneToOne(mappedBy = "seat", cascade = CascadeType.ALL)
    private Booking booking;

}
