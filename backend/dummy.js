app.post("/penyimpanan", (req, res) => {
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  // 1. Cari data pada tanggal sebelumnya dengan lokasi yang sama
  db.query(
    "SELECT * FROM data_penyimpanan WHERE lokasi = ? AND tanggal < ? ORDER BY tanggal DESC LIMIT 1",
    [lokasi, tanggal],
    (err, results) => {
      if (err) return res.status(500).json(err);

      // Inisialisasi total data
      let totalPkm = {
        nilai_pkm: Number(pkm.nilai_pkm),
        nilai_do: Number(pkm.nilai_do),
        nilai_hi: Number(pkm.nilai_hi),
      };

      let totalKernel = {
        stok: Number(kernel.stok),
        alb: Number(kernel.alb),
        kadar_air: Number(kernel.kadar_air),
        kadar_kotoran: Number(kernel.kadar_kotoran),
        do: Number(kernel.do),
        hi: Number(kernel.hi),
      };

      let totalKategori = kategori.map((kat) => ({
        nama: kat.nama,
        jumlah: {
          stok: Number(kat.jumlah.stok),
          alb: Number(kat.jumlah.alb),
          kadar_air: Number(kat.jumlah.kadar_air),
          kadar_kotoran: Number(kat.jumlah.kadar_kotoran),
          do: Number(kat.jumlah.do),
          hi: Number(kat.jumlah.hi),
        },
        penyimpanan: kat.penyimpanan.map((p) => ({
          jenis_tank: p.jenis_tank,
          stok: Number(p.stok),
          alb: Number(p.alb),
          kadar_air: Number(p.kadar_air),
          kadar_kotoran: Number(p.kadar_kotoran),
          do: Number(p.do),
          hi: Number(p.hi),
        })),
      }));

      if (results.length > 0) {
        // Jika ada data sebelumnya, ambil ID penyimpanan sebelumnya
        const previousId = results[0].id;

        // Ambil nilai sebelumnya dari data_pkm
        db.query(
          "SELECT * FROM data_pkm WHERE id_penyimpanan = ?",
          [previousId],
          (err, pkmResults) => {
            if (err) return res.status(500).json(err);
            if (pkmResults.length > 0) {
              totalPkm.nilai_pkm += Number(pkmResults[0].nilai_pkm);
              totalPkm.nilai_do += Number(pkmResults[0].nilai_do);
              totalPkm.nilai_hi += Number(pkmResults[0].nilai_hi);
            }

            // Ambil nilai sebelumnya dari kernel
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
                  totalKernel.do += Number(kernelResults[0].do);
                  totalKernel.hi += Number(kernelResults[0].hi);
                }

                // Ambil nilai sebelumnya dari kategori
                db.query(
                  "SELECT * FROM kategori WHERE id_penyimpanan = ?",
                  [previousId],
                  (err, kategoriResults) => {
                    if (err) return res.status(500).json(err);

                    kategoriResults.forEach((katPrev) => {
                      const matchingKategori = totalKategori.find(
                        (kat) => kat.nama === katPrev.nama_kategori
                      );
                      if (matchingKategori) {
                        // Jika kategori sudah ada pada input baru, gabungkan data dengan data sebelumnya
                        db.query(
                          "SELECT * FROM jumlah_total WHERE id_kategori = ?",
                          [katPrev.id],
                          (err, jumlahResults) => {
                            if (err) return res.status(500).json(err);
                            if (jumlahResults.length > 0) {
                              matchingKategori.jumlah.stok += Number(
                                jumlahResults[0].stok
                              );
                              matchingKategori.jumlah.alb += Number(
                                jumlahResults[0].alb
                              );
                              matchingKategori.jumlah.kadar_air += Number(
                                jumlahResults[0].kadar_air
                              );
                              matchingKategori.jumlah.kadar_kotoran += Number(
                                jumlahResults[0].kadar_kotoran
                              );
                              matchingKategori.jumlah.do += Number(
                                jumlahResults[0].do
                              );
                              matchingKategori.jumlah.hi += Number(
                                jumlahResults[0].hi
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

                            // Ambil penyimpanan sebelumnya
                            db.query(
                              "SELECT * FROM penyimpanan WHERE id_kategori = ?",
                              [katPrev.id],
                              (err, penyimpananResults) => {
                                if (err) return res.status(500).json(err);

                                penyimpananResults.forEach((pPrev) => {
                                  const matchingPenyimpanan =
                                    matchingKategori.penyimpanan.find(
                                      (p) => p.jenis_tank === pPrev.jenis_tank
                                    );
                                  if (matchingPenyimpanan) {
                                    matchingPenyimpanan.stok += Number(
                                      pPrev.stok
                                    );
                                    matchingPenyimpanan.alb += Number(
                                      pPrev.alb
                                    );
                                    matchingPenyimpanan.kadar_air += Number(
                                      pPrev.kadar_air
                                    );
                                    matchingPenyimpanan.kadar_kotoran += Number(
                                      pPrev.kadar_kotoran
                                    );
                                    matchingPenyimpanan.do += Number(pPrev.do);
                                    matchingPenyimpanan.hi += Number(pPrev.hi);
                                  }
                                });

                                // Setelah semua data dihitung, masukkan ke tanggal baru
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
                                          if (err)
                                            return res.status(500).json(err);
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
                                      message:
                                        "Data dari tanggal sebelumnya ditambahkan ke tanggal baru",
                                    });
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    });
                  }
                );
              }
            );
          }
        );
      } else {
        // Jika tidak ada data sebelumnya, lanjutkan dengan input baru
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
