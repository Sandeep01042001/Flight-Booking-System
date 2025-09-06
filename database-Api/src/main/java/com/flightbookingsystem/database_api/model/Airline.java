package com.flightbookingsystem.database_api.model;


import com.flightbookingsystem.database_api.enums.CompanySize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Airline {

    @Id
    private String airlineId;

    private String name;
    private String officialName;
    private String address;

    @Enumerated(EnumType.STRING)
    private CompanySize companySize;

    private String logo;
    private String status;

    @OneToMany(mappedBy = "airline", cascade = CascadeType.ALL)
    private List<Employee> employees;

    @OneToMany(mappedBy = "airline", cascade = CascadeType.ALL)
    private List<Aircraft> aircrafts;

    @OneToMany(mappedBy = "airline", cascade = CascadeType.ALL)
    private List<Flight> flights;

}
