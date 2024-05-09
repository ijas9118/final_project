import Navbar from "./components/Navbar"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "./pages/Home"
import Heatmap from './pages/Heatmap'
import MultiVideo from './pages/MultiVideo'
import About from './pages/About'

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/multi-video" element={<MultiVideo />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
