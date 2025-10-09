import React, { useState, useCallback } from 'react';
import { CloudUpload, X, CheckCircle, AlertTriangle, Thermometer, MapPin } from 'lucide-react';

// --- Interface Definitions for Structured Response ---

/**
 * @typedef {Object} BoundingBox
 * @property {number} x - Normalized x coordinate (0-1000).
 * @property {number} y - Normalized y coordinate (0-1000).
 * @property {number} width - Normalized width (0-1000).
 * @property {number} height - Normalized height (0-1000).
 */

/**
 * @typedef {Object} DiagnosticReport
 * @property {'Fracture Detected' | 'No Fracture Detected'} status
 * @property {number} confidence
 * @property {string} fractureType
 * @property {string} recommendation
 * @property {BoundingBox | null} boundingBox
 */

const App = () => {
    // --- State Management ---
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Constants ---
    const canvasWidth = 800;
    const canvasHeight = 600;

    // --- Utility Functions ---

    /** Simulates the API call to the Python backend. */
    const simulateApiCall = useCallback(async (fileName) => {
        // Mock data generation based on the Python script's logic
        const has_fracture = Math.random() < 0.6; // 60% chance of fracture
        
        let mockReport = {};
        if (has_fracture) {
            const x_min = Math.floor(Math.random() * 400) + 200;
            const y_min = Math.floor(Math.random() * 300) + 250;
            const width = Math.floor(Math.random() * 300) + 150;
            const height = Math.floor(Math.random() * 200) + 100;
            
            mockReport = {
                status: "Fracture Detected",
                confidence: Math.round(Math.random() * 100) / 100 * 0.14 + 0.85, // 0.85 to 0.99
                fractureType: ["Transverse", "Oblique", "Spiral", "Comminuted", "Greenstick"][Math.floor(Math.random() * 5)],
                recommendation: "Consult Orthopedic Surgeon immediately. Immobilize the limb.",
                boundingBox: {
                    x: x_min,
                    y: y_min,
                    width: width,
                    height: height
                }
            };
        } else {
            mockReport = {
                status: "No Fracture Detected",
                confidence: Math.round(Math.random() * 100) / 100 * 0.04 + 0.95, // 0.95 to 0.99
                fractureType: "N/A",
                recommendation: "Monitor patient symptoms. Consider follow-up imaging.",
                boundingBox: null
            };
        }
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return mockReport;

    }, []);

    // --- Handlers ---

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setReport(null);
            setError(null);
        } else {
            alert('Please upload a valid image file (X-ray mock).');
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const runAnalysis = async () => {
        if (!file) return setError('Please upload an X-ray image first.');

        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            /** @type {DiagnosticReport} */
            const result = await simulateApiCall(file.name);
            setReport(result);
        } catch (err) {
            setError('Analysis failed: Could not connect to the ML service.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Visualization Component ---

    const BoundingBoxOverlay = ({ report, imgWidth, imgHeight }) => {
        if (!report || !report.boundingBox || report.status !== 'Fracture Detected') return null;

        const { x, y, width, height } = report.boundingBox;

        // Scale normalized coordinates (0-1000) to actual image dimensions
        const scaleX = imgWidth / 1000;
        const scaleY = imgHeight / 1000;

        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        return (
            <div
                style={{
                    position: 'absolute',
                    left: `${scaledX}px`,
                    top: `${scaledY}px`,
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    border: '3px solid #ef4444', // Red border for fracture
                    backgroundColor: 'rgba(239, 68, 68, 0.2)', // Semi-transparent red fill
                    borderRadius: '4px',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                    pointerEvents: 'none', // Allow clicks to pass through
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                }}
                title={`Fracture Type: ${report.fractureType}`}
            />
        );
    };
    
    // --- Main Component Render ---
    
    const statusIcon = report?.status === 'Fracture Detected' ? 
        <X className="w-6 h-6 text-red-500 mr-2" /> :
        <CheckCircle className="w-6 h-6 text-green-500 mr-2" />;

    const statusColor = report?.status === 'Fracture Detected' ? 
        'bg-red-50 border-red-300 text-red-800' : 
        'bg-green-50 border-green-300 text-green-800';

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
            <style>{`
                /* Tailwind config assumed: font-family: 'Inter' */
                .spinner {
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-white flex items-center justify-center">
                    <Thermometer className="w-8 h-8 text-blue-400 mr-3" />
                    AI Fracture Detector
                </h1>
                <p className="text-gray-400 mt-1">Simulated Computer Vision Analysis for Orthopedic Diagnostics.</p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Left Panel: Image Upload & Controls (Col 1) --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">1. Upload X-Ray Image</h2>
                        
                        <div 
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-200 ${
                                file ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-blue-400 bg-gray-700/50'
                            }`}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <CloudUpload className="w-8 h-8 mx-auto text-blue-400" />
                            <p className="mt-2 text-sm text-gray-400">
                                {file ? file.name : 'Click to select image'}
                            </p>
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        
                        <button
                            onClick={runAnalysis}
                            disabled={!file || isLoading}
                            className="w-full mt-4 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md disabled:opacity-50 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner mr-3"></div>
                                    Analyzing...
                                </>
                            ) : 'Run Diagnostic Analysis'}
                        </button>

                        {error && (
                            <div className="mt-4 p-3 bg-red-800 rounded-lg text-sm text-white flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Center Panel: Image Viewer with Overlay (Col 2) --- */}
                <div className="lg:col-span-2 relative bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center border border-gray-700 p-2">
                    <div 
                        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
                        className="relative max-w-full max-h-full bg-black flex items-center justify-center"
                    >
                        {previewUrl ? (
                            <>
                                <img
                                    src={previewUrl}
                                    alt="Uploaded X-Ray"
                                    className="object-contain w-full h-full"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                                <BoundingBoxOverlay report={report} imgWidth={canvasWidth} imgHeight={canvasHeight} />
                            </>
                        ) : (
                            <p className="text-gray-500 text-lg">Upload an image to view X-Ray</p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Diagnostic Report Section (Below the main grid) --- */}
            {report && (
                <div className="max-w-6xl mx-auto mt-8 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <MapPin className="w-6 h-6 text-yellow-400 mr-2" />
                        ML Diagnostic Report
                    </h2>
                    
                    <div className={`p-4 rounded-lg border-2 mb-6 flex items-center ${statusColor}`}>
                        {statusIcon}
                        <span className="text-xl font-bold">{report.status}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                        
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-400">Confidence Score</p>
                            <p className="text-2xl font-bold mt-1 text-blue-400">
                                {(report.confidence * 100).toFixed(1)}%
                            </p>
                        </div>
                        
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-400">Fracture Type</p>
                            <p className="text-2xl font-bold mt-1">
                                {report.fractureType}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-700 rounded-lg md:col-span-3">
                            <p className="text-sm text-gray-400">Recommendation</p>
                            <p className="text-lg mt-1 text-yellow-300">
                                {report.recommendation}
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
