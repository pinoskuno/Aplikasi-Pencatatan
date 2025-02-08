const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Ganti dengan username MySQL Anda
  password: "", // Ganti dengan password MySQL Anda
  database: "pencatatan_ptpn_db", // Ganti dengan nama database Anda
});

db.connect((err) => {
  if (err) throw err;
  console.log("Terhubung ke database MySQL");
});

// GET: Ambil semua data stok produk persediaan
app.get("/api/stok_produk", (req, res) => {
  db.query("SELECT * FROM stok_produk_Persedian", (err, results) => {
    if (err) {
      console.error("Error mengambil data stok produk:", err);
      return res.status(500).json({ error: "Gagal mengambil data stok produk." });
    }
    res.json(results);
  });
});

// POST: Tambah data stok produk persediaan
app.post("/api/stok_produk", (req, res) => {
  const { tanggal, lokasi, kategori, storage_tank, stok, alb, kadar_air, kadar_kotoran } = req.body;

  db.query(
    `INSERT INTO stok_produk_Persedian (tanggal, lokasi, kategori, storage_tank, stok, alb, kadar_air, kadar_kotoran) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tanggal, lokasi, kategori, storage_tank, stok, alb, kadar_air, kadar_kotoran],
    (err, result) => {
      if (err) {
        console.error("Error menambahkan stok produk:", err);
        return res.status(500).json({ error: "Gagal menambahkan stok produk." });
      }
      res.status(201).json({ message: "Stok produk berhasil ditambahkan", id: result.insertId });
    }
  );
});

// DELETE: Hapus data stok produk persediaan berdasarkan ID
app.delete("/api/stok_produk/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM stok_produk_Persedian WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error menghapus stok produk:", err);
      return res.status(500).json({ error: "Gagal menghapus stok produk." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stok produk tidak ditemukan." });
    }
    res.json({ message: "Stok produk berhasil dihapus" });
  });
});

// ========================= STOK INDIVIDU PERSEDIAAN =========================

// GET: Ambil semua data stok individu persediaan
app.get("/api/stok_individu", (req, res) => {
  db.query("SELECT * FROM stok_individu_Persediaan", (err, results) => {
    if (err) {
      console.error("Error mengambil data stok individu:", err);
      return res.status(500).json({ error: "Gagal mengambil data stok individu." });
    }
    res.json(results);
  });
});

// POST: Tambah data stok individu persediaan
app.post("/api/stok_individu", (req, res) => {
  const { tanggal, lokasi, jenis, stok, alb, kadar_air, kadar_kotoran } = req.body;

  db.query(
    `INSERT INTO stok_individu_Persediaan (tanggal, lokasi, jenis, stok, alb, kadar_air, kadar_kotoran) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [tanggal, lokasi, jenis, stok, alb, kadar_air, kadar_kotoran],
    (err, result) => {
      if (err) {
        console.error("Error menambahkan stok individu:", err);
        return res.status(500).json({ error: "Gagal menambahkan stok individu." });
      }
      res.status(201).json({ message: "Stok individu berhasil ditambahkan", id: result.insertId });
    }
  );
});

// DELETE: Hapus data stok individu persediaan berdasarkan ID
app.delete("/api/stok_individu/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM stok_individu_Persediaan WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error menghapus stok individu:", err);
      return res.status(500).json({ error: "Gagal menghapus stok individu." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stok individu tidak ditemukan." });
    }
    res.json({ message: "Stok individu berhasil dihapus" });
  });
});



