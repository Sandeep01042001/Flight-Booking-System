package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.WaitList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaitListRepository extends JpaRepository<WaitList,String> {
}
