package com.FBS.API.Flight_Api.exception;

public class AirportNotFoundException extends RuntimeException{
    public AirportNotFoundException(String message){
        super(message);
    }
}
