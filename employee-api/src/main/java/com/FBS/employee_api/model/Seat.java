package com.FBS.employee_api.model;

import java.util.UUID;

import com.FBS.employee_api.enums.SeatClass;
import com.FBS.employee_api.enums.SeatStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
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
