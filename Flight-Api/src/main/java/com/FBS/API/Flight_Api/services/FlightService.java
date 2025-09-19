package com.FBS.API.Flight_Api.services;

import com.FBS.API.Flight_Api.dto.FlightRequestDto;
import com.FBS.API.Flight_Api.dto.FlightResponseDto;
import com.FBS.API.Flight_Api.models.*;
import com.FBS.API.Flight_Api.utility.MappingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.UUID;
import java.util.List;

@Service
public class FlightService {

    AirlineService airlineService;
    MappingUtility mappingUtility;
    AircraftService aircraftService;
    AirPortService airPortService;
    DataBaseService dataBaseService;
    @Autowired
    public FlightService(AirlineService airlineService,
                         MappingUtility mappingUtility,
                         AircraftService aircraftService,
                         AirPortService airPortService,
                         DataBaseService dataBaseService){
        this.airlineService=airlineService;
        this.mappingUtility=mappingUtility;
        this.aircraftService=aircraftService;
        this.airPortService=airPortService;
        this.dataBaseService=dataBaseService;
    }

    public Flight createFlight(FlightRequestDto flightRequestDto){
        /**
         * Get originAirPort and destinationAirport in the database
         * call the AirportService
         */
        Airport originAirport=airPortService.getAirportById(flightRequestDto.getOriginAirportId());
        Airport destinationAirport=airPortService.getAirportById(flightRequestDto.getDestinationAirportId());

        //get to airline by airlineId
        Airline airline=airlineService.getAirLineById(flightRequestDto.getAirlineId());

        //get aircraft by aircraftId
        Aircraft aircraft=aircraftService.getAircraftById(flightRequestDto.getAircraftId());


        Flight flight=mappingUtility.mapFlightRequestToFlight(flightRequestDto,originAirport,destinationAirport,airline,aircraft);
        flight=dataBaseService.createFlight(
                flight,
                flightRequestDto.getOriginAirportId(),
                flightRequestDto.getDestinationAirportId(),
                flightRequestDto.getAirlineId(),
                flightRequestDto.getAircraftId()
        );
        return flight;
    }

    public Flight getFlightById(UUID flightId){
        return dataBaseService.getFlightById(flightId);
    }

    public List<Flight> getAllFlights(){
        return dataBaseService.getAllFlights();
    }

    public Flight updateFlight(UUID flightId, FlightRequestDto flightRequestDto){
        Flight existing = dataBaseService.getFlightById(flightId);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight with ID " + flightId + " not found.");
        }

        Airport originAirport=airPortService.getAirportById(flightRequestDto.getOriginAirportId());
        Airport destinationAirport=airPortService.getAirportById(flightRequestDto.getDestinationAirportId());
        Airline airline=airlineService.getAirLineById(flightRequestDto.getAirlineId());
        Aircraft aircraft=aircraftService.getAircraftById(flightRequestDto.getAircraftId());

        Flight toUpdate = mappingUtility.mapFlightRequestToFlight(flightRequestDto,originAirport,destinationAirport,airline,aircraft);
        toUpdate.setFlightId(flightId);
        return dataBaseService.updateFlight(flightId, toUpdate);
    }

    public void deleteFlight(UUID flightId){
        Flight existing = dataBaseService.getFlightById(flightId);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight with ID " + flightId + " not found.");
        }
        dataBaseService.deleteFlight(flightId);
    }
}
