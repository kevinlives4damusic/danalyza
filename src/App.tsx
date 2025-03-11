import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import PaymentSuccess from "./pages/PaymentSuccess";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
