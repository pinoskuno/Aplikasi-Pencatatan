import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CatatanList from "./components/CatatanList";
import AddCatatan from "./components/AddCatatan";
import TotalSummary from './components/TotalSummary';
import AddPersediaan from "./components/AddPersediaan";
import CatatanPersediaan from "./components/CatatanPersediaan";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/CatatanList.css";

function App() {
  return (
    <div className="container">
      <h1 className="text-center my-4">Aplikasi Pencatatan</h1>

      {/* Tombol Navigasi */}
      <div className="mb-4">
        <Link to="/" className="btn btn-primary me-2">Dashboard</Link>
        <Link to="/persediaan" className="btn btn-primary m-2">Catatan Stock Persediaan</Link>
        <Link to="/input" className="btn btn-success">Input Data</Link>
        <Link to="/inputPersediaan" className="btn btn-success m-2">Input Stock Persediaan</Link>
        
      </div>

      {/* Definisi Routes */}
      <Routes>
        <Route path="/" element={
          <>
            <TotalSummary />
            <CatatanList />
          </>
        } />
        <Route path="/input" element={<AddCatatan />} />
        <Route path="/inputPersediaan" element={<AddPersediaan />} />
        <Route path="/persediaan" element={<CatatanPersediaan />} />
      </Routes>
    </div>
  );
}

export default App;
