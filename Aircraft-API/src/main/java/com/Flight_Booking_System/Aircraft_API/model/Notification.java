package com.Flight_Booking_System.Aircraft_API.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {

    private UUID notificationId;

    private String type;
    private String message;
    private ZonedDateTime sentAt;
    private String status;


    private Customer customer;
}
