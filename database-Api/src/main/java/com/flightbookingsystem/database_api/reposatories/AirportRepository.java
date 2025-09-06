package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AirportRepository extends JpaRepository<Airport, UUID> {
}
