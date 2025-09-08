package com.FBS.Airline_api.contectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.FBS.Airline_api.dto.AirlineDetailsDto;
import com.FBS.Airline_api.model.Airline;
import com.FBS.Airline_api.model.Employee;

@Component
public class DatabaseApiContectors {

    @Value("${database.api.url}")
    String databaseApiUrl;

    public Airline callGetCreateAirlineEndPoint( Airline airline){
        // create Url 
        String url = databaseApiUrl + "/airline/create";
        // call rest api
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Airline> response = restTemplate.postForEntity(url, airline, Airline.class);
        return response.getBody(); 
    }
    

    public Employee callGetCreateEmployeeEndPoint(Employee admin){

        // create Url 
        String url = databaseApiUrl + "/employee/create/admin";
        // call rest api
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Employee> response = restTemplate.postForEntity(url, admin, Employee.class);
        return response.getBody(); 
        
    }
}
