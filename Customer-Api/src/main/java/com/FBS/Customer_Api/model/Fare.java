package com.FBS.Customer_Api.model;

import java.util.UUID;

import com.FBS.Customer_Api.enums.SeatClass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fare {
    private UUID fareId;
    private SeatClass seatClass;
    private Double basePrice;
    private Double tax;
    private String currency;
}
