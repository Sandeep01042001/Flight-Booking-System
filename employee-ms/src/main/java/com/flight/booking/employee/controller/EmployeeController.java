package com.flight.booking.employee.controller;
import com.flight.booking.employee.dto.EmployeeDTO;
import com.flight.booking.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;


@RestController // marks this as controller with @ResponseBody by default
@RequestMapping("/api/employees") // base path for all endpoints
@Validated
public class EmployeeController {


    private final EmployeeService service;


    @Autowired
    public EmployeeController(EmployeeService service) {
        this.service = service; // inject service
    }


    // Create employee endpoint: POST /api/employees
    @PostMapping()
    public ResponseEntity<EmployeeDTO> createEmployee(@Valid @RequestBody EmployeeDTO dto) {
        EmployeeDTO created = service.createEmployee(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }


    // Get employee by id: GET /api/employees/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployee(@PathVariable Long id) {
        EmployeeDTO dto = service.getEmployeeById(id);
        return ResponseEntity.ok(dto);
    }


    // Get all employees: GET /api/employees
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAll() {
        return ResponseEntity.ok(service.getAllEmployees());
    }


    // Update employee: PUT /api/employees/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDTO dto) {
        EmployeeDTO updated = service.updateEmployee(id, dto);
        return ResponseEntity.ok(updated);
    }

    // Delete employee: DELETE /api/employees/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        service.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}