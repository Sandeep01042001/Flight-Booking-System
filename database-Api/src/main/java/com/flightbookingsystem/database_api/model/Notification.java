package com.flightbookingsystem.database_api.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Notification {
    @Id
    private String notificationId;

    private String type;
    private String message;
    private ZonedDateTime sentAt;
    private String status;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

}
