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
  database: "pencatatan_ptpn_db_v3", // Ganti dengan nama database Anda
});

db.connect((err) => {
  if (err) throw err;
  console.log("Terhubung ke database MySQL");
});

const clusters = {
  "Bekri": [
    {
      nama: "CPO",
      penyimpanan: [
        { jenis_tank: "Storage Tank VI", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank VII", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank VIII", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank IX", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
      ],
    },
    {
      nama: "PKO",
      penyimpanan: [
        { jenis_tank: "Tangki I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Tangki III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Tangki IV", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Tangki V", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Tangki IX", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
      ],
    },
  ],
  "Betung": [
    {
      nama: "CPO",
      penyimpanan: [
        { jenis_tank: "Storage Tank I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
      ],
    },
    {
      nama: "PKO",
      penyimpanan: [
        { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank IV", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank V", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
      ],
    },
  ],
  "Talang Sawit": [
    {
      nama: "CPO",
      penyimpanan: [
        { jenis_tank: "Storage Tank I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
      ],
    },
  ],
  "Sungai Lengi": [
    {
      nama: "CPO",
      penyimpanan: [
        { jenis_tank: "Storage Tank I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
      ],
    },
    {
      nama: "Kernel Lengi",
      penyimpanan: [
        { jenis_tank: "Gudang Repa", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Gudang Pabrik", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
      ],
    },
  ],
  "IPMG Boom Baru": [
    {
      nama: "CPO",
      penyimpanan: [
        { jenis_tank: "Storage Tank I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        { jenis_tank: "Storage Tank IV", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
      ],
    },
  ],
};

// // Fungsi untuk memperbarui data berikutnya
// const updateFollowingData = (lokasi, changedDate, db) => {
//   db.query(
//     "SELECT * FROM data_penyimpanan WHERE lokasi = ? AND tanggal > ? ORDER BY tanggal ASC",
//     [lokasi, changedDate],
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching following data:", err);
//         return;
//       }
//       if (results.length === 0) return;

//       results.forEach((entry) => {
//         const currentDate = entry.tanggal;
//         db.query(
//           "SELECT * FROM data_penyimpanan WHERE lokasi = ? AND tanggal < ? ORDER BY tanggal DESC LIMIT 1",
//           [lokasi, currentDate],
//           (err, prevResults) => {
//             if (err) {
//               console.error("Error fetching previous data:", err);
//               return;
//             }

//             const prevId = prevResults.length > 0 ? prevResults[0].id : null;
//             let basePkm = { nilai_pkm: 0, nilai_do: 0, nilai_hi: 0 };
//             let baseKernel = {
//               stok: 0,
//               alb: 0,
//               kadar_air: 0,
//               kadar_kotoran: 0,
//               do: 0,
//               hi: 0,
//             };
//             let baseKategori = {};

//             if (prevId) {
//               db.query(
//                 "SELECT * FROM data_pkm WHERE id_penyimpanan = ?",
//                 [prevId],
//                 (err, pkmResults) => {
//                   if (pkmResults.length > 0) {
//                     basePkm = pkmResults[0];
//                   }

//                   db.query(
//                     "SELECT * FROM kernel WHERE id_penyimpanan = ?",
//                     [prevId],
//                     (err, kernelResults) => {
//                       if (kernelResults.length > 0) {
//                         baseKernel = kernelResults[0];
//                       }

//                       db.query(
//                         "SELECT * FROM kategori WHERE id_penyimpanan = ?",
//                         [prevId],
//                         (err, kategoriResults) => {
//                           kategoriResults.forEach((kat) => {
//                             db.query(
//                               "SELECT * FROM penyimpanan WHERE id_kategori = ?",
//                               [kat.id],
//                               (err, penyimpananResults) => {
//                                 baseKategori[kat.nama_kategori] = penyimpananResults;
//                               }
//                             );
//                           });

//                           db.query(
//                             "SELECT * FROM data_pkm WHERE id_penyimpanan = ?",
//                             [entry.id],
//                             (err, currentPkm) => {
//                               if (currentPkm.length > 0) {
//                                 const updatedPkm = {
//                                   nilai_pkm:
//                                     basePkm.nilai_pkm +
//                                     (currentPkm[0].nilai_hi
//                                       ? Number(currentPkm[0].nilai_pkm) -
//                                         Number(currentPkm[0].nilai_hi)
//                                       : Number(currentPkm[0].nilai_pkm)),
//                                   nilai_do: currentPkm[0].nilai_do
//                                     ? Number(currentPkm[0].nilai_do)
//                                     : Number(basePkm.nilai_do) +
//                                       Number(currentPkm[0].nilai_do),
//                                   nilai_hi: currentPkm[0].nilai_hi
//                                     ? Number(currentPkm[0].nilai_hi)
//                                     : Number(basePkm.nilai_hi) +
//                                       Number(currentPkm[0].nilai_hi),
//                                 };
//                                 db.query(
//                                   "UPDATE data_pkm SET nilai_pkm = ?, nilai_do = ?, nilai_hi = ? WHERE id_penyimpanan = ?",
//                                   [
//                                     updatedPkm.nilai_pkm,
//                                     updatedPkm.nilai_do,
//                                     updatedPkm.nilai_hi,
//                                     entry.id,
//                                   ]
//                                 );
//                               }
//                             }
//                           );

//                           db.query(
//                             "SELECT * FROM kernel WHERE id_penyimpanan = ?",
//                             [entry.id],
//                             (err, currentKernel) => {
//                               if (currentKernel.length > 0) {
//                                 const updatedKernel = {
//                                   stok:
//                                     baseKernel.stok +
//                                     (currentKernel[0].hi
//                                       ? Number(currentKernel[0].stok) -
//                                         Number(currentKernel[0].hi)
//                                       : Number(currentKernel[0].stok)),
//                                   alb:
//                                     baseKernel.alb +
//                                     Number(currentKernel[0].alb),
//                                   kadar_air:
//                                     baseKernel.kadar_air +
//                                     Number(currentKernel[0].kadar_air),
//                                   kadar_kotoran:
//                                     baseKernel.kadar_kotoran +
//                                     Number(currentKernel[0].kadar_kotoran),
//                                   do: currentKernel[0].do
//                                     ? Number(currentKernel[0].do)
//                                     : Number(baseKernel.do) +
//                                       Number(currentKernel[0].do),
//                                   hi: currentKernel[0].hi
//                                     ? Number(currentKernel[0].hi)
//                                     : Number(baseKernel.hi) +
//                                       Number(currentKernel[0].hi),
//                                 };
//                                 db.query(
//                                   "UPDATE kernel SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id_penyimpanan = ?",
//                                   [
//                                     updatedKernel.stok,
//                                     updatedKernel.alb,
//                                     updatedKernel.kadar_air,
//                                     updatedKernel.kadar_kotoran,
//                                     updatedKernel.do,
//                                     updatedKernel.hi,
//                                     entry.id,
//                                   ]
//                                 );
//                               }
//                             }
//                           );

//                           db.query(
//                             "SELECT * FROM kategori WHERE id_penyimpanan = ?",
//                             [entry.id],
//                             (err, currentKategori) => {
//                               currentKategori.forEach((kat) => {
//                                 db.query(
//                                   "SELECT * FROM penyimpanan WHERE id_kategori = ?",
//                                   [kat.id],
//                                   (err, currentPenyimpanan) => {
//                                     const prevPenyimpanan =
//                                       baseKategori[kat.nama_kategori] || [];
//                                     currentPenyimpanan.forEach((p) => {
//                                       const prevP = prevPenyimpanan.find(
//                                         (prev) => prev.jenis_tank === p.jenis_tank
//                                       ) || {
//                                         stok: 0,
//                                         alb: 0,
//                                         kadar_air: 0,
//                                         kadar_kotoran: 0,
//                                         do: 0,
//                                         hi: 0,
//                                       };
//                                       const updatedPenyimpanan = {
//                                         stok:
//                                           prevP.stok +
//                                           (p.hi
//                                             ? Number(p.stok) - Number(p.hi)
//                                             : Number(p.stok)),
//                                         alb: prevP.alb + Number(p.alb),
//                                         kadar_air:
//                                           prevP.kadar_air + Number(p.kadar_air),
//                                         kadar_kotoran:
//                                           prevP.kadar_kotoran +
//                                           Number(p.kadar_kotoran),
//                                         do: p.do
//                                           ? Number(p.do)
//                                           : Number(prevP.do) + Number(p.do),
//                                         hi: p.hi
//                                           ? Number(p.hi)
//                                           : Number(prevP.hi) + Number(p.hi),
//                                       };
//                                       db.query(
//                                         "UPDATE penyimpanan SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id = ?",
//                                         [
//                                           updatedPenyimpanan.stok,
//                                           updatedPenyimpanan.alb,
//                                           updatedPenyimpanan.kadar_air,
//                                           updatedPenyimpanan.kadar_kotoran,
//                                           updatedPenyimpanan.do,
//                                           updatedPenyimpanan.hi,
//                                           p.id,
//                                         ]
//                                       );
//                                     });

//                                     const totalPenyimpanan = currentPenyimpanan.reduce(
//                                       (acc, p) => ({
//                                         stok:
//                                           acc.stok +
//                                           (p.hi
//                                             ? Number(p.stok) - Number(p.hi)
//                                             : Number(p.stok)),
//                                         alb: acc.alb + Number(p.alb),
//                                         kadar_air:
//                                           acc.kadar_air + Number(p.kadar_air),
//                                         kadar_kotoran:
//                                           acc.kadar_kotoran +
//                                           Number(p.kadar_kotoran),
//                                         do:
//                                           acc.do +
//                                           (p.do ? Number(p.do) : Number(p.do)),
//                                         hi:
//                                           acc.hi +
//                                           (p.hi ? Number(p.hi) : Number(p.hi)),
//                                       }),
//                                       {
//                                         stok: prevPenyimpanan.reduce(
//                                           (acc, p) => acc + Number(p.stok),
//                                           0
//                                         ),
//                                         alb: prevPenyimpanan.reduce(
//                                           (acc, p) => acc + Number(p.alb),
//                                           0
//                                         ),
//                                         kadar_air: prevPenyimpanan.reduce(
//                                           (acc, p) => acc + Number(p.kadar_air),
//                                           0
//                                         ),
//                                         kadar_kotoran: prevPenyimpanan.reduce(
//                                           (acc, p) =>
//                                             acc + Number(p.kadar_kotoran),
//                                           0
//                                         ),
//                                         do: prevPenyimpanan.reduce(
//                                           (acc, p) => acc + Number(p.do),
//                                           0
//                                         ),
//                                         hi: prevPenyimpanan.reduce(
//                                           (acc, p) => acc + Number(p.hi),
//                                           0
//                                         ),
//                                       }
//                                     );
//                                     db.query(
//                                       "UPDATE jumlah_total SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ? WHERE id_kategori = ?",
//                                       [
//                                         totalPenyimpanan.stok,
//                                         totalPenyimpanan.alb,
//                                         totalPenyimpanan.kadar_air,
//                                         totalPenyimpanan.kadar_kotoran,
//                                         totalPenyimpanan.do,
//                                         totalPenyimpanan.hi,
//                                         kat.id,
//                                       ]
//                                     );
//                                   }
//                                 );
//                               });
//                             }
//                           );
//                         }
//                       );
//                     }
//                   );
//                 }
//               );
//             }
//           }
//         );
//       });
//     }
//   );
// };


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
           DATE_FORMAT(dp.tanggal, '%Y-%m-%d') AS tanggal,
           dp.lokasi, 
           pk.nilai_pkm, pk.nilai_do AS pkm_do, pk.nilai_hi AS pkm_hi,
           k.stok AS kernel_stok, k.alb AS kernel_alb, k.kadar_air AS kernel_kadar_air, 
           k.kadar_kotoran AS kernel_kadar_kotoran, k.do AS kernel_do, k.hi AS kernel_hi,
           p.id AS penyimpanan_id, p.nama_kategori, p.jenis_tank, p.stok AS penyimpanan_stok, 
           p.alb AS penyimpanan_alb, p.kadar_air AS penyimpanan_kadar_air, 
           p.kadar_kotoran AS penyimpanan_kadar_kotoran, p.do AS penyimpanan_do, 
           p.hi AS penyimpanan_hi
    FROM data_penyimpanan dp
    LEFT JOIN data_pkm pk ON pk.id_penyimpanan = dp.id
    LEFT JOIN kernel k ON k.id_penyimpanan = dp.id
    LEFT JOIN penyimpanan p ON p.id_penyimpanan = dp.id`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json(err);
    }

    console.log("Raw results from database:", results);

    const dataMap = {};
    results.forEach((row) => {
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
          kategori: {},
        };
      }

      if (row.penyimpanan_id) {
        const namaKategori = row.nama_kategori || "default";
        if (!dataMap[row.id].kategori[namaKategori]) {
          dataMap[row.id].kategori[namaKategori] = {
            nama: namaKategori,
            penyimpanan: [],
            jumlah: {
              stok: 0,
              alb: 0,
              kadar_air: 0,
              kadar_kotoran: 0,
              do: 0,
              hi: 0,
            },
          };
        }

        const penyimpananData = {
          jenis_tank: row.jenis_tank,
          stok: row.penyimpanan_stok,
          alb: row.penyimpanan_alb,
          kadar_air: row.penyimpanan_kadar_air,
          kadar_kotoran: row.penyimpanan_kadar_kotoran,
          do: row.penyimpanan_do,
          hi: row.penyimpanan_hi,
        };

        dataMap[row.id].kategori[namaKategori].penyimpanan.push(penyimpananData);

        // Hitung total
        dataMap[row.id].kategori[namaKategori].jumlah.stok += Number(row.penyimpanan_stok) || 0;
        dataMap[row.id].kategori[namaKategori].jumlah.alb += Number(row.penyimpanan_alb) || 0;
        dataMap[row.id].kategori[namaKategori].jumlah.kadar_air += Number(row.penyimpanan_kadar_air) || 0;
        dataMap[row.id].kategori[namaKategori].jumlah.kadar_kotoran += Number(row.penyimpanan_kadar_kotoran) || 0;
        dataMap[row.id].kategori[namaKategori].jumlah.do += Number(row.penyimpanan_do) || 0;
        dataMap[row.id].kategori[namaKategori].jumlah.hi += Number(row.penyimpanan_hi) || 0;
      }
    });

    const responseData = Object.values(dataMap);
    console.log("Data yang dikirim ke frontend:", responseData);
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


app.delete("/penyimpanan/:tanggal/:lokasi", async (req, res) => {
  const { tanggal, lokasi } = req.params;

  console.log(`Delete request - tanggal: ${tanggal}, lokasi: ${lokasi}`);

  try {
    await new Promise((resolve, reject) => {
      db.query("START TRANSACTION", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Ambil id_penyimpanan yang akan dihapus
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM data_penyimpanan WHERE tanggal = ? AND lokasi = ?",
        [tanggal, lokasi],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (result.length === 0) {
      throw new Error(`Data untuk tanggal ${tanggal} dan lokasi ${lokasi} tidak ditemukan`);
    }

    const id_penyimpanan = result[0].id;

    // Panggil Stored Procedure untuk menyesuaikan stok setelah penghapusan
    await new Promise((resolve, reject) => {
      db.query(
        "CALL AdjustStockAfterDelete(?, ?)",
        [id_penyimpanan, lokasi],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Hapus data dari semua tabel terkait
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM penyimpanan WHERE id_penyimpanan = ?",
        [id_penyimpanan],
        (err) => (err ? reject(err) : resolve())
      );
    });

    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM kernel WHERE id_penyimpanan = ?",
        [id_penyimpanan],
        (err) => (err ? reject(err) : resolve())
      );
    });

    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM data_pkm WHERE id_penyimpanan = ?",
        [id_penyimpanan],
        (err) => (err ? reject(err) : resolve())
      );
    });

    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM data_penyimpanan WHERE id = ?",
        [id_penyimpanan],
        (err) => (err ? reject(err) : resolve())
      );
    });

    await new Promise((resolve, reject) => {
      db.query("COMMIT", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: `Data untuk tanggal ${tanggal} dan lokasi ${lokasi} berhasil dihapus dan stok disesuaikan.` });
  } catch (error) {
    console.error("Error in DELETE /penyimpanan:", error);
    await new Promise((resolve) => {
      db.query("ROLLBACK", (err) => {
        if (err) console.error("Rollback failed:", err);
        resolve();
      });
    });
    res.status(500).json({ error: "Terjadi kesalahan saat menghapus data.", details: error.message });
  }
});

app.post("/penyimpanan", async (req, res) => {
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  console.log("Request body:", JSON.stringify(req.body));

  try {
    await new Promise((resolve, reject) => {
      db.query("START TRANSACTION", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Cek apakah tanggal dan lokasi sudah ada
    const existingResult = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM data_penyimpanan WHERE tanggal = ? AND lokasi = ?",
        [tanggal, lokasi],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    let penyimpananId;
    if (existingResult.length > 0) {
      // Jika tanggal sudah ada, gunakan id_penyimpanan yang ada
      penyimpananId = existingResult[0].id;
      console.log(`Tanggal ${tanggal} sudah ada, menggunakan id_penyimpanan: ${penyimpananId}`);
    } else {
      // Jika tanggal baru, insert ke data_penyimpanan
      const result = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO data_penyimpanan (tanggal, lokasi) VALUES (?, ?)",
          [tanggal, lokasi],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      penyimpananId = result.insertId;
    }

    // Update atau insert data_pkm
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO data_pkm (id_penyimpanan, nilai_pkm, nilai_do, nilai_hi) VALUES (?, ?, ?, ?) " +
        "ON DUPLICATE KEY UPDATE nilai_pkm = VALUES(nilai_pkm), nilai_do = VALUES(nilai_do), nilai_hi = VALUES(nilai_hi)",
        [penyimpananId, pkm.nilai_pkm || 0, pkm.nilai_do || 0, pkm.nilai_hi || 0],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Update atau insert kernel
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO kernel (id_penyimpanan, stok, alb, kadar_air, kadar_kotoran, do, hi) VALUES (?, ?, ?, ?, ?, ?, ?) " +
        "ON DUPLICATE KEY UPDATE stok = VALUES(stok), alb = VALUES(alb), kadar_air = VALUES(kadar_air), " +
        "kadar_kotoran = VALUES(kadar_kotoran), do = VALUES(do), hi = VALUES(hi)",
        [penyimpananId, kernel.stok || 0, kernel.alb || 0, kernel.kadar_air || 0, kernel.kadar_kotoran || 0, kernel.do || 0, kernel.hi || 0],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Ambil preset penyimpanan dari clusters berdasarkan lokasi
    const clusterPenyimpanan = clusters[lokasi];
    if (!clusterPenyimpanan) {
      throw new Error(`Lokasi ${lokasi} tidak ditemukan di clusters`);
    }

    // Buat map dari input kategori untuk mempermudah pencocokan
    const inputMap = new Map();
    for (const kat of kategori || []) {
      for (const p of kat.penyimpanan || []) {
        inputMap.set(`${kat.nama_kategori}-${p.jenis_tank}`, {
          stok: p.stok || 0,
          alb: p.alb || 0,
          kadar_air: p.kadar_air || 0,
          kadar_kotoran: p.kadar_kotoran || 0,
          do: p.do || 0,
          hi: p.hi || 0,
        });
      }
    }

    // Insert atau update semua jenis_tank dari clusters
    for (const clusterKat of clusterPenyimpanan) {
      const nama_kategori = clusterKat.nama;
      for (const presetTank of clusterKat.penyimpanan) {
        const jenis_tank = presetTank.jenis_tank;
        const inputKey = `${nama_kategori}-${jenis_tank}`;
        const inputData = inputMap.get(inputKey) || {
          stok: 0,
          alb: 0,
          kadar_air: 0,
          kadar_kotoran: 0,
          do: 0,
          hi: 0,
        };

        await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO penyimpanan (id_penyimpanan, nama_kategori, jenis_tank, stok, alb, kadar_air, kadar_kotoran, do, hi) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) " +
            "ON DUPLICATE KEY UPDATE stok = VALUES(stok), alb = VALUES(alb), kadar_air = VALUES(kadar_air), " +
            "kadar_kotoran = VALUES(kadar_kotoran), do = VALUES(do), hi = VALUES(hi)",
            [
              penyimpananId,
              nama_kategori,
              jenis_tank,
              inputData.stok,
              inputData.alb,
              inputData.kadar_air,
              inputData.kadar_kotoran,
              inputData.do,
              inputData.hi,
            ],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }
    }

    // Panggil Stored Procedure dengan parameter tanggal
    await new Promise((resolve, reject) => {
      db.query(
        "CALL UpdateStockAfterInsert(?, ?, ?)",
        [penyimpananId, lokasi, tanggal],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    await new Promise((resolve, reject) => {
      db.query("COMMIT", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: "Data berhasil ditambahkan atau diperbarui dan stok diolah oleh database." });
  } catch (error) {
    console.error("Error in POST /penyimpanan:", error);
    await new Promise((resolve) => {
      db.query("ROLLBACK", (err) => {
        if (err) console.error("Rollback failed:", err);
        resolve();
      });
    });
    res.status(500).json({ error: "Terjadi kesalahan saat menyimpan data.", details: error.message });
  }
});

// Endpoint PUT untuk mengedit data penyimpanan
app.put('/penyimpanan/:tanggal/:lokasi', (req, res) => {
  const { tanggal, lokasi } = req.params;
  const { pkm, kernel, kategori } = req.body;

  // Langkah 1: Ambil id_penyimpanan berdasarkan tanggal dan lokasi
  db.query(
    'SELECT id FROM data_penyimpanan WHERE tanggal = ? AND lokasi = ? LIMIT 1',
    [tanggal, lokasi],
    (err, rows) => {
      if (err) {
        console.error('Error fetching id_penyimpanan:', err);
        return res.status(500).json({ error: err.message });
      }
      if (!rows.length) {
        return res.status(404).json({ error: 'Data tidak ditemukan' });
      }
      const id_penyimpanan = rows[0].id;

      // Langkah 2: Update penyimpanan (kategori) terlebih dahulu
      let queriesCompleted = 0;
      const totalPenyimpanan = kategori.reduce((sum, kat) => sum + kat.penyimpanan.length, 0);

      kategori.forEach((kat) => {
        kat.penyimpanan.forEach((peny) => {
          // Pastikan nilai kosong tetap kosong, bukan null, kecuali kolom nullable
          const stok = peny.stok === "" ? null : (peny.stok || 0);
          const alb = peny.alb === "" ? null : (peny.alb || 0);
          const kadar_air = peny.kadar_air === "" ? null : (peny.kadar_air || 0);
          const kadar_kotoran = peny.kadar_kotoran === "" ? null : (peny.kadar_kotoran || 0);
          const do_value = peny.do === "" ? null : (peny.do || 0);
          const hi = peny.hi === "" ? null : (peny.hi || 0);

          db.query(
            `UPDATE penyimpanan 
             SET stok = ?, alb = ?, kadar_air = ?, kadar_kotoran = ?, do = ?, hi = ?
             WHERE id_penyimpanan = ? AND nama_kategori = ? AND jenis_tank = ?`,
            [
              stok,
              alb,
              kadar_air,
              kadar_kotoran,
              do_value,
              hi,
              id_penyimpanan,
              kat.nama_kategori,
              peny.jenis_tank,
            ],
            (err) => {
              if (err) {
                console.error('Error updating penyimpanan:', err);
                return res.status(500).json({ error: err.message });
              }
              queriesCompleted++;
              if (queriesCompleted === totalPenyimpanan) {
                // Langkah 3: Panggil stored procedure untuk menyesuaikan stok
                db.query(
                  'CALL UpdateStockAfterEdit(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  [
                    id_penyimpanan,
                    lokasi,
                    tanggal,
                    pkm.nilai_pkm === "" ? null : (pkm.nilai_pkm || 0),
                    pkm.nilai_do === "" ? null : (pkm.nilai_do || 0),
                    pkm.nilai_hi === "" ? null : (pkm.nilai_hi || 0),
                    kernel.stok === "" ? null : (kernel.stok || 0),
                    kernel.alb === "" ? null : (kernel.alb || 0),
                    kernel.kadar_air === "" ? null : (kernel.kadar_air || 0),
                    kernel.kadar_kotoran === "" ? null : (kernel.kadar_kotoran || 0),
                    kernel.do === "" ? null : (kernel.do || 0),
                    kernel.hi === "" ? null : (kernel.hi || 0),
                  ],
                  (err) => {
                    if (err) {
                      console.error('Error calling UpdateStockAfterEdit:', err);
                      return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Data berhasil diperbarui' });
                  }
                );
              }
            }
          );
        });
      });
    }
  );
});
// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
