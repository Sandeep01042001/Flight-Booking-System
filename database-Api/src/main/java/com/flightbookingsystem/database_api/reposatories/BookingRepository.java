package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking,String> {
}
