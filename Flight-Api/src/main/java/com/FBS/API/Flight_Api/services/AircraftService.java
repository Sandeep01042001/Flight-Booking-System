package com.FBS.API.Flight_Api.services;

import com.FBS.API.Flight_Api.connector.AircraftConnector;
import com.FBS.API.Flight_Api.models.Aircraft;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.util.UUID;

@Service
public class AircraftService {

    AircraftConnector aircraftConnector;
 
    @Autowired
    public AircraftService(AircraftConnector aircraftConnector){
        this.aircraftConnector=aircraftConnector;
    }

    public Aircraft getAircraftById(UUID aircraftId){
        Aircraft aircraft=aircraftConnector.getAircraftEndPoint(aircraftId);
        if (aircraft == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aircraft with ID " + aircraftId + " not found.");
        }
        return aircraft;
    }

}
