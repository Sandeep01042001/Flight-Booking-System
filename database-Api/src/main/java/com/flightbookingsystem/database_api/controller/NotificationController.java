package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Customer;
import com.flightbookingsystem.database_api.model.Notification;
import com.flightbookingsystem.database_api.reposatories.CustomerRepository;
import com.flightbookingsystem.database_api.reposatories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/db/notification")
public class NotificationController {

    NotificationRepository notificationRepository;
     CustomerRepository customerRepository;

    @Autowired
    public NotificationController(NotificationRepository notificationRepository,
                                  CustomerRepository customerRepository) {
        this.notificationRepository = notificationRepository;
        this.customerRepository = customerRepository;
    }

    // Get all notifications
    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // Get notification by ID
    @GetMapping("/{notificationId}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }

    // Create new notification
    @PostMapping("/create/{customerId}")
    public ResponseEntity<Notification> createNotification(@PathVariable UUID customerId,
                                                           @RequestBody Notification notification) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        notification.setCustomer(customer);
        notification.setSentAt(ZonedDateTime.now());

        Notification savedNotification = notificationRepository.save(notification);
        return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
    }

    // Update notification
    @PutMapping("/{notificationId}")
    public ResponseEntity<Notification> updateNotification(@PathVariable UUID notificationId,
                                                           @RequestBody Notification updatedNotification) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        notification.setType(updatedNotification.getType());
        notification.setMessage(updatedNotification.getMessage());
        notification.setStatus(updatedNotification.getStatus());

        Notification savedNotification = notificationRepository.save(notification);
        return new ResponseEntity<>(savedNotification, HttpStatus.OK);
    }

    // Delete notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        notificationRepository.delete(notification);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
