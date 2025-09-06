package com.flightbookingsystem.database_api.model;


import com.flightbookingsystem.database_api.reposatories.CustomerRepository;
import com.flightbookingsystem.database_api.reposatories.FeedBackRepository;
import com.flightbookingsystem.database_api.reposatories.FlightRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Flight {
    @Id
    private String flightId;

    @ManyToOne
    @JoinColumn(name = "origin_airport_id")
    private Airport originAirport;

    @ManyToOne
    @JoinColumn(name = "destination_airport_id")
    private Airport destinationAirport;

    private ZonedDateTime departure;
    private ZonedDateTime arrival;

    private Double price;
    private String status;

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private Airline airline;

    @ManyToOne
    @JoinColumn(name = "aircraft_id")
    private Aircraft aircraft;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL)
    private List<Seat> seats;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL)
    private List<FeedBack> feedbacks;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL)
    private List<WaitList> waitlists;
}
