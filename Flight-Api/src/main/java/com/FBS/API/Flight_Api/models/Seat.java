package com.FBS.API.Flight_Api.models;

import com.FBS.API.Flight_Api.enums.SeatClass;
import com.FBS.API.Flight_Api.enums.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
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

