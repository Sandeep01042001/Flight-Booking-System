package com.FBS.employee_api.model;

import java.util.UUID;

import com.FBS.employee_api.enums.SeatClass;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