// API untuk mendapatkan semua catatan
app.get("/api/catatan", (req, res) => {
  db.query("SELECT * FROM catatan", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// API untuk menambahkan catatan
app.post("/api/catatan", (req, res) => {
  console.log("Data diterima:", req.body);
  const {
    status_pembayaran,
    judul,
    deskripsi,
    nomor_kontrak,
    tanggal_kontrak,
    pembeli,
    jatuh_tempo_pembayaran,
    tanggal_bayar,
    mutu_alb,
    vol_belum_serah,
    harga_excl,
    fraco_fob,
    rencana_pelayanan,
    realisasi_pelayanan,
  } = req.body;

  // Hitung nilai (nilai = harga_excl * vol_belum_serah)
  const nilai = parseFloat(harga_excl) && parseFloat(vol_belum_serah)
  ? parseFloat(harga_excl) * parseFloat(vol_belum_serah)
  : null;

  db.query(
    `INSERT INTO catatan (
      status_pembayaran,judul, deskripsi, nomor_kontrak, tanggal_kontrak, pembeli, jatuh_tempo_pembayaran,
      tanggal_bayar, mutu_alb, vol_belum_serah, harga_excl, nilai, fraco_fob,
      rencana_pelayanan, realisasi_pelayanan
    ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      status_pembayaran,
      judul,
      deskripsi || null,
      nomor_kontrak || null,
      tanggal_kontrak || null,
      pembeli ? pembeli.toUpperCase() : null,
      jatuh_tempo_pembayaran || null,
      tanggal_bayar || null,
      mutu_alb || null,
      vol_belum_serah || null,
      harga_excl || null,
      nilai || null,
      fraco_fob || null,
      rencana_pelayanan || null,
      realisasi_pelayanan || null,
    ],
    (err, result) => {
    if (err) {
      console.error("Error saat menyimpan ke database:", err);
      return res.status(500).json({ error: "Gagal menyimpan data." });
    }
    res.status(201).json({ message: "Catatan berhasil ditambahkan", id: result.insertId });
  }
  );
});


// API untuk mengedit catatan
app.put("/api/catatan/:id", (req, res) => {
  const id = req.params.id;
  const {
    status_pembayaran,
    judul,
    deskripsi,
    nomor_kontrak,
    tanggal_kontrak,
    pembeli,
    jatuh_tempo_pembayaran,
    tanggal_bayar,
    mutu_alb,
    vol_belum_serah,
    harga_excl,
    fraco_fob,
    rencana_pelayanan,
    realisasi_pelayanan,
  } = req.body;

  const nilai = parseFloat(harga_excl) && parseFloat(vol_belum_serah)
    ? parseFloat(harga_excl) * parseFloat(vol_belum_serah)
    : null;

  db.query(
    `UPDATE catatan SET 
      status_pembayaran = ?,judul = ?, deskripsi = ?, nomor_kontrak = ?, tanggal_kontrak = ?, pembeli = ?, 
      jatuh_tempo_pembayaran = ?, tanggal_bayar = ?, mutu_alb = ?, vol_belum_serah = ?, 
      harga_excl = ?, nilai = ?, fraco_fob = ?, rencana_pelayanan = ?, realisasi_pelayanan = ? 
    WHERE id = ?`,
    [
      status_pembayaran,
      judul,
      deskripsi || null,
      nomor_kontrak || null,
      tanggal_kontrak || null,
      pembeli ? pembeli.toUpperCase() : null,
      jatuh_tempo_pembayaran || null,
      tanggal_bayar || null,
      mutu_alb || null,
      vol_belum_serah || null,
      harga_excl || null,
      nilai || null,
      fraco_fob || null,
      rencana_pelayanan || null,
      realisasi_pelayanan || null,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error saat memperbarui catatan:", err);
        return res.status(500).json({ error: "Gagal memperbarui catatan." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Catatan tidak ditemukan." });
      }
      res.json({ message: "Catatan berhasil diperbarui" });
    }
  );
});

// API untuk menghapus catatan
app.delete("/api/catatan/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM catatan WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error saat menghapus catatan:", err);
      return res.status(500).json({ error: "Gagal menghapus catatan." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Catatan tidak ditemukan." });
    }
    res.json({ message: "Catatan berhasil dihapus" });
  });
});


// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
