// Mengambil kategori lama dari ID penyimpanan sebelumnya
db.query(
  "SELECT * FROM kategori WHERE id_penyimpanan = ?",
  [previousId],
  (err, kategoriResults) => {
    if (err) return res.status(500).json(err);

    let kategoriMap = new Map(); // Untuk menyimpan kategori lama
    let penyimpananMap = new Map(); // Untuk menyimpan penyimpanan lama

    kategoriResults.forEach((katPrev) => {
      const existingCategory = totalKategori.find(
        (k) => k.nama === katPrev.nama_kategori
      );

      if (existingCategory) {
        // Mengambil jumlah_total dari kategori sebelumnya
        db.query(
          "SELECT * FROM jumlah_total WHERE id_kategori = ?",
          [katPrev.id],
          (err, jumlahResults) => {
            if (err) return res.status(500).json(err);
            if (jumlahResults.length > 0) {
              existingCategory.jumlah.stok += Number(jumlahResults[0].stok);
              existingCategory.jumlah.alb += Number(jumlahResults[0].alb);
              existingCategory.jumlah.kadar_air += Number(
                jumlahResults[0].kadar_air
              );
              existingCategory.jumlah.kadar_kotoran += Number(
                jumlahResults[0].kadar_kotoran
              );
              existingCategory.jumlah.do += Number(jumlahResults[0].do);
              existingCategory.jumlah.hi += Number(jumlahResults[0].hi);
            }
          }
        );
      } else {
        // Jika kategori belum ada, tambahkan ke totalKategori
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

      // Simpan kategori ke Map
      kategoriMap.set(katPrev.id, { id: katPrev.id, nama: katPrev.nama_kategori });
    });

    // Mengambil data penyimpanan lama yang sesuai dengan kategori sebelumnya
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
            stok: Number(pPrev.stok),
            alb: Number(pPrev.alb),
            kadar_air: Number(pPrev.kadar_air),
            kadar_kotoran: Number(pPrev.kadar_kotoran),
            do: Number(pPrev.do),
            hi: Number(pPrev.hi),
          });
        });

        // Menggabungkan penyimpanan lama ke dalam kategori baru
        totalKategori.forEach((kat) => {
          let previousPenyimpanan = penyimpananMap.get(kat.nama) || [];

          previousPenyimpanan.forEach((pPrev) => {
            let existingPenyimpanan = kat.penyimpanan.find(
              (p) => p.jenis_tank === pPrev.jenis_tank
            );

            if (existingPenyimpanan) {
              existingPenyimpanan.stok += pPrev.stok;
              existingPenyimpanan.alb += pPrev.alb;
              existingPenyimpanan.kadar_air += pPrev.kadar_air;
              existingPenyimpanan.kadar_kotoran += pPrev.kadar_kotoran;
              existingPenyimpanan.do += pPrev.do;
              existingPenyimpanan.hi += pPrev.hi;
            } else {
              kat.penyimpanan.push(pPrev);
            }
          });
        });

        // Setelah kategori dan penyimpanan lama digabungkan, masukkan ke database baru
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

            // Simpan kategori ke database
            totalKategori.forEach((kat) => {
              db.query(
                "INSERT INTO kategori (id_penyimpanan, nama_kategori) VALUES (?, ?)",
                [penyimpananId, kat.nama],
                (err, result) => {
                  if (err) return res.status(500).json(err);
                  const kategoriId = result.insertId;

                  // Simpan penyimpanan ke database
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

                  // Simpan jumlah_total ke database
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
