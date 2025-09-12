package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.Payment;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,UUID> {
}
