package com.FBS.Customer_Api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Employee {
    @Id
    private String employeeId;

    private String name;
    private String email;

    @Enumerated(EnumType.STRING)
    private EmployeeRole employeeRole;

    private String status;

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private Airline airline;

}
