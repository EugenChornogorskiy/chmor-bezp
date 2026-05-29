import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import List from './pages/List';    
import Stats from "./pages/Stats"; 
import Callback from "./pages/Callback"; 
import './App.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/stats/:id" element={<Stats />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;