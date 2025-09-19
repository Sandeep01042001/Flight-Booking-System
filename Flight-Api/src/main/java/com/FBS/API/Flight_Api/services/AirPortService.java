package com.FBS.API.Flight_Api.services;

import com.FBS.API.Flight_Api.connector.AirportApiConnector;
import com.FBS.API.Flight_Api.models.Airport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

@Service
public class AirPortService {

    AirportApiConnector airportApiConnector;
    @Autowired
    public AirPortService(AirportApiConnector airportApiConnector){
        this.airportApiConnector=airportApiConnector;
    }
    public Airport getAirportById(UUID airportId){
        Airport airport=airportApiConnector.getAirportEndPoint(airportId);

        if (airport == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Airport with ID " + airportId + " not found.");
        }
        return airport;
    }
}
