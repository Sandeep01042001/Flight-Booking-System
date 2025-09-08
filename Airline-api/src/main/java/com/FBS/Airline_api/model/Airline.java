package com.FBS.Airline_api.model;

import java.util.List;
import java.util.UUID;

import com.FBS.Airline_api.enums.CompanySize;
import com.FBS.Airline_api.enums.EmployeeRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private EmployeeRole admin;
    private List<Employee> employees;
    private List<Aircraft> aircrafts;
    private List<Flight> flights;

}
