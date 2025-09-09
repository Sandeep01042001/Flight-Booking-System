package com.FBS.Customer_Api.model;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class WaitList {

    private UUID waitlistId;
    private Integer position;
    private String status;
    private Customer customer;
    private Flight flight;
}
