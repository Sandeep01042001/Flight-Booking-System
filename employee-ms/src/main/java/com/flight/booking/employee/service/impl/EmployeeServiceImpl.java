package  com.flight.booking.employee.service.impl;

import com.flight.booking.employee.dto.EmployeeDTO;
import com.flight.booking.employee.exceptions.BadRequestException;
import com.flight.booking.employee.exceptions.ResourceNotFoundException;
import com.flight.booking.employee.model.Employee;
import com.flight.booking.employee.repository.EmployeeRepository;
import com.flight.booking.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;


@Service // marks this as a service bean
public class EmployeeServiceImpl implements EmployeeService {


    private final EmployeeRepository repository;


    @Autowired // constructor injection of repository
    public EmployeeServiceImpl(EmployeeRepository repository) {
        this.repository = repository;
    }


    // helper: map DTO to entity
    private Employee toEntity(EmployeeDTO dto) {
        Employee e = new Employee();
        e.setId(dto.getId());
        e.setFirstName(dto.getFirstName());
        e.setLastName(dto.getLastName());
        e.setEmail(dto.getEmail());
        e.setRole(dto.getRole());
        e.setStatus(dto.getStatus());
        return e;
    }


    // helper: map entity to DTO
    private EmployeeDTO toDTO(Employee e) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(e.getId());
        dto.setFirstName(e.getFirstName());
        dto.setLastName(e.getLastName());
        dto.setEmail(e.getEmail());
        dto.setRole(e.getRole());
        dto.setStatus(e.getStatus());
        return dto;
    }


    @Override
    public EmployeeDTO createEmployee(EmployeeDTO dto) {
// check if email already exists
        repository.findByEmail(dto.getEmail()).ifPresent(emp -> {
            throw new BadRequestException("Email already in use");
        });
// set default status if not provided
        if (dto.getStatus() == null || dto.getStatus().isBlank()) {
            dto.setStatus("ACTIVE");
        }
        Employee saved = repository.save(toEntity(dto)); // persist entity
        return toDTO(saved);
    }


    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        Employee e = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        return toDTO(e);
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }


    @Override
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee existing = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
// if email is being changed, ensure uniqueness
        if (!existing.getEmail().equals(dto.getEmail())) {
            repository.findByEmail(dto.getEmail()).ifPresent(e -> { throw new BadRequestException("Email already in use"); });
        }
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setRole(dto.getRole());
        existing.setStatus(dto.getStatus());
        Employee saved = repository.save(existing);
        return toDTO(saved);
    }


    @Override
    public void deleteEmployee(Long id) {
        Employee existing = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        repository.delete(existing);
    }
}