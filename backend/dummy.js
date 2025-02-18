// Api untuk input penyimpanan
app.post("/penyimpanan", (req, res) => {
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  // 1. Cek apakah sudah ada data dengan lokasi yang sama pada tanggal sebelumnya
  db.query(
    "SELECT * FROM data_penyimpanan WHERE lokasi = ? AND tanggal = ?",
    [lokasi, tanggal],
    (err, existingData) => {
      if (err) return res.status(500).json(err);

      if (existingData.length > 0) {
        // 2. Jika ada, ambil ID penyimpanan yang sudah ada
        const existingPenyimpananId = existingData[0].id_penyimpanan;

        // 3. Update data pkm, kernel, kategori, dan penyimpanan yang ada
        // Update data_pkm
        db.query(
          "UPDATE data_pkm SET nilai_pkm = nilai_pkm + ?, nilai_do = nilai_do + ?, nilai_hi = nilai_hi + ? WHERE id_penyimpanan = ?",
          [pkm.nilai_pkm, pkm.nilai_do, pkm.nilai_hi, existingPenyimpananId]
        );

        // Update kernel
        db.query(
          "UPDATE kernel SET stok = stok + ?, alb = alb + ?, kadar_air = kadar_air + ?, kadar_kotoran = kadar_kotoran + ?, do = do + ?, hi = hi + ? WHERE id_penyimpanan = ?",
          [
            kernel.stok,
            kernel.alb,
            kernel.kadar_air,
            kernel.kadar_kotoran,
            kernel.do,
            kernel.hi,
            existingPenyimpananId,
          ]
        );
                // 2. Update data pada kernel
                db.query(
                  "UPDATE kernel SET stok = stok + ?, alb = alb + ?, kadar_air = kadar_air + ?, kadar_kotoran = kadar_kotoran + ?, do = do + ?, hi = hi + ? WHERE id_penyimpanan = ?",
                  [
                    kernel.stok,
                    kernel.alb,
                    kernel.kadar_air,
                    kernel.kadar_kotoran,
                    kernel.do,
                    kernel.hi,
                    existingPenyimpananId,
                  ],
                  (err) => {
                    if (err) return res.status(500).json(err);
                  }
                );

        // Update kategori dan penyimpanan
        kategori.forEach((kat) => {
          db.query(
            "SELECT id_kategori FROM kategori WHERE id_penyimpanan = ? AND nama_kategori = ?",
            [existingPenyimpananId, kat.nama],
            (err, existingKategori) => {
              if (err) return res.status(500).json(err);

              if (existingKategori.length > 0) {
                // Jika kategori sudah ada, update jumlah_total dan penyimpanan
                const kategoriId = existingKategori[0].id_kategori;

                // Update jumlah_total
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

                // Update penyimpanan
                kat.penyimpanan.forEach((p) => {
                  db.query(
                    "SELECT id_penyimpanan FROM penyimpanan WHERE id_kategori = ? AND jenis_tank = ?",
                    [kategoriId, p.jenis_tank],
                    (err, existingPenyimpanan) => {
                      if (err) return res.status(500).json(err);

                      if (existingPenyimpanan.length > 0) {
                        // Jika penyimpanan sudah ada, update stok dan lainnya
                        const penyimpananId = existingPenyimpanan[0].id_penyimpanan;

                        db.query(
                          "UPDATE penyimpanan SET stok = stok + ?, alb = alb + ?, kadar_air = kadar_air + ?, kadar_kotoran = kadar_kotoran + ?, do = do + ?, hi = hi + ? WHERE id_penyimpanan = ?",
                          [
                            p.stok,
                            p.alb,
                            p.kadar_air,
                            p.kadar_kotoran,
                            p.do,
                            p.hi,
                            penyimpananId,
                          ]
                        );
                      } else {
                        // Jika penyimpanan tidak ada, buat yang baru
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
                      }
                    }
                  );
                });
              } else {
                // Jika kategori belum ada, buat kategori dan jumlah_total
                db.query(
                  "INSERT INTO kategori (id_penyimpanan, nama_kategori) VALUES (?, ?)",
                  [existingPenyimpananId, kat.nama],
                  (err, result) => {
                    if (err) return res.status(500).json(err);
                    const kategoriId = result.insertId;

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
                  }
                );
              }
            }
          );
        });

        return res.json({ message: "Data berhasil diperbarui" });
      } else {
        // 4. Jika tidak ada data sebelumnya, lanjutkan dengan input baru
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
      }
    }
  );
});
