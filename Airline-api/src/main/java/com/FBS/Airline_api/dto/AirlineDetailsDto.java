package com.FBS.Airline_api.dto;

import java.util.UUID;

import com.FBS.Airline_api.enums.CompanySize;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirlineDetailsDto {

    private String name;
    private String officialName;
    private String officialEmail;
    private String officialPhone;
    private String adminName;
    private String adminEmail;
    private String adminPhone;
    private String address;
    
}
