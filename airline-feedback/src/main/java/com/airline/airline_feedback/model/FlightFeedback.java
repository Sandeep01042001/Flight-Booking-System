package com.airline.airline_feedback.model;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FlightFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String flightNumber;
    private String passengerName;
    private String comments;
    private int rating;

    // Constructors
    public FlightFeedback() {}

    public FlightFeedback(String flightNumber, String passengerName, String comments, int rating) {
        this.flightNumber = flightNumber;
        this.passengerName = passengerName;
        this.comments = comments;
        this.rating = rating;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
}
