// Api untuk input penyimpanan
app.post("/penyimpanan", (req, res) => {
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  // Cari tanggal sebelumnya di lokasi yang sama
  db.query(
    "SELECT id FROM data_penyimpanan WHERE lokasi = ? AND tanggal < ? ORDER BY tanggal DESC LIMIT 1",
    [lokasi, tanggal],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length > 0) {
        // Jika ada data sebelumnya, ambil ID penyimpanan sebelumnya
        const previousId = results[0].id;

        // Update nilai di tabel PKM
        db.query(
          "UPDATE data_pkm SET nilai_pkm = nilai_pkm + ?, nilai_do = nilai_do + ?, nilai_hi = nilai_hi + ? WHERE id_penyimpanan = ?",
          [pkm.nilai_pkm, pkm.nilai_do, pkm.nilai_hi, previousId]
        );

        // Update nilai di tabel Kernel
        db.query(
          "UPDATE kernel SET stok = stok + ?, alb = alb + ?, kadar_air = kadar_air + ?, kadar_kotoran = kadar_kotoran + ?, do = do + ?, hi = hi + ? WHERE id_penyimpanan = ?",
          [
            kernel.stok,
            kernel.alb,
            kernel.kadar_air,
            kernel.kadar_kotoran,
            kernel.do,
            kernel.hi,
            previousId,
          ]
        );

        // Update nilai untuk setiap kategori
        kategori.forEach((kat) => {
          db.query(
            "SELECT id FROM kategori WHERE id_penyimpanan = ? AND nama_kategori = ?",
            [previousId, kat.nama],
            (err, katResults) => {
              if (err) return res.status(500).json(err);

              if (katResults.length > 0) {
                const kategoriId = katResults[0].id;

                // Update nilai penyimpanan
                kat.penyimpanan.forEach((p) => {
                  db.query(
                    "UPDATE penyimpanan SET stok = stok + ?, alb = alb + ?, kadar_air = kadar_air + ?, kadar_kotoran = kadar_kotoran + ?, do = do + ?, hi = hi + ? WHERE id_kategori = ? AND jenis_tank = ?",
                    [
                      p.stok,
                      p.alb,
                      p.kadar_air,
                      p.kadar_kotoran,
                      p.do,
                      p.hi,
                      kategoriId,
                      p.jenis_tank,
                    ]
                  );
                });

                // Update jumlah total
                db.query(
                  "UPDATE jumlah_total SET stok = stok + ?, alb = alb + ?, kadar_air = kadar_air + ?, kadar_kotoran = kadar_kotoran + ?, do = do + ?, hi = hi + ? WHERE id_kategori = ?",
                  [
                    kat.jumlah.stok,
                    kat.jumlah.alb,
                    kat.jumlah.kadar_air,
                    kat.jumlah.kadar_kotoran,
                    kat.jumlah.do,
                    kat.jumlah.hi,
                    kategoriId,
                  ]
                );
              }
            }
          );
        });

        return res.json({ message: "Data sebelumnya diperbarui dengan data baru" });
      } else {
        // Jika tidak ada data sebelumnya, masukkan data baru seperti biasa
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

            kategori.forEach((kat) => {
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

            res.json({ message: "Data baru berhasil ditambahkan" });
          }
        );
      }
    }
  );
});
