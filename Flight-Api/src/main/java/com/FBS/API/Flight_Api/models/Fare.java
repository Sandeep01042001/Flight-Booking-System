package com.FBS.API.Flight_Api.models;

import com.FBS.API.Flight_Api.enums.SeatClass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fare {
    private UUID fareId;

    private SeatClass seatClass;

    private Double basePrice;
    private Double tax;
    private String currency;

}

