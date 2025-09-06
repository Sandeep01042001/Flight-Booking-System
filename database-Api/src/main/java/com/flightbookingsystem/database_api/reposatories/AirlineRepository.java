package com.flightbookingsystem.database_api.reposatories;


import com.flightbookingsystem.database_api.model.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirlineRepository extends JpaRepository<Airline,String> {

}
