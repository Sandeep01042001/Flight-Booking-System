package com.FBS.employee_api.utility;

import org.springframework.stereotype.Component;

import com.FBS.employee_api.dto.EmployeeDTO;
import com.FBS.employee_api.enums.EmployeeRole;
import com.FBS.employee_api.model.Employee;

@Component
public class MapUtility {


     public Employee mapToEmployee(EmployeeDTO employeeDTO){

        Employee employee = Employee.builder()
        .name(employeeDTO.getName())
        .email(employeeDTO.getEmail())
        .phone(employeeDTO.getPhone())
        .address(employeeDTO.getAddress())
        .employeeRole(EmployeeRole.valueOf(employeeDTO.getEmployeeRole().toUpperCase()))
        .build();
        
        return employee;
     }
    
}
