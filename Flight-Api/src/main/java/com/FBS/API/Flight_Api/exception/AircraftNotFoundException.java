package com.FBS.API.Flight_Api.exception;


public class AircraftNotFoundException extends RuntimeException{
    public AircraftNotFoundException(String message){
        super(message);
    }
}
