package com.FBS.employee_api.model;

import java.time.ZonedDateTime;

import com.FBS.employee_api.enums.BookingStatus;
import com.FBS.employee_api.model.Customer;
import com.FBS.employee_api.model.Flight;
import com.FBS.employee_api.model.Payment;
import com.FBS.employee_api.model.Seat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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
