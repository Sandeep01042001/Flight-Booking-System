package com.FBS.auth_Api.models;

import java.time.ZonedDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Flight {
    
    private String flightId;
    private Airport originAirport;
    private Airport destinationAirport;

    private ZonedDateTime departure;
    private ZonedDateTime arrival;

    private Double price;
    private String status;
    private Airline airline;
    private Aircraft aircraft;
    private List<Seat> seats;
    private List<Booking> bookings;
    private List<FeedBack> feedbacks;
    private List<WaitList> waitlists;
}
