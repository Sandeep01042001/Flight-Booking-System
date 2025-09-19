package com.FBS.API.Flight_Api.models;


import com.FBS.API.Flight_Api.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

