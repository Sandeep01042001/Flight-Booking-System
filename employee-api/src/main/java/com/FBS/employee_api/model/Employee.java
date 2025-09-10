package com.FBS.employee_api.model;
import java.util.UUID;

import com.FBS.employee_api.enums.EmployeeRole;


import lombok.*; // lombok annotations to reduce boilerplate


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
    private Airline airline;
}
