//package com.airline.airline_feedback.service;
//
//public class FlightFeedbackClientService {
//}
package com.airline.airline_feedback.service;

import com.airline.airline_feedback.model.FlightFeedback;
import com.airline.airline_feedback.repository.FlightFeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightFeedbackClientService {

    @Autowired
    private FlightFeedbackRepository repository;

    public FlightFeedback saveFeedback(FlightFeedback feedback) {
        return repository.save(feedback);
    }

    public List<FlightFeedback> getAllFeedbacks() {
        return repository.findAll();
    }

    public FlightFeedback getFeedbackById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteFeedback(Long id) {
        repository.deleteById(id);
    }
}
