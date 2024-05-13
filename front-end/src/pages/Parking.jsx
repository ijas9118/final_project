import React, { useState } from 'react';

const Heatmap = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outputFilename, setOutputFilename] = useState(null);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert('Please select a video file first.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/parking', {
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

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Parking Safety Check Using YOLOv8
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
