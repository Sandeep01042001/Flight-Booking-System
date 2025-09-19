package com.FBS.API.Flight_Api.dto;

import com.FBS.API.Flight_Api.models.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponseDto {
    private UUID flightId;
    private String flightName;
    private Airport originAirport;
    private Airport destinationAirport;
    private ZonedDateTime departure;
    private ZonedDateTime arrival;
    private String status;
    private Airline airline;
    private Aircraft aircraft;
    private List<SubFlight> subFlights;
    private List<Seat> seats;
    private List<Booking> bookings;
    private List<FeedBack> feedbacks;
    private List<WaitList> waitlists;
    private List<PriceConfiguration> pricingConfigurations;
}
