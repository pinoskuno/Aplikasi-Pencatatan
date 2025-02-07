import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddCatatan = () => {
  const [formData, setFormData] = useState({
    status_pembayaran: "",
    judul: "",
    deskripsi: "",
    nomor_kontrak: "",
    tanggal_kontrak: null,
    pembeli: "",
    jatuh_tempo_pembayaran: null,
    tanggal_bayar: null,
    mutu_alb: "",
    vol_belum_serah: "",
    harga_excl: "",
    fraco_fob: "",
    rencana_pelayanan: null,
    realisasi_pelayanan: null,
  });
    // Daftar kategori pembayaran untuk dropdown
    const kategoriPembayaran = [
      "Sudah Bayar",
      "Belum Bayar",
    ];
  // Daftar kategori untuk dropdown
  const kategoriOptions = [
    "Minyak sawit (CPO)",
    "Inti Sawit (PK)",
    "Minyak Intisawit (PKO)",
    "Bungkil Inti Sawit (PKM)",
    "Cangkang",
  ];

  // Fungsi untuk handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/catatan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        tanggal_kontrak: formData.tanggal_kontrak?.toISOString().split("T")[0],
        jatuh_tempo_pembayaran: formData.jatuh_tempo_pembayaran?.toISOString().split("T")[0],
        tanggal_bayar: formData.tanggal_bayar?.toISOString().split("T")[0],
        rencana_pelayanan: formData.rencana_pelayanan?.toISOString().split("T")[0],
        realisasi_pelayanan: formData.realisasi_pelayanan?.toISOString().split("T")[0],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Catatan berhasil ditambahkan!");
        // Reset form setelah submit
        setFormData({
          status_pembayaran: "",
          judul: "",
          deskripsi: "",
          nomor_kontrak: "",
          tanggal_kontrak: null,
          pembeli: "",
          jatuh_tempo_pembayaran: null,
          tanggal_bayar: null,
          mutu_alb: "",
          vol_belum_serah: "",
          harga_excl: "",
          fraco_fob: "",
          rencana_pelayanan: null,
          realisasi_pelayanan: null,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Fungsi untuk reset formulir
  const handleReset = () => {
    setFormData({
      status_pembayaran: "",
      judul: "",
      deskripsi: "",
      nomor_kontrak: "",
      tanggal_kontrak: null,
      pembeli: "",
      jatuh_tempo_pembayaran: null,
      tanggal_bayar: null,
      mutu_alb: "",
      vol_belum_serah: "",
      harga_excl: "",
      fraco_fob: "",
      rencana_pelayanan: null,
      realisasi_pelayanan: null,
    }); // Reset state
  };

  // Fungsi untuk handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fungsi untuk handle perubahan tanggal
  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Tambah Catatan</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-row">
          <div className="col-md-6">
              <label className="form-label">Kategori Pembayaran</label>
              <select
                name="status_pembayaran"
                value={formData. status_pembayaran}
                onChange={handleChange}
                className="form-control bg-light"
                required
              >
                <option value="">Pilih Kategori</option>
                {kategoriPembayaran.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown untuk kategori */}
            <div className="col-md-6">
              <label className="form-label">Kategori Barang</label>
              <select
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                className="form-control bg-light"
                required
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

          <div className="form-row">
              {/* Input untuk deskripsi */}
              <div className="col-md-6">
                <label className="form-label">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className="form-control bg-light"
                />
              </div>

            {/* Input untuk nomor kontrak */}
            <div className="col-md-6">
              <label className="form-label">Nomor Kontrak</label>
              <input
                type="text"
                name="nomor_kontrak"
                value={formData.nomor_kontrak}
                onChange={handleChange}
                className="form-control bg-light"
              />
            </div>
          </div>

          <div className="form-row">
            {/* Input untuk tanggal kontrak */}
            <div className="col-md-6">
              <label className="form-label">Tanggal Kontrak</label>
              <DatePicker
                selected={formData.tanggal_kontrak}
                onChange={(date) => handleDateChange(date, "tanggal_kontrak")}
                dateFormat="dd/MM/yyyy"
                className="form-control bg-light"
                placeholderText="Pilih Tanggal"
                wrapperClassName="w-100"
              />
            </div>

            {/* Input untuk pembeli */}
            <div className="col-md-6">
              <label className="form-label">Pembeli</label>
              <input
                type="text"
                name="pembeli"
                value={formData.pembeli}
                onChange={handleChange}
                className="form-control bg-light"
              />
            </div>
          </div>

          <div className="form-row">
            {/* Input untuk jatuh tempo pembayaran */}
            <div className="col-md-6">
              <label className="form-label">Jatuh Tempo Pembayaran</label>
              <DatePicker
                selected={formData.jatuh_tempo_pembayaran}
                onChange={(date) => handleDateChange(date, "jatuh_tempo_pembayaran")}
                dateFormat="dd/MM/yyyy"
                className="form-control bg-light date-picker"
                placeholderText="Pilih Tanggal"
                wrapperClassName="w-100"
              />
            </div>

            {/* Input untuk tanggal bayar */}
            <div className="col-md-6">
              <label className="form-label">Tanggal Bayar</label>
              <DatePicker
                selected={formData.tanggal_bayar}
                onChange={(date) => handleDateChange(date, "tanggal_bayar")}
                dateFormat="dd/MM/yyyy"
                className="form-control bg-light"
                placeholderText="Pilih Tanggal"
                wrapperClassName="w-100"
              />
            </div>
          </div>

          <div className="form-row">
            {/* Input untuk mutu ALB */}
            <div className="col-md-6">
              <label className="form-label">Mutu ALB (%)</label>
              <input
                type="number"
                name="mutu_alb"
                value={formData.mutu_alb}
                onChange={handleChange}
                className="form-control bg-light"
                min="0"
                max="100"
              />
            </div>

            {/* Input untuk volume belum serah */}
            <div className="col-md-6">
              <label className="form-label">Vol Belum Serah (kg)</label>
              <input
                type="number"
                name="vol_belum_serah"
                value={formData.vol_belum_serah}
                onChange={handleChange}
                className="form-control bg-light"
              />
            </div>
          </div>

        <div className="form-row">
          {/* Input untuk harga excl */}
          <div className="col-md-6">
            <label className="form-label">Harga Excl (Rp/Kg)</label>
            <input
              type="number"
              name="harga_excl"
              value={formData.harga_excl}
              onChange={handleChange}
              className="form-control bg-light"
            />
          </div>

          {/* Input untuk fraco/fob */}
          <div className="col-md-6">
            <label className="form-label">Fraco/FOB</label>
            <input
              type="text"
              name="fraco_fob"
              value={formData.fraco_fob}
              onChange={handleChange}
              className="form-control bg-light"
            />
          </div>
        </div>

        <div className="form-row">
          {/* Input untuk rencana pelayanan */}
          <div className="col-md-6">
            <label className="form-label">Rencana Pelayanan</label>
            <DatePicker
              selected={formData.rencana_pelayanan}
              onChange={(date) => handleDateChange(date, "rencana_pelayanan")}
              dateFormat="dd/MM/yyyy"
              className="form-control bg-light"
              placeholderText="Pilih Tanggal"
              wrapperClassName="w-100"
            />
          </div>

          {/* Input untuk realisasi pelayanan */}
          <div className="col-md-6">
            <label className="form-label">Realisasi Pelayanan</label>
            <DatePicker
              selected={formData.realisasi_pelayanan}
              onChange={(date) => handleDateChange(date, "realisasi_pelayanan")}
              dateFormat="dd/MM/yyyy"
              className="form-control bg-light"
              placeholderText="Pilih Tanggal"
              wrapperClassName="w-100"
            />
          </div>
        </div>

        {/* Tombol submit */}
        <div class="d-grid gap-2 mt-2">
          <button type="submit" className="btn btn-primary">
            Tambah
          </button>
        </div>

        <div class="d-grid gap-2 mt-2">
              <button type="reset" class="btn btn-secondary" onClick={handleReset} >Reset</button>
        </div>
      </form>
    </div>
  );
};

export default AddCatatan;