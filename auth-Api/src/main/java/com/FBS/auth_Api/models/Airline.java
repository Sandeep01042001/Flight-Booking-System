package com.FBS.auth_Api.models;

import java.util.List;
import java.util.UUID;

import com.FBS.auth_Api.enums.CompanySize;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Airline {
    private UUID airlineId;
    private String name;
    private String officialName;
    private String OfficialEmail;
    private String OfficialPhone;
    private String address;
    private CompanySize companySize;
    private String logo;
    private String status;
    private Employee admin;
    private List<Employee> employees;
    private List<Aircraft> aircrafts;
    private List<Flight> flights;
}
