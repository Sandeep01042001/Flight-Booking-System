package com.FBS.auth_Api.models;

import java.time.ZonedDateTime;

import com.FBS.auth_Api.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
