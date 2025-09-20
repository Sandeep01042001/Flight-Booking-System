//package com.airline.airline_feedback.controller;
//
//public class AirlineFeedbackController {
//}
package com.airline.airline_feedback.controller;

import com.airline.airline_feedback.model.FlightFeedback;
import com.airline.airline_feedback.service.FlightFeedbackClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class AirlineFeedbackController {

    @Autowired
    private FlightFeedbackClientService service;

    @PostMapping
    public FlightFeedback addFeedback(@RequestBody FlightFeedback feedback) {
        return service.saveFeedback(feedback);
    }

    @GetMapping
    public List<FlightFeedback> getAllFeedback() {
        return service.getAllFeedbacks();
    }

    @GetMapping("/{id}")
    public FlightFeedback getFeedbackById(@PathVariable Long id) {
        return service.getFeedbackById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteFeedback(@PathVariable Long id) {
        service.deleteFeedback(id);
        return "Feedback deleted with id: " + id;
    }
}
