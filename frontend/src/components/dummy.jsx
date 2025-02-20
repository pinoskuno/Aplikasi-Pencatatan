import React, { useEffect, useState } from "react";

const CatatanList = () => {
  const [catatan, setCatatan] = useState([]);
  const [selectedCatatan, setSelectedCatatan] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterState, setFilterState] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const itemsPerPage = 5; // Jumlah item per halaman

  useEffect(() => {
    fetch("http://localhost:5000/api/catatan")
      .then((res) => res.json())
      .then((data) => {
        setCatatan(data);
      });
  }, []);

  const handleEdit = (cat) => {
    setSelectedCatatan(cat);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
      fetch(`http://localhost:5000/api/catatan/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          setCatatan(catatan.filter((cat) => cat.id !== id));
        });
    }
  };

  // Data dikategorikan berdasarkan status pembayaran dan subkategori (judul)
  const categorizedData = catatan.reduce((acc, cat) => {
    const kategori = cat.status_pembayaran;
    if (!acc[kategori]) acc[kategori] = {};
    const subKategori = cat.judul;
    if (!acc[kategori][subKategori]) acc[kategori][subKategori] = [];
    acc[kategori][subKategori].push(cat);
    return acc;
  }, {});

  // Fungsi untuk menangani perubahan input filter
  const handleFilterChange = (e, subKategori) => {
    const { name, value } = e.target;
    setFilterState((prev) => ({
      ...prev,
      [subKategori]: { ...prev[subKategori], [name]: value },
    }));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        OUTSTANDING KONTRAK PENJUALAN REGIONAL VII KSO
      </h2>
      <h2 className="text-center mb-4">PTPN IV REGIONAL 7 KSO</h2>

      {Object.entries(categorizedData).map(([kategori, subData]) => (
        <div key={kategori} className="mb-5">
          <h2 className="h3 text-primary">{kategori}</h2>
          {Object.entries(subData).map(([subKategori, data]) => {
            // Default state pagination per subkategori
            if (!currentPage[subKategori]) {
              setCurrentPage((prev) => ({ ...prev, [subKategori]: 1 }));
            }

            // Default state filter per kolom
            if (!filterState[subKategori]) {
              setFilterState((prev) => ({ ...prev, [subKategori]: {} }));
            }

            // Filter data berdasarkan input filter di setiap kolom
            const filteredData = data.filter((item) =>
              Object.entries(filterState[subKategori] || {}).every(([key, value]) =>
                item[key]?.toString().toLowerCase().includes(value.toLowerCase())
              )
            );

            // Pagination data
            const startIdx = (currentPage[subKategori] - 1) * itemsPerPage;
            const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);

            return (
              <div key={subKategori} className="mb-4">
                <h3 className="h5 mb-3">{subKategori}</h3>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr className="gray-header">
                        {[
                          "deskripsi",
                          "nomor_kontrak",
                          "tanggal_kontrak",
                          "pembeli",
                          "jatuh_tempo_pembayaran",
                          "tanggal_bayar",
                          "mutu_alb",
                          "vol_belum_serah",
                          "harga_excl",
                          "nilai",
                          "fraco_fob",
                          "rencana_pelayanan",
                          "realisasi_pelayanan",
                        ].map((col) => (
                          <th key={col} style={{ backgroundColor: "#52D3D8" }}>
                            <input
                              type="text"
                              placeholder={`Cari ${col}`}
                              className="form-control form-control-sm"
                              name={col}
                              value={filterState[subKategori]?.[col] || ""}
                              onChange={(e) => handleFilterChange(e, subKategori)}
                            />
                          </th>
                        ))}
                        <th style={{ backgroundColor: "#52D3D8" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((cat) => (
                        <tr key={cat.id}>
                          <td>{cat.deskripsi}</td>
                          <td>{cat.nomor_kontrak}</td>
                          <td>{cat.tanggal_kontrak}</td>
                          <td>{cat.pembeli}</td>
                          <td>{cat.jatuh_tempo_pembayaran}</td>
                          <td>{cat.tanggal_bayar}</td>
                          <td>{cat.mutu_alb}%</td>
                          <td>{cat.vol_belum_serah} kg</td>
                          <td>Rp {cat.harga_excl?.toLocaleString()}</td>
                          <td>Rp {cat.nilai?.toLocaleString()}</td>
                          <td>{cat.fraco_fob}</td>
                          <td>{cat.rencana_pelayanan}</td>
                          <td>{cat.realisasi_pelayanan}</td>
                          <td>
                            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(cat)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={currentPage[subKategori] === 1}
                    onClick={() =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        [subKategori]: prev[subKategori] - 1,
                      }))
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage[subKategori]} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={currentPage[subKategori] === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        [subKategori]: prev[subKategori] + 1,
                      }))
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CatatanList;
