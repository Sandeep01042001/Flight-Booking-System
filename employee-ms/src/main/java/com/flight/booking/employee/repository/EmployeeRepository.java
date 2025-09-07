package com.flight.booking.employee.repository;


import com.flight.booking.employee.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository; // JPA repository
import org.springframework.stereotype.Repository;


import java.util.Optional;


@Repository // repository bean
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // find employee by email to enforce uniqueness during business logic
    Optional<Employee> findByEmail(String email);
}