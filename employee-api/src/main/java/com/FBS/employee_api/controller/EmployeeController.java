package com.FBS.employee_api.controller;
import com.FBS.employee_api.dto.EmployeeDTO;
import com.FBS.employee_api.model.Employee;
import com.FBS.employee_api.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;


@RestController // marks this as controller with @ResponseBody by default
@RequestMapping("/api/v1/airline/employee") // base path for all endpoints
public class EmployeeController {

    EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService){
        this.employeeService = employeeService;
    }

      

    @PostMapping("/register")
    public Employee registerEmployee(@RequestBody EmployeeDTO employeeDTO){
        try {
            return this.employeeService.registerEmployee(employeeDTO);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
}