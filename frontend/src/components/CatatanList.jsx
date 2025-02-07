import React, { useEffect, useState } from "react";
import "../styles/CatatanList.css";

// Component untuk modal edit
const EditModal = ({ isOpen, onClose, catatan, onSave }) => {
  const [editedCatatan, setEditedCatatan] = useState(catatan);

  const kategoriOptions = [
    "Minyak sawit (CPO)",
    "Inti Sawit (PK)",
    "Minyak Intisawit (PKO)",
    "Bungkil Inti Sawit (PKM)",
    "Cangkang",
  ];

  const kategoriPembayaran = [
    "Sudah Bayar",
    "Belum Bayar",
  ];

  useEffect(() => {
    setEditedCatatan(catatan); // Set nilai awal ketika modal terbuka
  }, [catatan]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Periksa apakah nilai yang dimasukkan adalah angka atau teks
    const newValue = name === 'harga_excl' || name === 'vol_belum_serah'
      ? parseFloat(value) || 0  // Untuk harga_excl dan vol_belum_serah, pastikan selalu jadi angka
      : value;  // Untuk input teks, biarkan sebagai string

    setEditedCatatan((prev) => {
      const updatedCatatan = { ...prev, [name]: newValue };

      // Perhitungan nilai hanya jika harga_excl dan vol_belum_serah ada
      if (updatedCatatan.harga_excl && updatedCatatan.vol_belum_serah) {
        updatedCatatan.nilai = updatedCatatan.harga_excl * updatedCatatan.vol_belum_serah;
      } else {
        updatedCatatan.nilai = null;
      }

      return updatedCatatan;
    });
  };

  const handleSave = () => {
    onSave(editedCatatan);
    onClose(); // Tutup modal setelah disimpan
  };

  return (
    isOpen && (
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Catatan</h5>
              <button type="button" className="close" onClick={onClose}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {/* Edit Form */}
              <div className="form-group">
                <label>Kategori Pembayaran</label>
                <select
                  type="text"
                  className="form-control"
                  name="status_pembayaran"
                  value={editedCatatan?.status_pembayaran || ""}
                  onChange={handleChange}
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriPembayaran.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Kategori Barang</label>
                <select
                  type="text"
                  className="form-control"
                  name="judul"
                  value={editedCatatan?.judul || ""}
                  onChange={handleChange}
                >
                    <option value="">Pilih Kategori</option>
                    {kategoriOptions.map((kategori) => (
                      <option key={kategori} value={kategori}>
                        {kategori}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <input
                  type="text"
                  className="form-control"
                  name="deskripsi"
                  value={editedCatatan?.deskripsi || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Nomor Kontrak</label>
                <input
                  type="text"
                  className="form-control"
                  name="nomor_kontrak"
                  value={editedCatatan?.nomor_kontrak || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tanggal Kontrak</label>
                <input
                  type="date"
                  className="form-control"
                  name="tanggal_kontrak"
                  value={editedCatatan?.tanggal_kontrak || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Pembeli</label>
                <input
                  type="text"
                  className="form-control"
                  name="pembeli"
                  value={editedCatatan?.pembeli || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Jatuh Tempo Pembayaran</label>
                <input
                  type="date"
                  className="form-control"
                  name="jatuh_tempo_pembayaran"
                  value={editedCatatan?.jatuh_tempo_pembayaran || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tanggal Bayar</label>
                <input
                  type="date"
                  className="form-control"
                  name="tanggal_bayar"
                  value={editedCatatan?.tanggal_bayar || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Mutu ALB (%)</label>
                <input
                  type="number"
                  className="form-control"
                  name="mutu_alb"
                  value={editedCatatan?.mutu_alb || ""}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Vol Belum Serah (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  name="vol_belum_serah"
                  value={editedCatatan?.vol_belum_serah || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Harga Excl (Rp/Kg)</label>
                <input
                  type="number"
                  className="form-control"
                  name="harga_excl"
                  value={editedCatatan?.harga_excl || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Fraco/FOB</label>
                <input
                  type="text"
                  className="form-control"
                  name="fraco_fob"
                  value={editedCatatan?.fraco_fob || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Rencana Pelayanan</label>
                <input
                  type="date"
                  className="form-control"
                  name="rencana_pelayanan"
                  value={editedCatatan?.rencana_pelayanan || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Realisasi Pelayanan</label>
                <input
                  type="date"
                  className="form-control"
                  name="realisasi_pelayanan"
                  value={editedCatatan?.realisasi_pelayanan || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Nilai</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedCatatan?.nilai || ""}
                  disabled
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};



const CatatanList = () => {
  const [catatan, setCatatan] = useState([]);
  const [selectedCatatan, setSelectedCatatan] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/catatan")
      .then((res) => res.json())
      .then((data) => setCatatan(data));
  }, []);

  const handleEdit = (cat) => {
    setSelectedCatatan(cat);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedCatatan) => {
    fetch(`http://localhost:5000/api/catatan/${updatedCatatan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCatatan),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Catatan berhasil diperbarui") {
          setCatatan(
            catatan.map((cat) => (cat.id === updatedCatatan.id ? updatedCatatan : cat))
          );
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
      fetch(`http://localhost:5000/api/catatan/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Catatan berhasil dihapus") {
            setCatatan(catatan.filter((cat) => cat.id !== id));
          }
        });
    }
  };

  // Pisahkan catatan menjadi dua kategori utama: Sudah Bayar dan Belum Bayar
  const categorizedData = catatan.reduce((acc, cat) => {
    const kategori = cat.status_pembayaran ;
    if (!acc[kategori]) acc[kategori] = {};
    const subKategori = cat.judul;
    if (!acc[kategori][subKategori]) acc[kategori][subKategori] = [];
    acc[kategori][subKategori].push(cat);
    return acc;
  },
  {});

  return (
    <div className="container mt-4">
      <h1 style={{ color: "#808080" }} className="text-center mb-4">Daftar Catatan</h1>
      {Object.entries(categorizedData).map(([kategori, subData]) => (
        <div key={kategori} className="mb-5">
          <h2 className="h3 text-primary">{kategori}</h2>
          {Object.entries(subData).map(([subKategori, data]) => {
            const totalVolBelumSerah = data.reduce((sum, cat) => sum + parseFloat(cat.vol_belum_serah || 0), 0);
            const totalNilai = data.reduce((sum, cat) => sum + parseFloat(cat.nilai || 0), 0);
            return (
              <div key={subKategori} className="mb-4">
                <h3 className="h5 mb-3">{subKategori}</h3>
                <table className="table table-bordered">
                  <thead>
                    <tr className="gray-header">
                      <th>Deskripsi</th>
                      <th>Nomor Kontrak</th>
                      <th>Tanggal Kontrak</th>
                      <th>Pembeli</th>
                      <th>Jatuh Tempo Pembayaran</th>
                      <th>Tanggal Bayar</th>
                      <th>Mutu ALB (%)</th>
                      <th>Vol Belum Serah (kg)</th>
                      <th>Harga Excl (Rp/Kg)</th>
                      <th>Nilai (Rp)</th>
                      <th>Fraco/FOB</th>
                      <th>Rencana Pelayanan</th>
                      <th>Realisasi Pelayanan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((cat) => (
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
                    <tr>
                      <td colSpan="7" className="text-end fw-bold">Total</td>
                      <td>{totalVolBelumSerah.toFixed(2)} kg</td>
                      <td></td>
                      <td>Rp {totalNilai.toLocaleString()}</td>
                      <td colSpan="3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ))}
      {/* Modal Edit */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        catatan={selectedCatatan}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default CatatanList;
