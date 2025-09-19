package com.Flight_Booking_System.Aircraft_API.exception;

public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message){
        super(message);
    }
}
