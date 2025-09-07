package com.flight.booking.employee.exceptions;




public     class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}