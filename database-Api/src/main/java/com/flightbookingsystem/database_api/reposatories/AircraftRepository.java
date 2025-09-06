package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.Aircraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AircraftRepository extends JpaRepository<Aircraft,String> {

}
