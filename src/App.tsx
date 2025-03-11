import { Routes, Route } from "react-router-dom";
import { UserProvider } from "@/components/auth/UserContext";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import PaymentSuccess from "./pages/PaymentSuccess";
import { Toaster } from "./components/ui/toaster";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
        <Toaster />
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
