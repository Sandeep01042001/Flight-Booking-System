package com.FBS.API.Flight_Api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightRequestDto {
    @NotBlank(message = "flightName is required")
    private String flightName;

    @NotNull(message = "originAirportId is required")
    private UUID originAirportId;

    @NotNull(message = "destinationAirportId is required")
    private UUID destinationAirportId;

    @NotNull(message = "departure is required")
    @Future(message = "departure must be in the future")
    private ZonedDateTime departure;

    @NotNull(message = "arrival is required")
    @Future(message = "arrival must be in the future")
    private ZonedDateTime arrival;

    @NotBlank(message = "status is required")
    private String status;

    @NotNull(message = "airlineId is required")
    private UUID airlineId;

    @NotNull(message = "aircraftId is required")
    private UUID aircraftId;
}
