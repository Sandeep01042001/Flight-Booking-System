package com.FBS.employee_api.model;

import java.util.List;
import java.util.UUID;

import com.FBS.employee_api.enums.Role;
import com.FBS.employee_api.model.FeedBack;
import com.FBS.employee_api.model.WaitList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
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
}
