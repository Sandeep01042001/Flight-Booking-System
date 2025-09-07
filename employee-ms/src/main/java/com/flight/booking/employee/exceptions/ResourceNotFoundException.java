package com.flight.booking.employee.exceptions;



public    class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message); // pass message to RuntimeException
    }
}