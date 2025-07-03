import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForumPage from "./pages/ForumPage";

function App() {
  return (
    <Router>
      {/* Halaman Utama */}
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={<ForumPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
