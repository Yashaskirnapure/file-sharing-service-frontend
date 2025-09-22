import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/protected/Dashboard";
import FileList from "./components/protected/FileList";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/protected/ProtectedRoute";

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
            <Route path="/list" element={
              <ProtectedRoute><FileList /></ProtectedRoute>
            }/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )
}

export default App;