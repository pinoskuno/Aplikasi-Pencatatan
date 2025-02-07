import React, { useEffect, useState } from "react";

const TotalSummary = () => {
  const [catatan, setCatatan] = useState([]);
  const [totalKeuntungan, setTotalKeuntungan] = useState(0);
  const [totalPenjualan, setTotalPenjualan] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/catatan")
      .then((res) => res.json())
      .then((data) => {
        setCatatan(data);

        // Hitung total keuntungan dan total penjualan
        const totalNilai = data.reduce((sum, cat) => sum + parseFloat(cat.nilai || 0), 0);
        const totalVol = data.reduce((sum, cat) => sum + parseFloat(cat.vol_belum_serah || 0), 0);

        setTotalKeuntungan(totalNilai);
        setTotalPenjualan(totalVol);
      });
  }, []);

  return (
    <div className="row my-4">
      <div className="col-md-6">
        <div className="card text-white bg-primary mb-3">
          <div className="card-body">
            <h5 className="card-title">Total Keuntungan</h5>
            <p className="card-text fs-4">Rp {totalKeuntungan.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card text-white bg-success mb-3">
          <div className="card-body">
            <h5 className="card-title">Total Penjualan</h5>
            <p className="card-text fs-4">{totalPenjualan.toFixed(2)} kg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSummary;
