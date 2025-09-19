package com.Flight_Booking_System.Aircraft_API.model;

import com.Flight_Booking_System.Aircraft_API.enums.EmployeeRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    private UUID employeeId;

    private String name;
    private String email;

    private EmployeeRole employeeRole;

    private String status;

    private Airline airline;
}
