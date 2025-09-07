package com.flight.booking.employee.dto;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*; // lombok


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EmployeeDTO {


    private Long id; // optional in create, present in responses


    @NotBlank(message = "firstName cannot be blank") // validation: not null/empty
    @Size(max = 50, message = "firstName max 50 characters") // validation: length limit
    private String firstName;


    @NotBlank(message = "lastName cannot be blank")
    @Size(max = 50, message = "lastName max 50 characters")
    private String lastName;


    @NotBlank(message = "email cannot be blank")
    @Email(message = "email should be valid") // validation: must be email format
    private String email;


    @NotBlank(message = "role cannot be blank")
    private String role; // e.g., ADMIN, USER


    @NotBlank(message = "status cannot be blank")
    private String status; // e.g., ACTIVE, INACTIVE
}