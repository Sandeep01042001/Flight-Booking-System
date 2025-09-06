package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.Fare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FareRepository extends JpaRepository<Fare, UUID> {
}
