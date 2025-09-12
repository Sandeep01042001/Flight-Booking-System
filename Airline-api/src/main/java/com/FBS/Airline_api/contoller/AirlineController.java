package com.FBS.Airline_api.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.FBS.Airline_api.dto.AirlineDetailsDto;
import com.FBS.Airline_api.model.Airline;
import com.FBS.Airline_api.service.AirlineService;

@RestController
@RequestMapping("/api/v1/airline")
public class AirlineController {

    AirlineService airlineService;
    
    @Autowired
    public AirlineController(AirlineService airlineService) {
        this.airlineService = airlineService;
    }

    @PostMapping("/register")
    public Airline registerAirline(@RequestBody AirlineDetailsDto airlineDetailsDto){
          return this.airlineService.registerAirline(airlineDetailsDto);
    }
    
}
