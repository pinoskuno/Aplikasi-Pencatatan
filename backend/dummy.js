app.get("/data_penyimpanan", (req, res) => {
    const sql = `
    SELECT dp.id, dp.tanggal, dp.lokasi 
           pk.nilai_pkm, pk.nilai_do AS pkm_do, pk.nilai_hi AS pkm_hi,
           k.stok AS kernel_stok, k.alb AS kernel_alb, k.kadar_air AS kernel_kadar_air, k.kadar_kotoran AS kernel_kadar_kotoran, k.do AS kernel_do, k.hi AS kernel_hi
           ka.id AS kategori_id, ka.nama_kategori,
           p.id AS penyimpanan_id, p.jenis_tank, p.stok AS penyimpanan_stok, p.alb AS penyimpanan_alb, p.kadar_air AS penyimpanan_kadar_air, p.kadar_kotoran AS penyimpanan_kadar_kotoran, p.do AS penyimpanan_do, p.hi AS penyimpanan_hi,
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
  
      res.json(Object.values(dataMap));
    });
  });