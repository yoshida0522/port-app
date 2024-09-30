import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LineLogin from "./app/LineLogin/page";
import CreatePage from "./app/create/page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/line-login" element={<LineLogin />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
