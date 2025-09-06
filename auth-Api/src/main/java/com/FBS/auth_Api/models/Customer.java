package com.FBS.auth_Api.models;

import java.util.List;
import java.util.UUID;

import javax.management.Notification;

public class Customer {
    
    private UUID customerId;

    private String name;
    private String email;
    private String phone;
    private String password;
    private String address;

    private Double walletBalance;
    private Integer loyaltyPoints;

    private Role role;
    private List<Booking> bookings;
    private List<Notification> notifications;
    private List<FeedBack> feedbacks;
    private List<WaitList> waitlists;
}
