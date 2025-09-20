//package com.airline.airline_feedback.repository;
//
//public class FlightFeedbackRepository {
//}
package com.airline.airline_feedback.repository;

import com.airline.airline_feedback.model.FlightFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightFeedbackRepository extends JpaRepository<FlightFeedback, Long> {
    // You can add custom queries here if needed
}
