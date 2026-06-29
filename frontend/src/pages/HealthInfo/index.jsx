import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function HealthInfo() {
  const healthInfo = {
    healthTips: {
      title: "Health Tips",
      icon: "fas fa-lightbulb",
      sections: [
        {
          subtitle: "Nutrition Tips",
          content: [
            "Eat a balanced diet with plenty of fruits and vegetables",
            "Stay hydrated by drinking 8 glasses of water daily",
            "Limit processed foods and sugary drinks",
            "Include lean proteins and whole grains in your diet",
            "Practice portion control and mindful eating"
          ]
        },
        {
          subtitle: "Sleep Hygiene",
          content: [
            "Maintain a consistent sleep schedule",
            "Create a relaxing bedtime routine",
            "Keep your bedroom dark, quiet, and cool",
            "Avoid screens 1 hour before bedtime",
            "Limit caffeine and alcohol intake"
          ]
        },
        {
          subtitle: "Preventive Care",
          content: [
            "Get regular check-ups and screenings",
            "Stay up to date with vaccinations",
            "Practice good hygiene habits",
            "Exercise regularly",
            "Manage stress effectively"
          ]
        }
      ]
    },
    medicalArticles: {
      title: "Medical Articles",
      icon: "fas fa-book-medical",
      sections: [
        {
          subtitle: "Heart Health",
          content: [
            "Understanding heart disease risk factors",
            "Signs and symptoms of heart problems",
            "Preventive measures for heart health",
            "Heart-healthy diet recommendations",
            "Exercise guidelines for heart health"
          ]
        },
        {
          subtitle: "Diabetes Management",
          content: [
            "Types of diabetes and their differences",
            "Blood sugar monitoring and control",
            "Dietary recommendations for diabetics",
            "Exercise guidelines for diabetics",
            "Complications prevention strategies"
          ]
        },
        {
          subtitle: "Blood Pressure",
          content: [
            "Understanding blood pressure readings",
            "Causes of high blood pressure",
            "Lifestyle modifications for control",
            "Medication management",
            "Regular monitoring importance"
          ]
        }
      ]
    },
    wellnessGuide: {
      title: "Wellness Guide",
      icon: "fas fa-heartbeat",
      sections: [
        {
          subtitle: "Physical Wellness",
          content: [
            "Regular exercise routines",
            "Balanced nutrition plans",
            "Adequate sleep patterns",
            "Stress management techniques",
            "Preventive healthcare practices"
          ]
        },
        {
          subtitle: "Mental Wellness",
          content: [
            "Stress reduction strategies",
            "Mindfulness and meditation",
            "Social connection importance",
            "Self-care practices",
            "Professional support options"
          ]
        },
        {
          subtitle: "Healthy Lifestyle",
          content: [
            "Work-life balance tips",
            "Healthy habit formation",
            "Time management skills",
            "Social support networks",
            "Personal development goals"
          ]
        }
      ]
    },
    mentalHealth: {
      title: "Mental Health",
      icon: "fas fa-brain",
      sections: [
        {
          subtitle: "Stress Management",
          content: [
            "Identifying stress triggers",
            "Deep breathing techniques",
            "Meditation practices",
            "Time management strategies",
            "Relaxation exercises"
          ]
        },
        {
          subtitle: "Emotional Health",
          content: [
            "Understanding emotions",
            "Effective communication",
            "Building healthy relationships",
            "Self-esteem development",
            "Emotional regulation techniques"
          ]
        },
        {
          subtitle: "Self-Care",
          content: [
            "Daily relaxation practices",
            "Physical activity benefits",
            "Sleep hygiene importance",
            "Nutrition for mental health",
            "Hobby and leisure activities"
          ]
        }
      ]
    },
    fitnessTips: {
      title: "Fitness Tips",
      icon: "fas fa-dumbbell",
      sections: [
        {
          subtitle: "Cardio Exercises",
          content: [
            "Walking and jogging routines",
            "Cycling benefits and techniques",
            "Swimming workouts",
            "HIIT training basics",
            "Endurance building exercises"
          ]
        },
        {
          subtitle: "Strength Training",
          content: [
            "Basic push-up variations",
            "Core strengthening exercises",
            "Leg workout routines",
            "Back strengthening exercises",
            "Proper form and technique"
          ]
        },
        {
          subtitle: "Flexibility & Balance",
          content: [
            "Stretching routines",
            "Yoga basics and benefits",
            "Balance exercises",
            "Deep breathing techniques",
            "Mind-body connection"
          ]
        }
      ]
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4">Comprehensive Health Information</h1>
        <p className="lead">Your complete guide to health and wellness</p>
      </div>

      {Object.entries(healthInfo).map(([key, section]) => (
        <div key={key} className="mb-5">
          <h2 className="mb-4">
            <i className={`${section.icon} me-2`}></i>
            {section.title}
          </h2>
          <div className="row">
            {section.sections.map((subSection, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title h5">{subSection.subtitle}</h3>
                    <ul className="list-group list-group-flush">
                      {subSection.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="list-group-item">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-4">
        <Link to="/home" className="btn btn-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default HealthInfo; 