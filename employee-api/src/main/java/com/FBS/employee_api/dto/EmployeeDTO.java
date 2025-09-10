package com.FBS.employee_api.dto;



import java.util.UUID;





import lombok.*; // lombok


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeDTO {

    private String name;
    private String email;
    private String phone;
    private String address;
    private String employeeRole;
    private String status;
    private String airlineId;
    
}