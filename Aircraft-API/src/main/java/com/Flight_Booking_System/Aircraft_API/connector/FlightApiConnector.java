package com.Flight_Booking_System.Aircraft_API.connector;

import com.Flight_Booking_System.Aircraft_API.model.Airline;
import com.Flight_Booking_System.Aircraft_API.model.Flight;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Component
public class FlightApiConnector {

    @Value("${flight.api.url}")
    String flightApiUrl;

    public List<Flight> getFlightDetails(List<UUID> flightIds) {
        String url = flightApiUrl + "/flight/getFlightsByIds";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<UUID>> requestEntity = new HttpEntity<>(flightIds, headers);

        ResponseEntity<List<Flight>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<List<Flight>>() {}
        );

        return responseEntity.getBody();
    }

}
