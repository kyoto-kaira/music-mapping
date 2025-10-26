import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { CreateMap } from "./pages/CreateMap";
import { Home } from "./pages/Home";
import { MapView } from "./pages/MapView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateMap />} />
        <Route path="/map/:mapId" element={<MapView />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
