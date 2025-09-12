package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.Seat;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatRepository extends JpaRepository<Seat,UUID> {
}
