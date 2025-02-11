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
  const nilai =
    parseFloat(harga_excl) && parseFloat(vol_belum_serah)
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
      res
        .status(201)
        .json({ message: "Catatan berhasil ditambahkan", id: result.insertId });
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

  const nilai =
    parseFloat(harga_excl) && parseFloat(vol_belum_serah)
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

app.post("/penyimpanan", (req, res) => {
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  db.query(
    "INSERT INTO data_penyimpanan (tanggal, lokasi) VALUES (?, ?)",
    [tanggal, lokasi],
    (err, result) => {
      if (err) return res.status(500).json(err);
      const penyimpananId = result.insertId;

      db.query(
        "INSERT INTO data_pkm (id_penyimpanan, nilai_pkm, nilai_do, nilai_hi) VALUES (?, ?, ?, ?)",
        [penyimpananId, pkm.nilai_pkm, pkm.nilai_do, pkm.nilai_hi]
      );

      // Insert kernel
      db.query(
        "INSERT INTO kernel (id_penyimpanan, stok, alb, kadar_air, kadar_kotoran, do, hi) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          penyimpananId,
          kernel.stok,
          kernel.alb,
          kernel.kadar_air,
          kernel.kadar_kotoran,
          kernel.do,
          kernel.hi,
        ]
      );

      // Insert kategori dan penyimpanan
      kategori.forEach((kat) => {
        db.query(
          "INSERT INTO kategori (id_penyimpanan, nama_kategori) VALUES (?, ?)",
          [penyimpananId, kat.nama],
          (err, result) => {
            if (err) return res.status(500).json(err);
            const kategoriId = result.insertId;

            // Insert penyimpanan
            kat.penyimpanan.forEach((p) => {
              db.query(
                "INSERT INTO penyimpanan (id_kategori, jenis_tank, stok, alb, kadar_air, kadar_kotoran, do, hi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  kategoriId,
                  p.jenis_tank,
                  p.stok,
                  p.alb,
                  p.kadar_air,
                  p.kadar_kotoran,
                  p.do,
                  p.hi,
                ]
              );
            });

            // Insert jumlah_total
            db.query(
              "INSERT INTO jumlah_total (id_kategori, stok, alb, kadar_air, kadar_kotoran, do, hi) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                kategoriId,
                kat.jumlah.stok,
                kat.jumlah.alb,
                kat.jumlah.kadar_air,
                kat.jumlah.kadar_kotoran,
                kat.jumlah.do,
                kat.jumlah.hi,
              ]
            );
          }
        );
      });
      res.json({ message: "Data berhasil ditambahkan" });
    }
  );
});

// GET all data
app.get('/data_penyimpanan', (req, res) => {
  const sql = `
  SELECT dp.id, dp.tanggal, dp.lokasi, 
         pk.nilai_pkm, pk.nilai_do AS pkm_do, pk.nilai_hi AS pkm_hi,
         k.stok AS kernel_stok, k.alb AS kernel_alb, k.kadar_air AS kernel_kadar_air, k.kadar_kotoran AS kernel_kadar_kotoran,k.do AS kernel_do, k.hi AS kernel_hi,
         ka.id AS kategori_id, ka.nama_kategori,
         p.id AS penyimpanan_id, p.jenis_tank, p.stok AS penyimpanan_stok, p.alb AS penyimpanan_alb, p.kadar_air AS penyimpanan_kadar_air, p.kadar_kotoran AS penyimpanan_kadar_kotoran,  p.do AS penyimpanan_do, p.hi AS penyimpanan_hi,
         jt.stok AS jumlah_stok, jt.alb AS jumlah_alb, jt.kadar_air AS jumlah_kadar_air, jt.kadar_kotoran AS jumlah_kadar_kotoran, jt.do AS jumlah_do, jt.hi AS jumlah_hi
  FROM data_penyimpanan dp
  LEFT JOIN data_pkm pk ON pk.id_penyimpanan = dp.id
  LEFT JOIN kernel k ON k.id_penyimpanan = dp.id
  LEFT JOIN kategori ka ON ka.id_penyimpanan = dp.id
  LEFT JOIN penyimpanan p ON p.id_kategori = ka.id
  LEFT JOIN jumlah_total jt ON jt.id_kategori = ka.id`;

  db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);

      const dataMap = {};
      results.forEach(row => {
          if (!dataMap[row.id]) {
              dataMap[row.id] = {
                  id: row.id,
                  tanggal: row.tanggal,
                  lokasi: row.lokasi,
                  pkm: {
                    nilai_pkm: row.nilai_pkm,
                    nilai_do: row.pkm_do,
                    nilai_hi: row.pkm_hi,
                  },
                  kernel: {
                      stok: row.kernel_stok,
                      alb: row.kernel_alb,
                      kadar_air: row.kernel_kadar_air,
                      kadar_kotoran: row.kernel_kadar_kotoran,
                      do: row.kernel_do,
                      hi: row.kernel_hi,                      

                  },
                  kategori: {}
              };
          }

          if (!dataMap[row.id].kategori[row.kategori_id]) {
              dataMap[row.id].kategori[row.kategori_id] = {
                  nama: row.nama_kategori,
                  penyimpanan: [],
                  jumlah: {
                      stok: row.jumlah_stok,
                      alb: row.jumlah_alb,
                      kadar_air: row.jumlah_kadar_air,
                      kadar_kotoran: row.jumlah_kadar_kotoran,
                      do: row.jumlah_do,
                      hi: row.jumlah_hi,
                  }
              };
          }

          if (row.penyimpanan_id) {
              dataMap[row.id].kategori[row.kategori_id].penyimpanan.push({
                  jenis_tank: row.jenis_tank,
                  stok: row.penyimpanan_stok,
                  alb: row.penyimpanan_alb,
                  kadar_air: row.penyimpanan_kadar_air,
                  kadar_kotoran: row.penyimpanan_kadar_kotoran,
                  do: row.penyimpanan_do,
                  hi: row.penyimpanan_hi,
              });
          }
      });

      res.json(Object.values(dataMap));
  });
});

