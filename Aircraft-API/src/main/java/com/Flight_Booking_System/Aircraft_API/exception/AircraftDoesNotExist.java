package com.Flight_Booking_System.Aircraft_API.exception;

public class AircraftDoesNotExist extends RuntimeException{

    public AircraftDoesNotExist(String message){
        super(message);
    }
}
