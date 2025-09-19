package com.FBS.API.Flight_Api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    private UUID notificationId;

    private String type;
    private String message;
    private ZonedDateTime sentAt;
    private String status;

    private Customer customer;

}

