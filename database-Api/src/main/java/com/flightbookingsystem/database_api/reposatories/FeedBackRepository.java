package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedBackRepository extends JpaRepository<FeedBack,String> {
}
