package com.FBS.Customer_Api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Customer {
    @Id
    @GeneratedValue
    private UUID customerId;

    private String name;
    private String email;
    private String phone;
    private String password;
    private String address;

    private Double walletBalance;
    private Integer loyaltyPoints;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Notification> notifications;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<FeedBack> feedbacks;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<WaitList> waitlists;



}
