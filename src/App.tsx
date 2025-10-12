import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/protected/Dashboard";
import FileShare from "./components/protected/FileShare";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import View from "./components/View";

function App() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            }/>
            <Route path="/share" element={<ProtectedRoute><FileShare /></ProtectedRoute>} />
            <Route path="/view/:id" element={<View />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )
}

export default App;