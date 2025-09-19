package com.Flight_Booking_System.Aircraft_API.model;

import com.Flight_Booking_System.Aircraft_API.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
    private String bookingId;

    private ZonedDateTime bookingTime;
    private String pnrNumber;

    private BookingStatus bookingStatus;

    private Customer customer;

    private Flight flight;

    private Seat seat;

    private Payment payment;
}
