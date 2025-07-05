import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForumPage from "./pages/ForumPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Gunakan container dengan flex-grow */}
        <main className="flex-fill">
          <Routes>
            <Route path="/" element={<ForumPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
