package com.flightbookingsystem.database_api.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Aircraft {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID aircraftId;

    private String aircraftNumber;
    private String type;
    private Integer capacity;
    private String configuration;

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private Airline airline;

    @OneToMany(mappedBy = "aircraft", cascade = CascadeType.ALL)
    private List<Flight> flights;
}


