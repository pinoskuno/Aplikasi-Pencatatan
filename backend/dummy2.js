app.post("/penyimpanan", (req, res) => {
  const { tanggal, lokasi, pkm, kernel, kategori } = req.body;

  db.query(
    "SELECT * FROM data_penyimpanan WHERE lokasi = ? AND tanggal < ? ORDER BY tanggal DESC LIMIT 1",
    [lokasi, tanggal],
    (err, results) => {
      if (err) return res.status(500).json(err);

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
        const previousId = results[0].id;

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

                db.query(
                  "SELECT * FROM kategori WHERE id_penyimpanan = ?",
                  [previousId],
                  (err, kategoriResults) => {
                    if (err) return res.status(500).json(err);

                    let kategoriMap = new Map();

                    kategoriResults.forEach((katPrev) => {
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

                        let penyimpananMap = new Map();

                        penyimpananResults.forEach((pPrev) => {
                          let kategoriNama = kategoriMap.get(
                            pPrev.id_kategori
                          ).nama;

                          if (!penyimpananMap.has(kategoriNama)) {
                            penyimpananMap.set(kategoriNama, []);
                          }

                          penyimpananMap.get(kategoriNama).push({
                            jenis_tank: pPrev.jenis_tank,
                            stok: Number(pPrev.stok),
                            alb: Number(pPrev.alb),
                            kadar_air: Number(pPrev.kadar_air),
                            kadar_kotoran: Number(pPrev.kadar_kotoran),
                            do: Number(pPrev.do),
                            hi: Number(pPrev.hi),
                          });
                        });

                        totalKategori.forEach((kat) => {
                          let previousPenyimpanan =
                            penyimpananMap.get(kat.nama) || [];

                          previousPenyimpanan.forEach((pPrev) => {
                            let existingPenyimpanan = kat.penyimpanan.find(
                              (p) => p.jenis_tank === pPrev.jenis_tank
                            );

                            if (existingPenyimpanan) {
                              existingPenyimpanan.stok += pPrev.stok;
                              existingPenyimpanan.alb += pPrev.alb;
                              existingPenyimpanan.kadar_air += pPrev.kadar_air;
                              existingPenyimpanan.kadar_kotoran +=
                                pPrev.kadar_kotoran;
                              existingPenyimpanan.do += pPrev.do;
                              existingPenyimpanan.hi += pPrev.hi;
                            } else {
                              kat.penyimpanan.push(pPrev);
                            }
                          });
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
                                }
                              );
                            });

                            res.json({
                              message:
                                "Data berhasil diperbarui dan ditambahkan.",
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
      }
    }
  );
});
