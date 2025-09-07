package com.FBS.auth_Api.models;

import com.FBS.auth_Api.enums.EmployeeRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    private String employeeId;
    private String name;
    private String email;
    private EmployeeRole employeeRole;
    private String status;
    private Airline airline;
}
