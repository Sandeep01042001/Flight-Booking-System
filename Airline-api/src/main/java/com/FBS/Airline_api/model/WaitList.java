package com.FBS.Airline_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WaitList {
    private String waitListId;
    private Customer customer;
    private Flight flight;
}
