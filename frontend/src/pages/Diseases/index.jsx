import { useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Footer from "../../components/Footer";
import "./style.css";

const diseases = {
  pneumonia: {
    title: "Pneumonia",
    description: "Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, and difficulty breathing.",
    symptoms: [
      "Chest pain when breathing or coughing",
      "Confusion or changes in mental awareness",
      "Cough, which may produce phlegm",
      "Fatigue",
      "Fever, sweating and shaking chills",
      "Lower than normal body temperature",
      "Nausea, vomiting or diarrhea",
      "Shortness of breath"
    ],
    treatment: "Treatment depends on the type and severity of pneumonia. Bacterial pneumonia is treated with antibiotics, while viral pneumonia may require antiviral medications. Rest and plenty of fluids are important for recovery."
  },
  "lung-opacity": {
    title: "Lung Opacity",
    description: "Lung opacity refers to areas in the lungs that appear more dense or cloudy on X-ray images. This can indicate various conditions including infection, inflammation, or fluid accumulation.",
    symptoms: [
      "Cough",
      "Shortness of breath",
      "Chest pain",
      "Fever",
      "Fatigue"
    ],
    treatment: "Treatment depends on the underlying cause. It may include antibiotics for infections, anti-inflammatory medications, or other specific treatments based on the diagnosis."
  },
  pneumothorax: {
    title: "Pneumothorax (Collapsed Lung)",
    description: "A pneumothorax occurs when air leaks into the space between your lung and chest wall. This air pushes on the outside of your lung and makes it collapse.",
    symptoms: [
      "Sudden chest pain",
      "Shortness of breath",
      "Rapid breathing",
      "Cough",
      "Fatigue",
      "Cyanosis (bluish color of the skin)"
    ],
    treatment: "Treatment may include observation for small pneumothorax, needle aspiration, or chest tube insertion for larger cases. Surgery may be needed for recurrent cases."
  },
  "pleural-effusion": {
    title: "Pleural Effusion (Fluid Around the Lungs)",
    description: "Pleural effusion is a buildup of fluid between the layers of tissue that line the lungs and chest cavity. This can cause breathing difficulties and chest pain.",
    symptoms: [
      "Chest pain",
      "Dry cough",
      "Fever",
      "Shortness of breath",
      "Difficulty breathing when lying down",
      "Hiccups",
      "Rapid breathing"
    ],
    treatment: "Treatment focuses on removing the fluid and addressing the underlying cause. This may include diuretics, thoracentesis (fluid drainage), or treatment of the underlying condition."
  }
};

export default function DiseaseDetails() {
  const { diseaseId } = useParams();
  const disease = diseases[diseaseId];

  if (!disease) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Disease information not found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-4">
                <h1 className="text-center mb-4 fw-bold slide-in">{disease.title}</h1>
                
                <div className="mb-4 fade-in">
                  <h3 className="h5 mb-3">Description</h3>
                  <p className="text-muted">{disease.description}</p>
                </div>

                <div className="mb-4 fade-in">
                  <h3 className="h5 mb-3">Common Symptoms</h3>
                  <ul className="list-group list-group-flush">
                    {disease.symptoms.map((symptom, index) => (
                      <li key={index} className="list-group-item bg-transparent">
                        <i className="fas fa-check-circle text-primary me-2"></i>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="fade-in">
                  <h3 className="h5 mb-3">Treatment</h3>
                  <p className="text-muted">{disease.treatment}</p>
                </div>

                <div className="text-center mt-4">
                  <HashLink to="/home#About" smooth className="btn btn-primary">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Home
                  </HashLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 