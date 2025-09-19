package com.Flight_Booking_System.Aircraft_API.service;

import com.Flight_Booking_System.Aircraft_API.connector.DataBaseApiConnector;
import com.Flight_Booking_System.Aircraft_API.dto.AircraftDetailsDTO;
import com.Flight_Booking_System.Aircraft_API.exception.InvalidOperationException;
import com.Flight_Booking_System.Aircraft_API.model.Aircraft;
import com.Flight_Booking_System.Aircraft_API.model.Airline;
import com.Flight_Booking_System.Aircraft_API.model.Flight;
import com.Flight_Booking_System.Aircraft_API.utility.MappingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AircraftService {

    MappingUtility mappingUtility;
    DataBaseApiConnector dataBaseApiConnector;
    @Autowired
    public AircraftService(MappingUtility mappingUtility,
                           DataBaseApiConnector dataBaseApiConnector){
        this.mappingUtility=mappingUtility;
        this.dataBaseApiConnector=dataBaseApiConnector;
    }

    public Aircraft airCraftRegistration(AircraftDetailsDTO aircraftDetailsDTO, Airline airline, List<Flight> flight){
        Aircraft aircraft=mappingUtility.mapAircraftToAircraftDetailsDTO(aircraftDetailsDTO, airline,flight);
        return dataBaseApiConnector.callGetCreateAirCraftEndPoint(aircraft);

    }

    public Aircraft getAirCraftsById(UUID aircraftId){
        Aircraft aircraft=dataBaseApiConnector.callGetAirCraftById(aircraftId);
        if(aircraft ==  null){
            throw new InvalidOperationException(String.format("Aircraft Id does not exist in database",aircraftId.toString()));
        }
        return aircraft;
    }

    public List<Aircraft> getAllAirCrafts() {
        List<Aircraft> aircraftList = dataBaseApiConnector.callGetAllAirCraftsEndPoint();

        if (aircraftList == null || aircraftList.isEmpty()) {
            throw new InvalidOperationException("No AirCrafts found in the database");
        }

        return aircraftList;
    }
}
