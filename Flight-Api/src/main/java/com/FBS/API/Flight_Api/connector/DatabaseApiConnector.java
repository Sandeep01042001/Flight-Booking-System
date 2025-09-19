package com.FBS.API.Flight_Api.connector;

import com.FBS.API.Flight_Api.models.Flight;
import jdk.jfr.Category;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class DatabaseApiConnector {
    @Value("${database.api.url}")
    String databaseApiUrl;

    public Flight createFlightEndPoint(Flight flight, UUID originId, UUID destinationId, UUID airlineId, UUID aircraftId){
        String url=databaseApiUrl +"/flight/create/" + originId + "/" + destinationId + "/" + airlineId + "/" + aircraftId;
        RequestEntity<Flight> requestEntity= RequestEntity.post(url).body(flight);
        RestTemplate restTemplate=new RestTemplate();
        ResponseEntity< Flight> responseEntity=restTemplate.exchange(url, HttpMethod.POST,requestEntity, Flight.class);

        return responseEntity.getBody();
    }

    public List<Flight> getAllFlights(){
        String url = databaseApiUrl + "/flight";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Flight[]> response = restTemplate.getForEntity(url, Flight[].class);
        Flight[] body = response.getBody();
        return body == null ? List.of() : Arrays.asList(body);
    }

    public Flight getFlightById(UUID flightId){
        String url = databaseApiUrl + "/flight/" + flightId;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Flight> response = restTemplate.getForEntity(url, Flight.class);
        return response.getBody();
    }

    public Flight updateFlight(UUID flightId, Flight flight){
        String url = databaseApiUrl + "/flight/" + flightId;
        RequestEntity<Flight> request = RequestEntity.put(url).body(flight);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Flight> response = restTemplate.exchange(url, HttpMethod.PUT, request, Flight.class);
        return response.getBody();
    }

    public void deleteFlight(UUID flightId){
        String url = databaseApiUrl + "/flight/" + flightId;
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.delete(url);
    }
}
