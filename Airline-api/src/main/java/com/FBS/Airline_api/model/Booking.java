package com.FBS.Airline_api.model;

import java.time.ZonedDateTime;

import com.FBS.Airline_api.enums.BookingStatus;
import com.FBS.Airline_api.model.Customer;
import com.FBS.Airline_api.model.Payment;
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
