package com.FBS.auth_Api.models;

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
