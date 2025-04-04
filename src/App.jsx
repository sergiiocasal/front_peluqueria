import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import Register from "./pages/Register";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/listar" element={<AdminPanel />}></Route>
        <Route path="/regis" element={<Register />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
