package com.Flight_Booking_System.Aircraft_API.model;

import com.Flight_Booking_System.Aircraft_API.enums.SeatClass;
import com.Flight_Booking_System.Aircraft_API.enums.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

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
