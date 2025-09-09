package com.FBS.Customer_Api.model;

import java.util.List;
import java.util.UUID;

import com.FBS.Customer_Api.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private String notification;
    private List<FeedBack> feedbacks;
    private List<WaitList> waitlists;
    
    // Explicit getter for password to ensure it's available
    public String getPassword() {
        return this.password;
    }
}
