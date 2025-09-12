package com.FBS.employee_api.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FBS.employee_api.conector.DatabaseApiConector;
import com.FBS.employee_api.dto.EmployeeDTO;
import com.FBS.employee_api.model.Airline;
import com.FBS.employee_api.model.Employee;
import com.FBS.employee_api.utility.MapUtility;

@Service
public class EmployeeService {
    
    MapUtility mapUtility;
    DatabaseApiConector databaseApiConector;

    @Autowired
    public EmployeeService(MapUtility mapUtility, DatabaseApiConector databaseApiConector){
        this.mapUtility = mapUtility;
        this.databaseApiConector = databaseApiConector; 
    }

    public Employee registerEmployee(EmployeeDTO employeeDTO){

         
        UUID airlineId = UUID.fromString(employeeDTO.getAirlineId());
        Airline airline = this.getAirlineFromDatabase(airlineId);
    
        if (airline == null) {
            throw new RuntimeException("Airline not found with ID: " + airlineId);
        }
    
        Employee employee = mapUtility.mapToEmployee(employeeDTO);
    
        // null safety
        List<Employee> employees = airline.getEmployees();
        if (employees == null) {
            employees = new ArrayList<>();
        }
        employees.add(employee);
        airline.setEmployees(employees);
    
        // set default status
        employee.setStatus("ACTIVE");
        employee.setAirline(airline);
        airline = this.updateAirlineInDatabase(airline, airlineId);
        employee = this.registerEmployeeInDatabase(employee, airlineId); 
        return employee;
    }

    public Employee registerEmployeeInDatabase(Employee employee, UUID airlineId){
        return this.databaseApiConector.callDatabasePostMethodToRegisterEmployee(employee, airlineId);
    }

    public Airline getAirlineFromDatabase(UUID airlineId){
        return this.databaseApiConector.callDatabaseGetMethodToGetAirline(airlineId);
    }

    public Airline updateAirlineInDatabase(Airline airline, UUID airlineId){
        return this.databaseApiConector.callDatabasePutMethodToUpdateAirline(airline, airlineId);
    }
    
}
