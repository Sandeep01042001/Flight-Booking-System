package com.flightbookingsystem.database_api.reposatories;


import com.flightbookingsystem.database_api.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,String> {

}
