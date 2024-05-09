import React, { useState } from 'react';

const Home = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [countData, setCountData] = useState(null);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert('Please select a video file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setCountData(data.count_data);
      } else {
        console.error('Error uploading video:', response.status);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Vehicle Detection and Tracking using YOLOv8
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Upload Video
              </button>
            </div>
          )}
          {countData && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Count</h2>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Vehicle Type</th>
                    <th className="px-4 py-2">In</th>
                    <th className="px-4 py-2">Out</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(countData).map(([vehicleType, count]) => (
                    <tr key={vehicleType}>
                      <td className="border px-4 py-2">{vehicleType}</td>
                      <td className="border px-4 py-2">{count.in}</td>
                      <td className="border px-4 py -2">{count.out}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;