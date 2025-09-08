package com.FBS.Airline_api.model;

import java.util.UUID;

import com.FBS.Airline_api.enums.EmployeeRole;
import com.FBS.Airline_api.model.Airline.AirlineBuilder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    private UUID employeeId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private EmployeeRole employeeRole;
    private String status;
    private Airline airlineName;
    
    // public static AirlineBuilder builder() {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'builder'");
    // }
    
}
