package com.FBS.Airline_api.model;

import java.util.UUID;

import com.FBS.Airline_api.enums.SeatClass;
import com.FBS.Airline_api.enums.SeatStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Seat {
    private UUID seatId;
    private String seatNumber;
    private SeatClass seatClass;
    private String seatType;
    private Fare fare;
    private SeatStatus seatStatus;
    private Flight flight;
    private Booking booking;
}
