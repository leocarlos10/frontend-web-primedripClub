import { Route, Routes } from "react-router";
import Homepage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
}

export default App;
