package com.FBS.API.Flight_Api.connector;

import com.FBS.API.Flight_Api.models.Airport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class AirportApiConnector {

    @Value("${airport.api.url}")
    String airportUrl;

    public Airport getAirportEndPoint(UUID airportId) {

        String url = airportUrl + "/" + airportId;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Airport> responseEntity = restTemplate.exchange(url, HttpMethod.GET,null,Airport.class);
        return responseEntity.getBody();
    }
}