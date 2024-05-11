import Navbar from "./components/Navbar"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Heatmap from './pages/Heatmap'
import MultiVideo from './pages/MultiVideo'
import LineCounter from "./pages/LineCounter"
import PolygonCounter from "./pages/PolygonCounter"
import Parking from "./pages/Parking"

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/linecounter" element={<LineCounter/>} />
          <Route path="/polygoncounter" element={<PolygonCounter/>} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/multi-video" element={<MultiVideo />} />
          <Route path="/parking" element={<Parking />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
