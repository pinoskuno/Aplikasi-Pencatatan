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


// Fungsi untuk memperbarui data berikutnya
const updateFollowingData = (lokasi, changedDate, db) => {
  db.query(
    "SELECT * FROM data_penyimpanan WHERE lokasi = ? AND tanggal > ? ORDER BY tanggal ASC",
    [lokasi, changedDate],
    (err, results) => {
      if (err) {
        console.error("Error fetching following data:", err);
        return;
      }
      if (results.length === 0) return;

      results.forEach((entry) => {
        const currentDate = entry.tanggal;
        db.query(
          "SELECT * FROM data_penyimpanan WHERE lokasi = ? AND tanggal < ? ORDER BY tanggal DESC LIMIT 1",
          [lokasi, currentDate],
          (err, prevResults) => {
            if (err) {
              console.error("Error fetching previous data:", err);
              return;
            }

            const prevId = prevResults.length > 0 ? prevResults[0].id : null;
            let basePkm = { nilai_pkm: 0, nilai_do: 0, nilai_hi: 0 };
            let baseKernel = {
              stok: 0,
              alb: 0,
              kadar_air: 0,
              kadar_kotoran: 0,
              do: 0,
              hi: 0,
            };
            let baseKategori = {};

            if (prevId) {
              db.query(
                "SELECT * FROM data_pkm WHERE id_penyimpanan = ?",
                [prevId],
                (err, pkmResults) => {
                  if (pkmResults.length > 0) {
                    basePkm = pkmResults[0];
                  }

                  db.query(
                    "SELECT * FROM kernel WHERE id_penyimpanan = ?",
                    [prevId],
                    (err, kernelResults) => {
                      if (kernelResults.length > 0) {
                        baseKernel = kernelResults[0];
                      }

                      db.query(
                        "SELECT * FROM kategori WHERE id_penyimpanan = ?",
                        [prevId],
                        (err, kategoriResults) => {
                          kategoriResults.forEach((kat) => {
                            db.query(
                              "SELECT * FROM penyimpanan WHERE id_kategori = ?",
                              [kat.id],
                              (err, penyimpananResults) => {
                                baseKategori[kat.nama_kategori] = penyimpananResults;
                              }
                            );
                          });

                          db.query(
                            "SELECT * FROM data_pkm WHERE id_penyimpanan = ?",
                            [entry.id],
                            (err, currentPkm) => {
                              if (currentPkm.length > 0) {
                                const updatedPkm = {
                                  nilai_pkm:
                                    basePkm.nilai_pkm +
                                    (currentPkm[0].nilai_hi
                                      ? Number(currentPkm[0].nilai_pkm) -
                                        Number(currentPkm[0].nilai_hi)
                                      : Number(currentPkm[0].nilai_pkm)),
                                  nilai_do: currentPkm[0].nilai_do
                                    ? Number(currentPkm[0].nilai_do)
                                    : Number(basePkm.nilai_do) +
                                      Number(currentPkm[0].nilai_do),
                                  nilai_hi: currentPkm[0].nilai_hi
                                    ? Number(currentPkm[0].nilai_hi)
                                    : Number(basePkm.nilai_hi) +
                                      Number(currentPkm[0].nilai_hi),
                                };
                                db.query(
                                  "UPDATE data_pkm SET nilai_pkm = ?, nilai_do = ?, nilai_hi = ? WHERE id_penyimpanan = ?",
                                  [
                                    updatedPkm.nilai_pkm,
                                    updatedPkm.nilai_do,
                                    updatedPkm.nilai_hi,
                                    entry.id,
                                  ]
                                );
                              }
                            }
                          );

                          db.query(
                            "SELECT * FROM kernel WHERE id_penyimpanan = ?",
                            [entry.id],
                            (err, currentKernel) => {
                              if (currentKernel.length > 0) {
                                const updatedKernel = {
                                  stok:
                                    baseKernel.stok +
                                    (currentKernel[0].hi
                                      ? Number(currentKernel[0].stok) -
                                        Number(currentKernel[0].hi)
                                      : Number(currentKernel[0].stok)),
                                  alb:
                                    baseKernel.alb +
                                    Number(currentKernel[0].alb),
                                  kadar_air:
                                    baseKernel.kadar_air +
                                    Number(currentKernel[0].kadar_air),
                                  kadar_kotoran:
                                    baseKernel.kadar_kotoran +
                                    Number(currentKernel[0].kadar_kotoran),
                                  do: currentKernel[0].do
                                    ? Number(currentKernel[0].do)
                                    : Number(baseKernel.do) +
                                      Number(currentKernel[0].do),
                                  hi: currentKernel[0].hi
                                    ? Number(currentKernel[0].hi)
                                    : Number(baseKernel.hi) +
                                      Number(currentKernel[0].hi),
                                };
                                db.query(
                                  "UPDATE kernel SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id_penyimpanan = ?",
                                  [
                                    updatedKernel.stok,
                                    updatedKernel.alb,
                                    updatedKernel.kadar_air,
                                    updatedKernel.kadar_kotoran,
                                    updatedKernel.do,
                                    updatedKernel.hi,
                                    entry.id,
                                  ]
                                );
                              }
                            }
                          );

                          db.query(
                            "SELECT * FROM kategori WHERE id_penyimpanan = ?",
                            [entry.id],
                            (err, currentKategori) => {
                              currentKategori.forEach((kat) => {
                                db.query(
                                  "SELECT * FROM penyimpanan WHERE id_kategori = ?",
                                  [kat.id],
                                  (err, currentPenyimpanan) => {
                                    const prevPenyimpanan =
                                      baseKategori[kat.nama_kategori] || [];
                                    currentPenyimpanan.forEach((p) => {
                                      const prevP = prevPenyimpanan.find(
                                        (prev) => prev.jenis_tank === p.jenis_tank
                                      ) || {
                                        stok: 0,
                                        alb: 0,
                                        kadar_air: 0,
                                        kadar_kotoran: 0,
                                        do: 0,
                                        hi: 0,
                                      };
                                      const updatedPenyimpanan = {
                                        stok:
                                          prevP.stok +
                                          (p.hi
                                            ? Number(p.stok) - Number(p.hi)
                                            : Number(p.stok)),
                                        alb: prevP.alb + Number(p.alb),
                                        kadar_air:
                                          prevP.kadar_air + Number(p.kadar_air),
                                        kadar_kotoran:
                                          prevP.kadar_kotoran +
                                          Number(p.kadar_kotoran),
                                        do: p.do
                                          ? Number(p.do)
                                          : Number(prevP.do) + Number(p.do),
                                        hi: p.hi
                                          ? Number(p.hi)
                                          : Number(prevP.hi) + Number(p.hi),
                                      };
                                      db.query(
                                        "UPDATE penyimpanan SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id = ?",
                                        [
                                          updatedPenyimpanan.stok,
                                          updatedPenyimpanan.alb,
                                          updatedPenyimpanan.kadar_air,
                                          updatedPenyimpanan.kadar_kotoran,
                                          updatedPenyimpanan.do,
                                          updatedPenyimpanan.hi,
                                          p.id,
                                        ]
                                      );
                                    });

                                    const totalPenyimpanan = currentPenyimpanan.reduce(
                                      (acc, p) => ({
                                        stok:
                                          acc.stok +
                                          (p.hi
                                            ? Number(p.stok) - Number(p.hi)
                                            : Number(p.stok)),
                                        alb: acc.alb + Number(p.alb),
                                        kadar_air:
                                          acc.kadar_air + Number(p.kadar_air),
                                        kadar_kotoran:
                                          acc.kadar_kotoran +
                                          Number(p.kadar_kotoran),
                                        do:
                                          acc.do +
                                          (p.do ? Number(p.do) : Number(p.do)),
                                        hi:
                                          acc.hi +
                                          (p.hi ? Number(p.hi) : Number(p.hi)),
                                      }),
                                      {
                                        stok: prevPenyimpanan.reduce(
                                          (acc, p) => acc + Number(p.stok),
                                          0
                                        ),
                                        alb: prevPenyimpanan.reduce(
                                          (acc, p) => acc + Number(p.alb),
                                          0
                                        ),
                                        kadar_air: prevPenyimpanan.reduce(
                                          (acc, p) => acc + Number(p.kadar_air),
                                          0
                                        ),
                                        kadar_kotoran: prevPenyimpanan.reduce(
                                          (acc, p) =>
                                            acc + Number(p.kadar_kotoran),
                                          0
                                        ),
                                        do: prevPenyimpanan.reduce(
                                          (acc, p) => acc + Number(p.do),
                                          0
                                        ),
                                        hi: prevPenyimpanan.reduce(
                                          (acc, p) => acc + Number(p.hi),
                                          0
                                        ),
                                      }
                                    );
                                    db.query(
                                      "UPDATE jumlah_total SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id_kategori = ?",
                                      [
                                        totalPenyimpanan.stok,
                                        totalPenyimpanan.alb,
                                        totalPenyimpanan.kadar_air,
                                        totalPenyimpanan.kadar_kotoran,
                                        totalPenyimpanan.do,
                                        totalPenyimpanan.hi,
                                        kat.id,
                                      ]
                                    );
                                  }
                                );
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          }
        );
      });
    }
  );
};


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

// GET all data
app.get("/data_penyimpanan", (req, res) => {
  const sql = `
    SELECT dp.id,
           DATE_FORMAT(dp.tanggal, '%Y-%m-%d') AS tanggal,  -- Normalisasi ke YYYY-MM-DD
           dp.lokasi, 
           pk.nilai_pkm, pk.nilai_do AS pkm_do, pk.nilai_hi AS pkm_hi,
           k.stok AS kernel_stok, k.alb AS kernel_alb, k.kadar_air AS kernel_kadar_air, 
           k.kadar_kotoran AS kernel_kadar_kotoran, k.do AS kernel_do, k.hi AS kernel_hi,
           ka.id AS kategori_id, ka.nama_kategori,
           p.id AS penyimpanan_id, p.jenis_tank, p.stok AS penyimpanan_stok, 
           p.alb AS penyimpanan_alb, p.kadar_air AS penyimpanan_kadar_air, 
           p.kadar_kotoran AS penyimpanan_kadar_kotoran, p.do AS penyimpanan_do, 
           p.hi AS penyimpanan_hi,
           jt.stok AS jumlah_stok, jt.alb AS jumlah_alb, jt.kadar_air AS jumlah_kadar_air, 
           jt.kadar_kotoran AS jumlah_kadar_kotoran, jt.do AS jumlah_do, jt.hi AS jumlah_hi
    FROM data_penyimpanan dp
    LEFT JOIN data_pkm pk ON pk.id_penyimpanan = dp.id
    LEFT JOIN kernel k ON k.id_penyimpanan = dp.id
    LEFT JOIN kategori ka ON ka.id_penyimpanan = dp.id
    LEFT JOIN penyimpanan p ON p.id_kategori = ka.id
    LEFT JOIN jumlah_total jt ON jt.id_kategori = ka.id`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json(err);
    }

    console.log("Raw results from database:", results); // Debugging hasil mentah

    const dataMap = {};
    results.forEach((row) => {
      if (!dataMap[row.id]) {
        dataMap[row.id] = {
          id: row.id,
          tanggal: row.tanggal, // Sudah dalam format YYYY-MM-DD dari query
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
          kategori: {},
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
          },
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

    const responseData = Object.values(dataMap);
    console.log("Data yang dikirim ke frontend:", responseData); // Debugging data akhir
    res.json(responseData);
  });
});

// PUT update data
app.put("/data_penyimpanan/:id", (req, res) => {
  const { id } = req.params;
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  // Update data_penyimpanan
  db.query(
    "UPDATE data_penyimpanan SET tanggal = ?, lokasi = ? WHERE id = ?",
    [tanggal, lokasi, id],
    (err) => {
      if (err) return res.status(500).json(err);

      // Update data_pkm
      db.query(
        "UPDATE data_pkm SET nilai_pkm = ?, nilai_do = ?, nilai_hi = ? WHERE id_penyimpanan = ?",
        [pkm.nilai_pkm, pkm.nilai_do, pkm.nilai_hi, id],
        (err) => {
          if (err) return res.status(500).json(err);

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
              if (err) return res.status(500).json(err);

              // Update kategori dan penyimpanan
              kategori.forEach((kat) => {
                db.query(
                  "UPDATE kategori SET nama_kategori = ? WHERE id_penyimpanan = ? AND nama_kategori = ?",
                  [kat.nama, id, kat.nama],
                  (err) => {
                    if (err) return res.status(500).json(err);

                    kat.penyimpanan.forEach((p) => {
                      db.query(
                        "UPDATE penyimpanan SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id_kategori = (SELECT id FROM kategori WHERE id_penyimpanan = ? AND nama_kategori = ?) AND jenis_tank = ?",
                        [
                          p.stok,
                          p.alb,
                          p.kadar_air,
                          p.kadar_kotoran,
                          p.do,
                          p.hi,
                          id,
                          kat.nama,
                          p.jenis_tank,
                        ]
                      );
                    });

                    const jumlah = kat.penyimpanan.reduce(
                      (acc, p) => ({
                        stok: acc.stok + Number(p.stok),
                        alb: acc.alb + Number(p.alb),
                        kadar_air: acc.kadar_air + Number(p.kadar_air),
                        kadar_kotoran: acc.kadar_kotoran + Number(p.kadar_kotoran),
                        do: acc.do + Number(p.do),
                        hi: acc.hi + Number(p.hi),
                      }),
                      { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 }
                    );
                    db.query(
                      "UPDATE jumlah_total SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id_kategori = (SELECT id FROM kategori WHERE id_penyimpanan = ? AND nama_kategori = ?)",
                      [
                        jumlah.stok,
                        jumlah.alb,
                        jumlah.kadar_air,
                        jumlah.kadar_kotoran,
                        jumlah.do,
                        jumlah.hi,
                        id,
                        kat.nama,
                      ]
                    );
                  }
                );
              });

              // Perbarui data berikutnya setelah perubahan
              updateFollowingData(lokasi, tanggal, db);
              res.json({ message: "Data berhasil diperbarui" });
            }
          );
        }
      );
    }
  );
});


// DELETE data
app.delete("/data_penyimpanan/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT tanggal, lokasi FROM data_penyimpanan WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      const { tanggal, lokasi } = result[0];
      db.query(
        "DELETE FROM data_penyimpanan WHERE id = ?",
        [id],
        (err, deleteResult) => {
          if (err) return res.status(500).json(err);

          // Perbarui data berikutnya setelah penghapusan
          updateFollowingData(lokasi, tanggal, db);
          res.json({ message: "Data berhasil dihapus" });
        }
      );
    }
  );
});


app.post("/penyimpanan", (req, res) => {
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  db.query(
    "SELECT * FROM data_penyimpanan WHERE lokasi = ? AND tanggal < ? ORDER BY tanggal DESC LIMIT 1",
    [lokasi, tanggal],
    (err, results) => {
      if (err) return res.status(500).json(err);

      let totalPkm = {
        nilai_pkm: pkm.nilai_hi
          ? Number(pkm.nilai_pkm) - Number(pkm.nilai_hi)
          : Number(pkm.nilai_pkm),
        nilai_do: Number(pkm.nilai_do),
        nilai_hi: Number(pkm.nilai_hi),
      };

      let totalKernel = {
        stok: kernel.hi
          ? Number(kernel.stok) - Number(kernel.hi)
          : Number(kernel.stok),
        alb: Number(kernel.alb),
        kadar_air: Number(kernel.kadar_air),
        kadar_kotoran: Number(kernel.kadar_kotoran),
        do: Number(kernel.do),
        hi: Number(kernel.hi),
      };

      let totalKategori = kategori.map((kat) => {
        const adjustedPenyimpanan = kat.penyimpanan.map((p) => ({
          jenis_tank: p.jenis_tank,
          stok: p.hi ? Number(p.stok) - Number(p.hi) : Number(p.stok),
          alb: Number(p.alb),
          kadar_air: Number(p.kadar_air),
          kadar_kotoran: Number(p.kadar_kotoran),
          do: Number(p.do),
          hi: Number(p.hi),
        }));

        const penyimpananTotals = adjustedPenyimpanan.reduce(
          (acc, p) => ({
            stok: acc.stok + Number(p.stok),
            alb: acc.alb + Number(p.alb),
            kadar_air: acc.kadar_air + Number(p.kadar_air),
            kadar_kotoran: acc.kadar_kotoran + Number(p.kadar_kotoran),
            do: acc.do + Number(p.do),
            hi: acc.hi + Number(p.hi),
          }),
          { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 }
        );

        return {
          nama: kat.nama,
          jumlah: penyimpananTotals,
          penyimpanan: adjustedPenyimpanan,
        };
      });

      if (results.length > 0) {
        const previousId = results[0].id;

        db.query(
          "SELECT * FROM data_pkm WHERE id_penyimpanan = ?",
          [previousId],
          (err, pkmResults) => {
            if (err) return res.status(500).json(err);
            if (pkmResults.length > 0) {
              totalPkm.nilai_pkm += Number(pkmResults[0].nilai_pkm);
              totalPkm.nilai_do = pkm.nilai_do
                ? Number(pkm.nilai_do)
                : totalPkm.nilai_do + Number(pkmResults[0].nilai_do);
              totalPkm.nilai_hi = pkm.nilai_hi
                ? Number(pkm.nilai_hi)
                : totalPkm.nilai_hi + Number(pkmResults[0].nilai_hi);
            }

            db.query(
              "SELECT * FROM kernel WHERE id_penyimpanan = ?",
              [previousId],
              (err, kernelResults) => {
                if (err) return res.status(500).json(err);
                if (kernelResults.length > 0) {
                  totalKernel.stok += Number(kernelResults[0].stok);
                  totalKernel.alb += Number(kernelResults[0].alb);
                  totalKernel.kadar_air += Number(kernelResults[0].kadar_air);
                  totalKernel.kadar_kotoran += Number(
                    kernelResults[0].kadar_kotoran
                  );
                  totalKernel.do = kernel.do
                    ? Number(kernel.do)
                    : totalKernel.do + Number(kernelResults[0].do);
                  totalKernel.hi = kernel.hi
                    ? Number(kernel.hi)
                    : totalKernel.hi + Number(kernelResults[0].hi);
                }

                db.query(
                  "SELECT * FROM kategori WHERE id_penyimpanan = ?",
                  [previousId],
                  (err, kategoriResults) => {
                    if (err) return res.status(500).json(err);

                    let kategoriMap = new Map();
                    let penyimpananMap = new Map();

                    kategoriResults.forEach((katPrev) => {
                      const existingCategory = totalKategori.find(
                        (k) => k.nama === katPrev.nama_kategori
                      );

                      if (existingCategory) {
                        db.query(
                          "SELECT * FROM jumlah_total WHERE id_kategori = ?",
                          [katPrev.id],
                          (err, jumlahResults) => {
                            if (err) return res.status(500).json(err);
                            if (jumlahResults.length > 0) {
                              existingCategory.jumlah.stok += Number(
                                jumlahResults[0].stok
                              );
                              existingCategory.jumlah.alb += Number(
                                jumlahResults[0].alb
                              );
                              existingCategory.jumlah.kadar_air += Number(
                                jumlahResults[0].kadar_air
                              );
                              existingCategory.jumlah.kadar_kotoran += Number(
                                jumlahResults[0].kadar_kotoran
                              );
                              existingCategory.jumlah.do += Number(
                                jumlahResults[0].do
                              );
                              existingCategory.jumlah.hi += Number(
                                jumlahResults[0].hi
                              );
                            }
                          }
                        );
                      } else {
                        totalKategori.push({
                          nama: katPrev.nama_kategori,
                          jumlah: {
                            stok: 0,
                            alb: 0,
                            kadar_air: 0,
                            kadar_kotoran: 0,
                            do: 0,
                            hi: 0,
                          },
                          penyimpanan: [],
                        });
                      }
                      kategoriMap.set(katPrev.id, {
                        id: katPrev.id,
                        nama: katPrev.nama_kategori,
                      });
                    });

                    db.query(
                      "SELECT * FROM penyimpanan WHERE id_kategori IN (?)",
                      [Array.from(kategoriMap.keys())],
                      (err, penyimpananResults) => {
                        if (err) return res.status(500).json(err);

                        penyimpananResults.forEach((pPrev) => {
                          let kategoriNama = kategoriMap.get(pPrev.id_kategori).nama;
                          if (!penyimpananMap.has(kategoriNama)) {
                            penyimpananMap.set(kategoriNama, []);
                          }
                          penyimpananMap.get(kategoriNama).push({
                            jenis_tank: pPrev.jenis_tank,
                            stok: pPrev.hi
                              ? Number(pPrev.stok) - Number(pPrev.hi)
                              : Number(pPrev.stok),
                            alb: Number(pPrev.alb),
                            kadar_air: Number(pPrev.kadar_air),
                            kadar_kotoran: Number(pPrev.kadar_kotoran),
                            do: Number(pPrev.do),
                            hi: Number(pPrev.hi),
                          });
                        });

                        totalKategori.forEach((kat) => {
                          let previousPenyimpanan = penyimpananMap.get(kat.nama) || [];
                          previousPenyimpanan.forEach((pPrev) => {
                            let existingPenyimpanan = kat.penyimpanan.find(
                              (p) => p.jenis_tank === pPrev.jenis_tank
                            );
                            if (existingPenyimpanan) {
                              existingPenyimpanan.stok += pPrev.hi
                                ? Number(pPrev.stok) - Number(pPrev.hi)
                                : Number(pPrev.stok);
                              existingPenyimpanan.alb += pPrev.alb;
                              existingPenyimpanan.kadar_air += pPrev.kadar_air;
                              existingPenyimpanan.kadar_kotoran +=
                                pPrev.kadar_kotoran;
                              existingPenyimpanan.do = existingPenyimpanan.do
                                ? Number(existingPenyimpanan.do)
                                : existingPenyimpanan.do + pPrev.do;
                              existingPenyimpanan.hi = existingPenyimpanan.hi
                                ? Number(existingPenyimpanan.hi)
                                : existingPenyimpanan.hi + pPrev.hi;
                            } else {
                              kat.penyimpanan.push({
                                jenis_tank: pPrev.jenis_tank,
                                stok: pPrev.hi
                                  ? Number(pPrev.stok) - Number(pPrev.hi)
                                  : Number(pPrev.stok),
                                alb: Number(pPrev.alb),
                                kadar_air: Number(pPrev.kadar_air),
                                kadar_kotoran: Number(pPrev.kadar_kotoran),
                                do: Number(pPrev.do),
                                hi: Number(pPrev.hi),
                              });
                            }
                          });

                          kat.jumlah = kat.penyimpanan.reduce(
                            (acc, p) => ({
                              stok: acc.stok + Number(p.stok),
                              alb: acc.alb + Number(p.alb),
                              kadar_air: acc.kadar_air + Number(p.kadar_air),
                              kadar_kotoran:
                                acc.kadar_kotoran + Number(p.kadar_kotoran),
                              do: acc.do + Number(p.do),
                              hi: acc.hi + Number(p.hi),
                            }),
                            { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 }
                          );
                        });

                        db.query(
                          "INSERT INTO data_penyimpanan (tanggal, lokasi) VALUES (?, ?)",
                          [tanggal, lokasi],
                          (err, result) => {
                            if (err) return res.status(500).json(err);
                            const penyimpananId = result.insertId;

                            db.query(
                              "INSERT INTO data_pkm (id_penyimpanan, nilai_pkm, nilai_do, nilai_hi) VALUES (?, ?, ?, ?)",
                              [
                                penyimpananId,
                                totalPkm.nilai_pkm,
                                totalPkm.nilai_do,
                                totalPkm.nilai_hi,
                              ]
                            );

                            db.query(
                              "INSERT INTO kernel (id_penyimpanan, stok, alb, kadar_air, kadar_kotoran, do, hi) VALUES (?, ?, ?, ?, ?, ?, ?)",
                              [
                                penyimpananId,
                                totalKernel.stok,
                                totalKernel.alb,
                                totalKernel.kadar_air,
                                totalKernel.kadar_kotoran,
                                totalKernel.do,
                                totalKernel.hi,
                              ]
                            );

                            totalKategori.forEach((kat) => {
                              db.query(
                                "INSERT INTO kategori (id_penyimpanan, nama_kategori) VALUES (?, ?)",
                                [penyimpananId, kat.nama],
                                (err, result) => {
                                  if (err) return res.status(500).json(err);
                                  const kategoriId = result.insertId;

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

                            res.json({
                              message: "Data berhasil diperbarui dan ditambahkan.",
                            });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      } else {
        db.query(
          "INSERT INTO data_penyimpanan (tanggal, lokasi) VALUES (?, ?)",
          [tanggal, lokasi],
          (err, result) => {
            if (err) return res.status(500).json(err);
            const penyimpananId = result.insertId;

            db.query(
              "INSERT INTO data_pkm (id_penyimpanan, nilai_pkm, nilai_do, nilai_hi) VALUES (?, ?, ?, ?)",
              [
                penyimpananId,
                totalPkm.nilai_pkm,
                totalPkm.nilai_do,
                totalPkm.nilai_hi,
              ]
            );

            db.query(
              "INSERT INTO kernel (id_penyimpanan, stok, alb, kadar_air, kadar_kotoran, do, hi) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                penyimpananId,
                totalKernel.stok,
                totalKernel.alb,
                totalKernel.kadar_air,
                totalKernel.kadar_kotoran,
                totalKernel.do,
                totalKernel.hi,
              ]
            );

            totalKategori.forEach((kat) => {
              db.query(
                "INSERT INTO kategori (id_penyimpanan, nama_kategori) VALUES (?, ?)",
                [penyimpananId, kat.nama],
                (err, result) => {
                  if (err) return res.status(500).json(err);
                  const kategoriId = result.insertId;

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

            res.json({
              message: "Data berhasil ditambahkan.",
            });
          }
        );
      }
    }
  );
});





// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
