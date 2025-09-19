package com.Flight_Booking_System.Aircraft_API.connector;

import com.Flight_Booking_System.Aircraft_API.model.Aircraft;
import com.Flight_Booking_System.Aircraft_API.model.Airline;
import com.Flight_Booking_System.Aircraft_API.model.Employee;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Component
public class DataBaseApiConnector {
    @Value("${database.api.url}")
    String databaseApiUrl;

    public Aircraft callGetCreateAirCraftEndPoint(Aircraft aircraft){
        String url=databaseApiUrl + "/aircraft/create";
        RequestEntity requestEntity= RequestEntity.post(url).body(aircraft);
        RestTemplate restTemplate=new RestTemplate();
        ResponseEntity< Aircraft> responseEntity=restTemplate.exchange(url, HttpMethod.POST,requestEntity, Aircraft.class);

        return responseEntity.getBody();
    }

    public Aircraft callGetAirCraftById(UUID aircraftId){

        //create url
        String url=databaseApiUrl + "/aircraft/get/byId" + aircraftId;
        //call api
        RestTemplate restTemplate=new RestTemplate();
        ResponseEntity<Aircraft> responseEntity=restTemplate.exchange(url,HttpMethod.GET,null,Aircraft.class);
        return  responseEntity.getBody();

    }

    public List<Aircraft> callGetAllAirCraftsEndPoint() {
        // Create URL
        String url = databaseApiUrl + "/aircraft/get/all";

        // Call API
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<List<Aircraft>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Aircraft>>() {}
        );

        return responseEntity.getBody();
    }

}
