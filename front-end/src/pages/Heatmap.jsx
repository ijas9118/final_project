import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

const Heatmap = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [outputFilename, setOutputFilename] = useState(null);
  const [confidence, setConfidence] = useState(0.3);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleClassToggle = (classId) => {
    const index = selectedClasses.indexOf(classId);
    if (index === -1) {
      setSelectedClasses([...selectedClasses, classId]);
    } else {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert('Please select a video file first.');
      return;
    }

    if (selectedClasses.length === 0) {
      alert('Please select at least one class to detect.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('selectedClasses', JSON.stringify(selectedClasses)); // Sending selected classes to backend
    formData.append('confidence', confidence);

    try {
      const response = await fetch('http://127.0.0.1:5000/heatmap', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setOutputFilename(data.output_filename);
      } else {
        console.error('Error uploading video:', response.status);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfidenceChange = (event, newValue) => {
    setConfidence(newValue);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          YOLOv8 Heat-Map Generation
        </h1>
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <label htmlFor="videoFile" className="block text-gray-700 font-bold mb-2">
              Select Video File
            </label>
            <input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Select Classes to Detect</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="car"
                value="0"
                checked={selectedClasses.includes('0')}
                onChange={() => handleClassToggle('0')}
                className="mr-2"
              />
              <label htmlFor="car" className="mr-6">Car</label>
              <input
                type="checkbox"
                id="bus"
                value="1"
                checked={selectedClasses.includes('1')}
                onChange={() => handleClassToggle('1')}
                className="mr-2"
              />
              <label htmlFor="bus" className="mr-6">Bus</label>
              <input
                type="checkbox"
                id="truck"
                value="2"
                checked={selectedClasses.includes('2')}
                onChange={() => handleClassToggle('2')}
                className="mr-2"
              />
              <label htmlFor="truck" className="mr-6">Truck</label>
              <input
                type="checkbox"
                id="ambulance"
                value="3"
                checked={selectedClasses.includes('3')}
                onChange={() => handleClassToggle('3')}
              />
              <label htmlFor="ambulance">Ambulance</label>
            </div>
          </div>
          <div className="mb-6">
            <Typography id="confidence-slider">
              Confidence Threshold: {confidence}
            </Typography>
            <Slider
              value={confidence}
              onChange={handleConfidenceChange}
              step={0.1}
              min={0.0}
              max={1.0}
              valueLabelDisplay="auto"
              aria-labelledby="confidence-slider"
              className="w-full"
            />
          </div>
          {videoFile && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Video Preview</h2>
              <div className="video-container mb-8">
                <video controls className="w-full rounded-md shadow-md">
                  <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  'Upload Video'
                )}
              </button>
            </div>
          )}
          {/* Output video section */}
          {outputFilename && (
            <div className="max-w-md mx-auto mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Output Video</h2>
              <div className="video-container mb-8">
                <video controls className="w-full rounded-md shadow-md">
                  <source
                    src={`http://localhost:5000/output_videos/${outputFilename}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
