package com.Flight_Booking_System.Aircraft_API.connector;

import com.Flight_Booking_System.Aircraft_API.model.Airline;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class AirLineApiConnector {

    @Value("${airline.api.url}")
    String airlineApiUrl;

    public Airline getAirlineDetails(UUID airlineId) {
        //create url
        String url = airlineApiUrl + "/airline/getAirline?airlineId=" + airlineId;

        //call api
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Airline> responseEntity = restTemplate.exchange(url, HttpMethod.GET, null, Airline.class
        );

        return responseEntity.getBody();


    }
}
