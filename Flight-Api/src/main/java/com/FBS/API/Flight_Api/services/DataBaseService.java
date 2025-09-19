package com.FBS.API.Flight_Api.services;

import com.FBS.API.Flight_Api.connector.DatabaseApiConnector;
import com.FBS.API.Flight_Api.models.Flight;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DataBaseService {
    DatabaseApiConnector databaseApiConnector;
    @Autowired
    public DataBaseService(DatabaseApiConnector databaseApiConnector){
        this.databaseApiConnector=databaseApiConnector;
    }

    public Flight createFlight(Flight flight, UUID originId, UUID destinationId, UUID airlineId, UUID aircraftId){
        return databaseApiConnector.createFlightEndPoint(flight, originId, destinationId, airlineId, aircraftId);
    }

    public List<Flight> getAllFlights(){
        return databaseApiConnector.getAllFlights();
    }

    public Flight getFlightById(UUID flightId){
        return databaseApiConnector.getFlightById(flightId);
    }

    public Flight updateFlight(UUID flightId, Flight flight){
        return databaseApiConnector.updateFlight(flightId, flight);
    }

    public void deleteFlight(UUID flightId){
        databaseApiConnector.deleteFlight(flightId);
    }

}
