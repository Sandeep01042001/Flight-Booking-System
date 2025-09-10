package com.FBS.Airline_api.utility;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.FBS.Airline_api.dto.AirlineDetailsDto;
import com.FBS.Airline_api.enums.CompanySize;
import com.FBS.Airline_api.enums.EmployeeRole;
import com.FBS.Airline_api.model.Airline;
import com.FBS.Airline_api.model.Employee;

@Component
public class MappingUtility {

    public Airline mapToAirline(AirlineDetailsDto airlineDetailsDto, EmployeeRole admin){

        Airline airline = Airline.builder()
        .name(airlineDetailsDto.getName())
        .officialName(airlineDetailsDto.getOfficialName())
        .officialEmail(airlineDetailsDto.getOfficialEmail())
        .officialPhone(airlineDetailsDto.getOfficialPhone())
        .admin(admin)
        .status("ACTIVE")
        .logo("logo")
        .employees(null)
        .aircrafts(null)
        .flights(null)
        
        .build();

        return airline;
        
    }

    public Employee mapToEmployee(AirlineDetailsDto airlineDetailsDto, EmployeeRole employeeRole){

        Employee employee = Employee.builder()
        
        .name(airlineDetailsDto.getAdminName())
        .email(airlineDetailsDto.getAdminEmail())
        .phone(airlineDetailsDto.getAdminPhone())
        .address(airlineDetailsDto.getAddress())
        .airlineName(null)
        .employeeRole(employeeRole)
        .status("ACTIVE")
        .build();

        return employee;
        
    }
    
}
