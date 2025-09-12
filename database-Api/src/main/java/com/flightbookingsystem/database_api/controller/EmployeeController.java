package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Airline;
import com.flightbookingsystem.database_api.model.Employee;
import com.flightbookingsystem.database_api.model.Role;
import com.flightbookingsystem.database_api.reposatories.AirlineRepository;
import com.flightbookingsystem.database_api.reposatories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/db/employee")
public class EmployeeController {


     EmployeeRepository employeeRepository;
     AirlineRepository airlineRepository;

    @Autowired
    public EmployeeController(EmployeeRepository employeeRepository, AirlineRepository airlineRepository) {
        this.employeeRepository = employeeRepository;
        this.airlineRepository = airlineRepository;
    }

   

    // Get all employees
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    @GetMapping("/get/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }
     // create a new employee with Admin role
     @PostMapping("/create/admin")
     public ResponseEntity<Employee> createEmployeeWithRole(@RequestBody Employee employee) {
        return new ResponseEntity<>(employeeRepository.save(employee), HttpStatus.CREATED);
     }


    // Create a new employee with airline id
    @PostMapping("/create/{airlineId}") 
    public ResponseEntity<Employee> createEmployee(@PathVariable UUID airlineId, @RequestBody Employee employee) {
        Airline airline = airlineRepository.findById(airlineId).orElse(null);
        if (airline == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        employee.setAirline(airline);
        Employee savedEmployee = employeeRepository.save(employee);
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    // Update employee
    @PutMapping("/{employeeId}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable UUID employeeId, @RequestBody Employee updatedEmployee) {
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        employee.setName(updatedEmployee.getName());
        employee.setEmail(updatedEmployee.getEmail());
        employee.setEmployeeRole(updatedEmployee.getEmployeeRole());
        employee.setStatus(updatedEmployee.getStatus());

        // Optionally update airline
        if (updatedEmployee.getAirline() != null) {
            employee.setAirline(updatedEmployee.getAirline());
        }

        Employee savedEmployee = employeeRepository.save(employee);
        return new ResponseEntity<>(savedEmployee, HttpStatus.OK);
    }

    // Delete employee
    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        employeeRepository.delete(employee);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

