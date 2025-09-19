package com.FBS.API.Flight_Api.models;

import com.FBS.API.Flight_Api.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    private UUID bookingId;

    private ZonedDateTime bookingTime;
    private String pnrNumber;

    private BookingStatus bookingStatus;

    private Customer customer;

    private Flight flight;

    private Seat seat;
    private Payment payment;

}

