package com.FBS.auth_Api.models;

import java.time.ZonedDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


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
