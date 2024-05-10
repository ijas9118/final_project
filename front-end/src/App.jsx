import Navbar from "./components/Navbar"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Heatmap from './pages/Heatmap'
import MultiVideo from './pages/MultiVideo'
import About from './pages/About'
import LineCounter from "./pages/LineCounter"
import PolygonCounter from "./pages/PolygonCounter"

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
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
