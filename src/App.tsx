import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { CreateMap } from "./pages/CreateMap";
import { Home } from "./pages/Home";
import { MapView } from "./pages/MapView";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateMap />} />
        <Route path="/map/:mapId" element={<MapView />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <Toaster />
    </Router>
  );
}
