package com.Flight_Booking_System.Aircraft_API.model;

import com.Flight_Booking_System.Aircraft_API.enums.CompanySize;

import java.util.List;
import java.util.UUID;

public class Airline {
    private UUID airlineId;
    private String name;
    private String officialName;
    private String address;
    private CompanySize companySize;
    private String logo;
    private String status;
    private List<Employee> employees;
    private List<Aircraft> airCrafts;
    private List<Flight> flights;
}
