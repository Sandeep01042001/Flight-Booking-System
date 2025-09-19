package com.Flight_Booking_System.Aircraft_API.model;

import com.Flight_Booking_System.Aircraft_API.enums.SeatClass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Fare {
    private UUID fareId;

    private SeatClass seatClass;

    private Double basePrice;
    private Double tax;
    private String currency;
}
