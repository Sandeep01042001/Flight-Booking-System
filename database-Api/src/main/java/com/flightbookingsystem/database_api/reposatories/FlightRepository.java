package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.Flight;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightRepository extends JpaRepository<Flight,UUID> {
}
