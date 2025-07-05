import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForumPage from "./pages/ForumPage";
import DetailForum from "./pages/DetailForum"; // Pastikan sudah dibuat
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Main content: fleksibel tinggi halaman */}
        <main className="flex-fill">
          <Routes>
            <Route path="/" element={<ForumPage />} />
            <Route path="/forum/:id" element={<DetailForum />} />
          </Routes>
        </main>

        {/* Footer akan selalu di bawah */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