// PUT update data
app.put("/data_penyimpanan/:id", (req, res) => {
  const id = req.params.id;
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // Update data_penyimpanan
    db.query(
      "UPDATE data_penyimpanan SET tanggal = ?, lokasi = ? WHERE id = ?",
      [tanggal, lokasi, id],
      (err) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        // Update pkm
        db.query(
          "UPDATE pkm SET nilai_pkm = ?, nilai_do = ?, nilai_hi = ? WHERE id_penyimpanan = ?",
          [pkm.nilai_pkm, pkm.do, pkm.hi, id],
          (err) => {
            if (err) return db.rollback(() => res.status(500).json(err));

            // Update kernel
            db.query(
              "UPDATE kernel SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id_penyimpanan = ?",
              [
                kernel.stok,
                kernel.alb,
                kernel.kadar_air,
                kernel.kadar_kotoran,
                kernel.do,
                kernel.hi,
                id,
              ],
              (err) => {
                if (err) return db.rollback(() => res.status(500).json(err));

                // Update kategori dan penyimpanan
                const kategoriPromises = kategori.map((ktg) => {
                  return new Promise((resolve, reject) => {
                    db.query(
                      "UPDATE kategori SET nama_kategori = ? WHERE id = ?",
                      [ktg.nama, ktg.id],
                      (err) => {
                        if (err) return reject(err);

                        // Update penyimpanan
                        const penyimpananPromises = ktg.penyimpanan.map((p) => {
                          return new Promise((resolve, reject) => {
                            db.query(
                              "UPDATE penyimpanan SET jenis_tank = ?, stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id = ?",
                              [
                                p.jenis_tank,
                                p.stok,
                                p.alb,
                                p.kadar_air,
                                p.kadar_kotoran,
                                p.do,
                                p.hi,
                                p.id,
                              ],
                              (err) => {
                                if (err) return reject(err);
                                resolve();
                              }
                            );
                          });
                        });

                        // Update jumlah_total
                        penyimpananPromises.push(
                          new Promise((resolve, reject) => {
                            db.query(
                              "UPDATE jumlah_total SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id_kategori = ?",
                              [
                                ktg.jumlah.stok,
                                ktg.jumlah.alb,
                                ktg.jumlah.kadar_air,
                                ktg.jumlah.kadar_kotoran,
                                ktg.jumlah.do,
                                ktg.jumlah.hi,
                                ktg.id,
                              ],
                              (err) => {
                                if (err) return reject(err);
                                resolve();
                              }
                            );
                          })
                        );

                        Promise.all(penyimpananPromises)
                          .then(resolve)
                          .catch(reject);
                      }
                    );
                  });
                });

                Promise.all(kategoriPromises)
                  .then(() => {
                    db.commit((err) => {
                      if (err)
                        return db.rollback(() => res.status(500).json(err));
                      res.json({ message: "Data updated successfully" });
                    });
                  })
                  .catch((err) => db.rollback(() => res.status(500).json(err)));
              }
            );
          }
        );
      }
    );
  });
});

// DELETE penyimpanan berdasarkan ID (cascade delete kernel, kategori, penyimpanan, jumlah_total)
app.delete("/penyimpanan/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM data_penyimpanan WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Data berhasil dihapus" });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
