package com.FBS.API.Flight_Api.models;

import com.FBS.API.Flight_Api.enums.CompanySize;
import com.FBS.API.Flight_Api.enums.EmployeeRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Airline {

    private UUID airlineId;

    private String name;
    private String officialName;
    private String officialEmail;
    private String officialPhone;
    private String address;

    private CompanySize companySize;

    private String logo;
    private String status;
    private EmployeeRole admin; // admin is the role of the employee
    private List<Employee> employees;

    private List<Aircraft> airCrafts;

    private List<Flight> flights;

}
