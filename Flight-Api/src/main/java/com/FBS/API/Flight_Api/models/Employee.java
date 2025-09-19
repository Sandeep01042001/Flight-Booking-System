package com.FBS.API.Flight_Api.models;

import com.FBS.API.Flight_Api.enums.EmployeeRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {
    private UUID employeeId;

    private String name;
    private String email;
    private String phone;
    private String address;


    private EmployeeRole employeeRole;

    private String status;

    private Airline airline;

}