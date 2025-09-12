package com.FBS.employee_api.conector;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.FBS.employee_api.model.Airline;
import com.FBS.employee_api.model.Employee;



@Component
public class DatabaseApiConector {
    
    @Value("${database.api.url}")
    String databaseApiUrl;

    public Employee callDatabasePostMethodToRegisterEmployee(Employee employee, UUID airlineId){

        // create Url
        String url = databaseApiUrl + "/employee/create/{airlineId}";

        // call post method
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Employee> response = restTemplate.postForEntity(url, employee, Employee.class, airlineId);
        return response.getBody();
        
    }


    public Airline callDatabaseGetMethodToGetAirline(UUID airlineId){

        // create Url
        String url = databaseApiUrl + "/airline/get/{airlineId}";

        // call get method
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Airline> response = restTemplate.getForEntity(url, Airline.class, airlineId);
        return response.getBody();
    }


    public Airline callDatabasePutMethodToUpdateAirline(Airline airline, UUID airlineId){

        
        // create Url
        String url = databaseApiUrl + "/airline/update/{airlineId}";

        // call put method
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Airline> response = restTemplate.postForEntity(url, airline, Airline.class, airlineId);
        return response.getBody();
        
    }
    
}
