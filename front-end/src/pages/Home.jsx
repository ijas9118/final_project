import React from 'react';
import { Link } from 'react-router-dom';

// Import images for each section
import lineCounterImage from '../assets/line-counter.png';
import polygonCounterImage from '../assets/polygon-counter.png';
import heatmapImage from '../assets/heatmap.png';
import multiVideoTrackingImage from '../assets/multi-video-tracking.png';
import parkingSafetyImage from '../assets/parking-safety.png';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
        Introducing TrafficVision: Your Ultimate Traffic Solution
      </h1>
      <div className="flex flex-col space-y-8">
        
        {/* Inserted Content */}
        <div className="text-lg text-gray-800 text-justify my-12 mx-auto w-full md:w-3/4 lg:w-1/2">
          <p className="mb-6 leading-relaxed">
            TrafficVision offers a simple yet powerful way to monitor traffic and ensure parking safety. With easy-to-use features, our system seamlessly connects live highway cameras, providing you with a clear picture of traffic conditions in real-time. Leveraging advanced technology like YOLOv8, TrafficVision identifies, tracks, and measures the speed of vehicles, enabling you to understand traffic flow effortlessly.
          </p>
          <p className="mb-6 leading-relaxed">
            But that's not all. TrafficVision also generates heatmaps that illustrate where traffic is busiest, allowing you to plan for the future and prevent congestion. With our dedicated parking safety module, you can ensure vehicles are parked safely and in compliance with regulations. TrafficVision puts the power of traffic management and safety in your hands, making roads safer and journeys smoother for everyone.
          </p>
          <p className="mb-6">
            Explore the following features to discover how TrafficVision can enhance your traffic management and safety workflows:
          </p>
        </div>

        {/* End Inserted Content */}
      </div>
      <div className="flex flex-col space-y-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-3/4 lg:w-1/2 mx-auto">
          <img src={lineCounterImage} alt="Line Counter" className="w-full h-80 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Line Counter Method</h2>
            <p className="text-gray-700 mb-4">Count vehicles by drawing a line on the frame using OpenCV.</p>
            <Link to="/linecounter">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go to Line Counter
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-3/4 lg:w-1/2 mx-auto">
          <img src={polygonCounterImage} alt="Polygon Counter" className="w-full h-80 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Polygon Counter Method</h2>
            <p className="text-gray-700 mb-4">Count vehicles using a region of interest (ROI).</p>
            <Link to="/polygoncounter">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go to Polygon Counter
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-3/4 lg:w-1/2 mx-auto">
          <img src={heatmapImage} alt="Heatmap" className="w-full h-80 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Heatmap</h2>
            <p className="text-gray-700 mb-4">Generate heatmaps for selected classes on the frames.</p>
            <Link to="/heatmap">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go to Heatmap
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-3/4 lg:w-1/2 mx-auto">
          <img src={multiVideoTrackingImage} alt="Multi-Video Tracking" className="w-full h-80 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Multi-Video Tracking</h2>
            <p className="text-gray-700 mb-4">Track multiple videos simultaneously using threading.</p>
            <Link to="/multi-video">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go to Multi-Video Tracking
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-3/4 lg:w-1/2 mx-auto">
          <img src={parkingSafetyImage} alt="Parking Safety" className="w-full h-80 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Parking Safety</h2>
            <p className="text-gray-700 mb-4">Check if a vehicle is completely parked in the parking spot.</p>
            <Link to="/parking">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go to Parking Safety
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;