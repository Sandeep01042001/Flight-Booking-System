package com.FBS.API.Flight_Api.connector;

import com.FBS.API.Flight_Api.models.Aircraft;
import com.FBS.API.Flight_Api.models.Airline;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class AircraftConnector {

    @Value("${aircraft.api.url}")
    String aircraftUrl;

    public Aircraft getAircraftEndPoint(UUID aircraftId){
        String url= aircraftUrl + "/get/airCraftById/" + aircraftId;

        //call api
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Aircraft> responseEntity = restTemplate.exchange(url, HttpMethod.GET, null, Aircraft.class
        );

        return responseEntity.getBody();

    }
}
