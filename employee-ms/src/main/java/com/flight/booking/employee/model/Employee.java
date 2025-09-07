package com.flight.booking.employee.model;
import jakarta.persistence.*;
import lombok.*; // lombok annotations to reduce boilerplate


// Use Lombok to auto-generate getters, setters, constructors, toString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity // JPA entity maps to a database table
@Table(name = "employees") // explicit table name
public class Employee {


    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment id
    private Long id; // unique id for an employee


    @Column(nullable = false) // DB column cannot be null
    private String firstName; // first name


    @Column(nullable = false)
    private String lastName; // last name


    @Column(nullable = false, unique = true) // unique constraint on email
    private String email; // employee email


    @Column(nullable = false)
    private String role; // role (e.g., ADMIN, USER, MANAGER)


    @Column(nullable = false)
    private String status; // status (e.g., ACTIVE, INACTIVE)
}
