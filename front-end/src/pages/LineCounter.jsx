import React, { useState, useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const LineCounter = () => {
  const canvasRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [countData, setCountData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [outputFilename, setOutputFilename] = useState(null);
  const [confidence, setConfidence] = useState(0.3);
  const [lineCoordinates, setLineCoordinates] = useState([[20, 400], [1080, 400]]);
  const [midFrame, setMidFrame] = useState(null);
  const [currentCoordinateIndex, setCurrentCoordinateIndex] = useState(null);

  useEffect(() => {
    if (midFrame) {
      setLineCoordinates([[20, 400], [1080, 400]]);
    }
  }, [midFrame]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    const midFrame = await extractMidFrame(file);
    setMidFrame(midFrame);
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
    formData.append('lineCoordinates', JSON.stringify(lineCoordinates));

    try {
      const response = await fetch('http://127.0.0.1:5000/count_line', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setCountData(data.count_data);
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

  const handleLineCoordinateChange = (event, index, axis) => {
    const newCoordinates = [...lineCoordinates];
    newCoordinates[index][axis] = parseInt(event.target.value, 10);
    setLineCoordinates(newCoordinates);
  };

  const extractMidFrame = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const video = document.createElement('video');
        video.addEventListener('loadedmetadata', () => {
          const midTime = video.duration / 2;
          video.currentTime = midTime;
          video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const midFrame = canvas.toDataURL('image/jpeg');
            resolve(midFrame);
          });
        });
        video.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFixCoordinate1 = () => {
    setCurrentCoordinateIndex(0);
  };

  const handleFixCoordinate2 = () => {
    setCurrentCoordinateIndex(1);
  };

  const handleClearCoordinates = () => {
    setLineCoordinates([[20, 400], [1080, 400]]);
    setCurrentCoordinateIndex(null);
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    if (currentCoordinateIndex === 0) {
      setLineCoordinates([[x, y], lineCoordinates[1]]);
      setCurrentCoordinateIndex(null);
    } else if (currentCoordinateIndex === 1) {
      setLineCoordinates([lineCoordinates[0], [x, y]]);
      setCurrentCoordinateIndex(null);
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
          YOLOv8 Line Counter Method
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
            <label className="block text-gray-700 font-bold mb-2">Set Line Coordinates</label>
            <div className="mb-4">
            <div className="flex flex-col md:flex-row items-center mb-2">
              <div className="flex items-center mr-4 mb-2 md:mb-0">
                <label htmlFor="lineCoordinate1X" className="mr-2">X1:</label>
                <input
                  id="lineCoordinate1X"
                  type="number"
                  value={lineCoordinates[0][0]}
                  onChange={(event) => handleLineCoordinateChange(event, 0, 0)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center mr-4 mb-2 md:mb-0">
                <label htmlFor="lineCoordinate1Y" className="mr-2">Y1:</label>
                <input
                  id="lineCoordinate1Y"
                  type="number"
                  value={lineCoordinates[0][1]}
                  onChange={(event) => handleLineCoordinateChange(event, 0, 1)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center mr-4 mb-2 md:mb-0">
                <label htmlFor="lineCoordinate2X" className="mr-2">X2:</label>
                <input
                  id="lineCoordinate2X"
                  type="number"
                  value={lineCoordinates[1][0]}
                  onChange={(event) => handleLineCoordinateChange(event, 1, 0)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center mb-2 md:mb-0">
                <label htmlFor="lineCoordinate2Y" className="mr-2">Y2:</label>
                <input
                  id="lineCoordinate2Y"
                  type="number"
                  value={lineCoordinates[1][1]}
                  onChange={(event) => handleLineCoordinateChange(event, 1, 1)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            </div>
            <div className="flex justify-center mb-4 gap-5">
              <button
                onClick={handleFixCoordinate1}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Select Point 1
              </button>
              <button
                onClick={handleFixCoordinate2}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Select Point 2
              </button>
              <button
                onClick={handleClearCoordinates}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Clear Points
              </button>
            </div>
            {midFrame && (
              <div className="relative">
                <img src={midFrame} alt="Mid Frame" className="w-full" />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <canvas
                    ref={canvasRef}
                    width={1080}
                    height={720}
                    onClick={handleCanvasClick}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'crosshair',
                    }}
                  />
                  <svg
                    className="stroke-current text-red-500"
                    viewBox={`0 0 ${1080} ${720}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1={(lineCoordinates[0][0] / 1080) * 100 + '%'}
                      y1={(lineCoordinates[0][1] / 720) * 100 + '%'}
                      x2={(lineCoordinates[1][0] / 1080) * 100 + '%'}
                      y2={(lineCoordinates[1][1] / 720) * 100 + '%'}
                      strokeWidth={6}
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Select Classes to Detect & Count</label>
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
                      <td className="border px-4 py-2">{count.out}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <Bar data={getChartData()} options={options} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineCounter;
