import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";
import CatatanList from "./components/CatatanList";
import AddCatatan from "./components/AddCatatan";
import TotalSummary from './components/TotalSummary';

import CatatanPersediaan from "./components/CatatanPersediaan";
import TotalPersediaan from "./components/dummy";
import AddPersediaanCluster from "./components/AddPersediaanTanpafiturkategori";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/CatatanList.css";
import "./styles/Coba.css";
import "./index.css";


function App() {
  return (
    <div className="container">

      {/* Tombol Navigasi */}
      {/* <div className="mb-4">
        <Link to="/" className="btn btn-primary me-2">Dashboard</Link>
        <Link to="/persediaan" className="btn btn-primary m-2">Catatan Stock Persediaan</Link>
        <Link to="/input" className="btn btn-success">Input Data</Link>
        <Link to="/inputPersediaan" className="btn btn-success m-2">Input Stock Persediaan</Link>
        
      </div> */}

      {/* Definisi Routes */}
      <Routes>
        <Route path="/" element={
          <>
            <TotalSummary />
            <CatatanList />
          </>
        } />
        <Route path="/AddPersediaanCluster" element={<AddPersediaanCluster />} />
        <Route path="/input" element={<AddCatatan />} />
        <Route path="/persediaanDummy" element={<TotalPersediaan />} />
        
        <Route path="/persediaan" element={<CatatanPersediaan />} />
      </Routes>
    </div>
  );
}

export default App;
