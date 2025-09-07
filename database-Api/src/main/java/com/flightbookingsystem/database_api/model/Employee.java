package com.flightbookingsystem.database_api.model;


import java.util.UUID;

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
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID employeeId;

    private String name;
    private String email;

    @Enumerated(EnumType.STRING)
    private EmployeeRole employeeRole;

    private String status;

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private Airline airline;

}
