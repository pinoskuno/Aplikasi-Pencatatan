import React, { useEffect, useState } from "react";
// import "../styles/Coba.css";
import "../App.css";
import $ from "jquery";
import "datatables.net";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCatatan, updateCatatan, deleteCatatan } from "../api/api"; // Impor fungsi API
import Swal from "sweetalert2"; // Impor SweetAlert2

const EditModal = ({ isOpen, onClose, catatan, onSave }) => {
  const [editedCatatan, setEditedCatatan] = useState(null); // Inisialisasi dengan null

  const kategoriOptions = [
    "Minyak sawit (CPO)",
    "Inti Sawit (PK)",
    "Minyak Intisawit (PKO)",
    "Bungkil Inti Sawit (PKM)",
    "Cangkang",
  ];

  const kategoriPembayaran = ["Sudah Bayar", "Belum Bayar"];
  useEffect(() => {
    if (catatan) {
      // Hanya set state jika catatan ada dan bukan null
      setEditedCatatan({
        ...catatan,
        tanggal_kontrak: catatan.tanggal_kontrak ? new Date(catatan.tanggal_kontrak) : null,
        jatuh_tempo_pembayaran: catatan.jatuh_tempo_pembayaran ? new Date(catatan.jatuh_tempo_pembayaran) : null,
        tanggal_bayar: catatan.tanggal_bayar ? new Date(catatan.tanggal_bayar) : null,
        rencana_pelayanan: catatan.rencana_pelayanan ? new Date(catatan.rencana_pelayanan) : null,
        realisasi_pelayanan: catatan.realisasi_pelayanan ? new Date(catatan.realisasi_pelayanan) : null,
      });
    }
  }, [catatan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "harga_excl" || name === "vol_belum_serah"
        ? parseFloat(value) || 0
        : value;
    setEditedCatatan((prev) => {
      const updatedCatatan = { ...prev, [name]: newValue };
      if (updatedCatatan.harga_excl && updatedCatatan.vol_belum_serah) {
        updatedCatatan.nilai = updatedCatatan.harga_excl * updatedCatatan.vol_belum_serah;
      } else {
        updatedCatatan.nilai = null;
      }
      return updatedCatatan;
    });
  };

  const handleDateChange = (date, field) => {
    setEditedCatatan((prev) => ({ ...prev, [field]: date }));
  };

  const handleSave = () => {
    if (editedCatatan) {
      onSave(editedCatatan);
      onClose(); // Tutup modal setelah disimpan
    }
  };

  // Fungsi untuk menghitung tanggal minimal (20 hari setelah tanggal kontrak)
  const getMinDateForPayment = () => {
    if (!editedCatatan.tanggal_kontrak) return null;
    const minDate = new Date(editedCatatan.tanggal_kontrak);
    minDate.setDate(minDate.getDate() + 20);
    return minDate;
  };

  // Guard clause: Jangan render form jika editedCatatan belum siap
  if (!editedCatatan) {
    return null;
  }
  return (
    isOpen && (
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Catatan</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* Edit Form */}
              <div className="form-row gap-1">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Kategori Pembayaran</label>
                    <select
                      type="text"
                      className="form-control bg-light"
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
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Kategori Barang</label>
                    <select
                      type="text"
                      className="form-control bg-light"
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
                </div>
              </div>

              <div className="form-row gap-1">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Nomor Kontrak</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      name="nomor_kontrak"
                      value={editedCatatan?.nomor_kontrak || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row gap-1">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Tanggal Kontrak</label>
                    <DatePicker
                      selected={editedCatatan?.tanggal_kontrak || null}
                      onChange={(date) => handleDateChange(date, "tanggal_kontrak")}
                      dateFormat="yyyy-MM-dd"
                      className="form-control bg-light"
                      placeholderText="Pilih Tanggal"
                      wrapperClassName="w-100"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Pembeli</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      name="pembeli"
                      value={editedCatatan?.pembeli || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row gap-1">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Jatuh Tempo Pembayaran</label>
                    <DatePicker
                      selected={editedCatatan?.jatuh_tempo_pembayaran || null}
                      onChange={(date) => handleDateChange(date, "jatuh_tempo_pembayaran")}
                      dateFormat="yyyy-MM-dd"
                      className="form-control bg-light"
                      placeholderText="Pilih Tanggal"
                      wrapperClassName="w-100"
                      minDate={getMinDateForPayment()}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Tanggal Bayar</label>
                    <DatePicker
                      selected={editedCatatan?.tanggal_bayar || null}
                      onChange={(date) => handleDateChange(date, "tanggal_bayar")}
                      dateFormat="yyyy-MM-dd"
                      className="form-control bg-light"
                      placeholderText="Pilih Tanggal"
                      wrapperClassName="w-100"
                      minDate={getMinDateForPayment()}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row gap-1">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Mutu ALB (%)</label>
                    <input
                      type="number"
                      className="form-control bg-light"
                      name="mutu_alb"
                      value={editedCatatan?.mutu_alb || ""}
                      onChange={handleChange}
                      max="5"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Vol Belum Serah (kg)</label>
                    <input
                      type="number"
                      className="form-control bg-light"
                      name="vol_belum_serah"
                      value={editedCatatan?.vol_belum_serah || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row gap-1">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Harga Excl (Rp/Kg)</label>
                    <input
                      type="number"
                      className="form-control bg-light"
                      name="harga_excl"
                      value={editedCatatan?.harga_excl || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Fraco/FOB</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      name="fraco_fob"
                      value={editedCatatan?.fraco_fob || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row gap-1">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Rencana Pelayanan</label>
                    <DatePicker
                      selected={editedCatatan?.rencana_pelayanan || null}
                      onChange={(date) => handleDateChange(date, "rencana_pelayanan")}
                      dateFormat="yyyy-MM-dd"
                      className="form-control bg-light"
                      placeholderText="Pilih Tanggal"
                      wrapperClassName="w-100"
                      minDate={editedCatatan?.tanggal_bayar || null}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Realisasi Pelayanan</label>
                    <DatePicker
                      selected={editedCatatan?.realisasi_pelayanan || null}
                      onChange={(date) => handleDateChange(date, "realisasi_pelayanan")}
                      dateFormat="yyyy-MM-dd"
                      className="form-control bg-light"
                      placeholderText="Pilih Tanggal"
                      wrapperClassName="w-100"
                      minDate={editedCatatan?.tanggal_bayar || null}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nilai</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={editedCatatan?.nilai || ""}
                  disabled
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
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
  const [currentPage, setCurrentPage] = useState({});
  const itemsPerPage = 2; // Jumlah item per halaman
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState({
    fraco_fob: "",
    pembeli: "",
    tanggal: "",
  });
  
  // State untuk menyimpan opsi dropdown
  const [fracoFobOptions, setFracoFobOptions] = useState([]);
  const [pembeliOptions, setPembeliOptions] = useState([]);
  const [tanggalOptions, setTanggalOptions] = useState([]);
  const [error, setError] = useState(null); // State untuk error

  const handleSearchChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value,
    });
  };
  

  useEffect(() => {
    const fetchCatatan = async () => {
      try {
        const data = await getCatatan();
        setCatatan(data);
        const uniqueFracoFob = [...new Set(data.map((cat) => cat.fraco_fob).filter(Boolean))];
        const uniquePembeli = [...new Set(data.map((cat) => cat.pembeli).filter(Boolean))];
        const uniqueTanggal = [
          ...new Set(
            data
              .flatMap((cat) => [
                cat.tanggal_kontrak,
                cat.tanggal_bayar,
                cat.jatuh_tempo_pembayaran,
              ])
              .filter(Boolean)
          ),
        ];
        setFracoFobOptions(uniqueFracoFob);
        setPembeliOptions(uniquePembeli);
        setTanggalOptions(uniqueTanggal);
        setError(null);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal memuat data catatan. Silakan coba lagi.",
          confirmButtonText: "OK",
        });
        console.error(err);
      }
    };
    fetchCatatan();
  }, []);
  
  useEffect(() => {
    $(document).ready(function () {
      $("#poliTable").DataTable({
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
        language: {
          lengthMenu: "Show _MENU_ entries",
          zeroRecords: "No data found",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          infoEmpty: "No records available",
          infoFiltered: "(filtered from _MAX_ total records)",
          search: "Search:",
          paginate: {
            first: "First",
            last: "Last",
            next: "Next",
            previous: "Previous",
          },
        },
      });
    });
  }, []);

  const handleEdit = (cat) => {
    setSelectedCatatan(cat);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedCatatan) => {
    try {
      const data = await updateCatatan(updatedCatatan.id, updatedCatatan);
      if (data.message === "Catatan berhasil diperbarui") {
        setCatatan(
          catatan.map((cat) =>
            cat.id === updatedCatatan.id ? updatedCatatan : cat
          )
        );
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Catatan berhasil diperbarui!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Gagal memperbarui catatan: Respons tidak valid");
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal memperbarui catatan: " + err.message,
        confirmButtonText: "OK",
      });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Catatan ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteCatatan(id);
        if (data.message === "Catatan berhasil dihapus") {
          setCatatan(catatan.filter((cat) => cat.id !== id));
          await Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Catatan berhasil dihapus!",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Gagal menghapus catatan: Respons tidak valid");
        }
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus catatan: " + err.message,
          confirmButtonText: "OK",
        });
        console.error(err);
      }
    }
  };

  // Fungsi untuk sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  
    setCatatan((prevCatatan) =>
      [...prevCatatan].sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
  
        // Jika angka, bandingkan sebagai angka
        if (!isNaN(valA) && !isNaN(valB)) {
          return direction === "asc" ? valA - valB : valB - valA;
        }
  
        // Jika teks, bandingkan sebagai string
        return direction === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      })
    );
  };

  const filteredCatatan = catatan.filter((cat) => {
    const { fraco_fob, pembeli, tanggal } = searchQuery;
  
    // Filter untuk fraco_fob
    const matchesFracoFOB = fraco_fob ? cat.fraco_fob === fraco_fob : true;
  
    // Filter untuk pembeli
    const matchesPembeli = pembeli ? cat.pembeli === pembeli : true;
  
    // Filter untuk tanggal
    const matchesTanggal = tanggal
      ? cat.tanggal_kontrak === tanggal ||
        cat.tanggal_bayar === tanggal ||
        cat.jatuh_tempo_pembayaran === tanggal
      : true;
  
    // Kembalikan true hanya jika semua filter yang dipilih cocok
    return matchesFracoFOB && matchesPembeli && matchesTanggal;
  });
  
  const categorizedData = filteredCatatan.reduce((acc, cat) => {
    const kategori = cat.status_pembayaran;
    if (!acc[kategori]) acc[kategori] = {};
    const subKategori = cat.judul;
    if (!acc[kategori][subKategori]) acc[kategori][subKategori] = [];
    acc[kategori][subKategori].push(cat);
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            name="fraco_fob"
            className="form-control"
            value={searchQuery.fraco_fob}
            onChange={handleSearchChange}
          >
            <option value="">Pilih Fraco FOB</option>
            {fracoFobOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            name="pembeli"
            className="form-control"
            value={searchQuery.pembeli}
            onChange={handleSearchChange}
          >
            <option value="">Pilih Pembeli</option>
            {pembeliOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            name="tanggal"
            className="form-control"
            value={searchQuery.tanggal}
            onChange={handleSearchChange}
          >
            <option value="">Pilih Tanggal</option>
            {tanggalOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.entries(categorizedData).map(([kategori, subData]) => (
        <div key={kategori} className="mb-5">
          <h2 className="h1 text-primary badge bg-gradient-primary-to-secondary text-white fs-4">
            {kategori} <i className="fa-solid fa-list-check"></i>
          </h2>
          {Object.entries(subData).map(([subKategori, data]) => {
            if (!currentPage[subKategori]) {
              setCurrentPage((prev) => ({ ...prev, [subKategori]: 1 }));
            }

            // Pagination data
            const startIdx = (currentPage[subKategori] - 1) * itemsPerPage;
            const paginatedData = data.slice(startIdx, startIdx + itemsPerPage);
            const totalPages = Math.ceil(data.length / itemsPerPage);

            return (
              <div key={subKategori} className="mb-4">
                <h3 className="h5 mb-3">{subKategori}</h3>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr className="gray-header">
                        {[
                          "Nomor Kontrak",
                          "Tanggal Kontrak",
                          "Pembeli",
                          "Jatuh Tempo Pembayaran",
                          "Tanggal Bayar",
                          "Mutu ALB (%)",
                          "Vol Belum Serah",
                          "Harga Excl",
                          "Nilai",
                          "Fraco / FOB",
                          "Rencana Pelayanan",
                          "Realisasi Pelayanan",
                        ].map((col) => (
                          <th
                            key={col}
                            style={{
                              backgroundColor: "#52D3D8",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort(col)}
                          >
                            {col}{" "}
                            {sortConfig.key === col
                              ? sortConfig.direction === "asc"
                                ? "▲"
                                : "▼"
                              : ""}
                          </th>
                        ))}
                        <th style={{ backgroundColor: "#52D3D8" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((cat) => (
                        <tr key={cat.id}>
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
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleEdit(cat)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(cat.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
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