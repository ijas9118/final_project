import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const MultiVideo = () => {
  const [videoFile1, setVideoFile1] = useState(null);
  const [videoFile2, setVideoFile2] = useState(null);
  const [countData1, setCountData1] = useState(null);
  const [countData2, setCountData2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confidence1, setConfidence1] = useState(0.3);
  const [confidence2, setConfidence2] = useState(0.3);

  const handleFileChange1 = (event) => {
    setVideoFile1(event.target.files[0]);
  };

  const handleFileChange2 = (event) => {
    setVideoFile2(event.target.files[0]);
  };

  const handleConfidenceChange1 = (event, newValue) => {
    setConfidence1(newValue);
  };

  const handleConfidenceChange2 = (event, newValue) => {
    setConfidence2(newValue);
  };

  const handleUpload = async () => {
    if (!videoFile1 && !videoFile2) {
      alert('Please select at least one video file.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    if (videoFile1) {
      formData.append('file1', videoFile1);
      formData.append('confidence1', confidence1);
    }

    if (videoFile2) {
      formData.append('file2', videoFile2);
      formData.append('confidence2', confidence2);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/multivideo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setCountData1(data.count_data1);
        setCountData2(data.count_data2);
      } else {
        console.error('Error uploading videos:', response.status);
      }
    } catch (error) {
      console.error('Error uploading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getChartData = () => {
    const labels = Object.keys(countData);
    const inCounts = labels.map((label) => countData[label].in);
    const outCounts = labels.map((label) => countData[label].out);

    return {
      labels,
      datasets: [
        {
          label: 'In',
          data: inCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Out',
          data: outCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Vehicle Type',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          YOLOv8 Multi-Video Tracking
        </h1>
        <div className="flex flex-col md:flex-row">
          {/* Video 1 */}
          <div className="max-w-md mx-auto mb-8 md:mb-0 md:mr-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Video 1</h2>
            <div className="mb-6">
              <label htmlFor="videoFile1" className="block text-gray-700 font-bold mb-2">
                Select Video File
              </label>
              <input
                id="videoFile1"
                type="file"
                accept="video/*"
                onChange={handleFileChange1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <Typography id="confidence-slider1">
                Confidence Threshold: {confidence1}
              </Typography>
              <Slider
                value={confidence1}
                onChange={handleConfidenceChange1}
                step={0.1}
                min={0.0}
                max={1.0}
                valueLabelDisplay="auto"
                aria-labelledby="confidence-slider1"
                className="w-full"
              />
            </div>
            {videoFile1 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Video Preview</h3>
                <div className="video-container mb-8">
                  <video controls className="w-full rounded-md shadow-md">
                    <source src={URL.createObjectURL(videoFile1)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>
    
          {/* Video 2 */}
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Video 2</h2>
            <div className="mb-6">
              <label htmlFor="videoFile2" className="block text-gray-700 font-bold mb-2">
                Select Video File
              </label>
              <input
                id="videoFile2"
                type="file"
                accept="video/*"
                onChange={handleFileChange2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <Typography id="confidence-slider2">
                Confidence Threshold: {confidence2}
              </Typography>
              <Slider
                value={confidence2}
                onChange={handleConfidenceChange2}
                step={0.1}
                min={0.0}
                max={1.0}
                valueLabelDisplay="auto"
                aria-labelledby="confidence-slider2"
                className="w-full"
              />
            </div>
            {videoFile2 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Video Preview</h3>
                <div className="video-container mb-8">
                  <video controls className="w-full rounded-md shadow-md">
                    <source src={URL.createObjectURL(videoFile2)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>
        </div>
    
        <div className="mt-8 flex justify-center">
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
              'Upload Videos'
            )}
          </button>
        </div>
    
        {(countData1 || countData2) && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Count</h2>
            {countData1 && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Video 1</h3>
                <table className="w-full table-auto mb-8">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Vehicle Type</th>
                      <th className="px-4 py-2">In</th>
                      <th className="px-4 py-2">Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(countData1).map(([vehicleType, count]) => (
                      <tr key={vehicleType}>
                        <td className="border px-4 py-2">{vehicleType}</td>
                        <td className="border px-4 py-2">{count.in}</td>
                        <td className="border px-4 py-2">{count.out}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {countData2 && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Video 2</h3>
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Vehicle Type</th>
                      <th className="px-4 py-2">In</th>
                      <th className="px-4 py-2">Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(countData2).map(([vehicleType, count]) => (
                      <tr key={vehicleType}>
                        <td className="border px-4 py-2">{vehicleType}</td>
                        <td className="border px-4 py-2">{count.in}</td>
                        <td className="border px-4 py-2">{count.out}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {(countData1 || countData2) && (
              <div className="mt-8">
                <div className="relative top-0 right-0 p-2 bg-white rounded shadow-md w-fit flex gap-5 m-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-customGreen mr-2"></div>
                    <span>In</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-4 h-4 rounded-full bg-customRed mr-2"></div>
                    <span>Out</span>
                  </div>
                </div>
                {countData1 && (
                  <>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Video 1 Chart</h3>
                    <Bar data={getChartData(countData1)} options={options} />
                  </>
                )}
                {countData2 && (
                  <>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Video 2 Chart</h3>
                    <Bar data={getChartData(countData2)} options={options} />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiVideo;

