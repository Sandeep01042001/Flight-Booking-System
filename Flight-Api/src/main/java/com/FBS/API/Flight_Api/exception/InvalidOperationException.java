package com.FBS.API.Flight_Api.exception;

public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message){
        super(message);
    }
}

