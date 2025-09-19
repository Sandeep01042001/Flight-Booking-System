package com.FBS.API.Flight_Api.connector;

import com.FBS.API.Flight_Api.models.Airline;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class AirLineApiConnector {

    // Use database API for airline read operations
    @Value("${database.api.url}")
    String databaseApiUrl;

    public Airline getAirlineDetails(UUID airlineId) {
        // Read airline details from database-api
        String url = databaseApiUrl + "/airline/get/" + airlineId;

        //call api
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Airline> responseEntity = restTemplate.exchange(url, HttpMethod.GET, null, Airline.class
        );

        return responseEntity.getBody();


    }
}

