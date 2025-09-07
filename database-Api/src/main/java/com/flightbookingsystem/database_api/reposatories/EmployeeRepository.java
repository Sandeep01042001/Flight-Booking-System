package com.flightbookingsystem.database_api.reposatories;

import com.flightbookingsystem.database_api.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,String> {

    

}


