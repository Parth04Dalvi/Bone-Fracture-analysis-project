AI-Driven Fracture Detector & Radiologist Assistant
🩺 Computer Vision (CV) Project for Medical Diagnostics
This project simulates a high-impact application of Machine Learning in the healthcare sector. It demonstrates the full pipeline of a Computer Vision service: from image upload and inference execution to structured data output and diagnostic visualization.

✨ Key Features & Technical Highlights
Feature

Technical Skill Demonstrated

CV Visualization Overlay

Uses React state and computed coordinates to dynamically draw a Bounding Box on the X-ray image, localizing the simulated fracture.

Python ML Simulation

The fracture_analyzer.py file demonstrates the necessary backend architecture to handle image input, run ML inference, and return a standardized JSON diagnostic report.

Structured Diagnostic Output

Processes and displays the ML model's output, including Confidence Score, Fracture Type, and a Clinical Recommendation.

Modern React UI

Utilizes functional components and Tailwind CSS to create a clean, professional, and dark-themed interface suitable for medical/technical tooling.

Stateful Analysis Workflow

Manages loading, error, and report states to simulate a robust, real-world asynchronous API call for analysis.

🛠️ Technology Stack
Frontend: React (for UI components and state management), Tailwind CSS (for modern aesthetics).

Visualization: HTML Image and CSS Overlays (simulating CV bounding box rendering).

Backend Logic (Simulated): Python (demonstrating the structure of an ML inference service).

Data Format: JSON (for structured data transmission between layers).

🚀 How to Run the Simulator
Open the Application: Load the index.jsx file in a React environment.

Upload an Image: Click the upload zone and select any image (simulating an X-ray).

Run Analysis: Click the "Run Diagnostic Analysis" button.

View Results: After a short simulated delay, the ML Diagnostic Report will appear.

If a fracture is detected (60% chance), a red bounding box will appear on the X-ray image.

The report will display the Confidence Score and Fracture Type.

The fracture_analyzer.py file serves as a reference for the server-side logic required to generate the structured data consumed by the React front-end.
