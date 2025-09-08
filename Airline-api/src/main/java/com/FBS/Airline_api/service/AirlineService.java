package com.FBS.Airline_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.FBS.Airline_api.contectors.DatabaseApiContectors;
import com.FBS.Airline_api.dto.AirlineDetailsDto;
import com.FBS.Airline_api.enums.EmployeeRole;
import com.FBS.Airline_api.model.Airline;
import com.FBS.Airline_api.model.Employee;
import com.FBS.Airline_api.utility.MappingUtility;

@Service
public class AirlineService {

    MappingUtility mappingUtility;
    DatabaseApiContectors databaseApiContectors;

    public AirlineService(MappingUtility mappingUtility, DatabaseApiContectors databaseApiContectors) {
        this.mappingUtility = mappingUtility;
        this.databaseApiContectors = databaseApiContectors;
    }


    public Airline registerAirline(AirlineDetailsDto airlineDetailsDto){
        // we need to create airline and employee
        Airline airline = mappingUtility.mapToAirline(airlineDetailsDto, EmployeeRole.ADMIN);

        Employee admin = mappingUtility.mapToEmployee(airlineDetailsDto, EmployeeRole.ADMIN); 
        admin.setAirlineName(airline);

        this.createAirlineInDatabase(airline);
        this.createEmployeeInDatabase(admin);

        return airline;
    
    }


    public Airline createAirlineInDatabase(Airline airline){
        return databaseApiContectors.callGetCreateAirlineEndPoint(airline);
    }


    public Employee createEmployeeInDatabase(Employee admin){
        return databaseApiContectors.callGetCreateEmployeeEndPoint(admin);
    }
    
}
