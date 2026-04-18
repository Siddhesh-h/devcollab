import {Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ProjectBoard from "./pages/ProjectBoard"

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/project/:id" element={<ProjectBoard/>}/>
    </Routes>
  )
}

export default App
