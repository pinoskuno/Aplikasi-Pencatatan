SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `catatan` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `tanggal` datetime NOT NULL DEFAULT current_timestamp(),
  `nomor_kontrak` varchar(50) DEFAULT NULL,
  `tanggal_kontrak` date DEFAULT NULL,
  `pembeli` varchar(100) DEFAULT NULL,
  `jatuh_tempo_pembayaran` date DEFAULT NULL,
  `tanggal_bayar` date DEFAULT NULL,
  `mutu_alb` int(11) DEFAULT NULL,
  `vol_belum_serah` int(11) DEFAULT NULL,
  `harga_excl` int(11) DEFAULT NULL,
  `nilai` int(11) DEFAULT NULL,
  `fraco_fob` varchar(50) DEFAULT NULL,
  `rencana_pelayanan` date DEFAULT NULL,
  `realisasi_pelayanan` date DEFAULT NULL,
  `status_pembayaran` varchar(20) DEFAULT 'belum_bayar'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `data_penyimpanan` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `lokasi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `data_pkm` (
  `id` int(11) NOT NULL,
  `id_penyimpanan` int(11) NOT NULL,
  `nilai_pkm` decimal(16,8) NOT NULL,
  `nilai_hi` decimal(16,8) NOT NULL,
  `nilai_do` decimal(16,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `jumlah_total` (
  `id` int(11) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `stok` int(11) NOT NULL,
  `alb` decimal(16,8) NOT NULL,
  `kadar_air` decimal(16,8) NOT NULL,
  `kadar_kotoran` decimal(16,8) NOT NULL,
  `do` decimal(16,8) NOT NULL,
  `hi` decimal(16,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `id_penyimpanan` int(11) NOT NULL,
  `nama_kategori` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `kernel` (
  `id` int(11) NOT NULL,
  `id_penyimpanan` int(11) NOT NULL,
  `stok` int(11) NOT NULL,
  `alb` decimal(16,8) NOT NULL,
  `kadar_air` decimal(16,8) NOT NULL,
  `kadar_kotoran` decimal(16,8) NOT NULL,
  `do` decimal(16,8) NOT NULL,
  `hi` decimal(16,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `penyimpanan` (
  `id` int(11) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `jenis_tank` varchar(50) NOT NULL,
  `stok` int(11) NOT NULL,
  `alb` decimal(16,8) NOT NULL,
  `kadar_air` decimal(16,8) NOT NULL,
  `kadar_kotoran` decimal(16,8) NOT NULL,
  `do` decimal(16,8) NOT NULL,
  `hi` decimal(16,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `catatan`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `data_penyimpanan`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `data_pkm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_penyimpanan` (`id_penyimpanan`);

ALTER TABLE `jumlah_total`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kategori` (`id_kategori`);

ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_penyimpanan` (`id_penyimpanan`);

ALTER TABLE `kernel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_penyimpanan` (`id_penyimpanan`);

ALTER TABLE `penyimpanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kategori` (`id_kategori`);

ALTER TABLE `catatan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

ALTER TABLE `data_penyimpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

ALTER TABLE `data_pkm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

ALTER TABLE `jumlah_total`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

ALTER TABLE `kernel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

ALTER TABLE `penyimpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=216;

ALTER TABLE `data_pkm`
  ADD CONSTRAINT `data_pkm_ibfk_1` FOREIGN KEY (`id_penyimpanan`) REFERENCES `data_penyimpanan` (`id`) ON DELETE CASCADE;

ALTER TABLE `jumlah_total`
  ADD CONSTRAINT `jumlah_total_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON DELETE CASCADE;

ALTER TABLE `kategori`
  ADD CONSTRAINT `kategori_ibfk_1` FOREIGN KEY (`id_penyimpanan`) REFERENCES `data_penyimpanan` (`id`) ON DELETE CASCADE;

ALTER TABLE `kernel`
  ADD CONSTRAINT `kernel_ibfk_1` FOREIGN KEY (`id_penyimpanan`) REFERENCES `data_penyimpanan` (`id`) ON DELETE CASCADE;

ALTER TABLE `penyimpanan`
  ADD CONSTRAINT `penyimpanan_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON DELETE CASCADE;
COMMIT;


DELIMITER //

CREATE PROCEDURE UpdateStockAfterInsert(IN new_id_penyimpanan INT, IN new_lokasi VARCHAR(100))
BEGIN
    DECLARE prev_stok INT DEFAULT 0;
    DECLARE stok_input INT;
    DECLARE new_stok INT;
    DECLARE new_hi INT;
    DECLARE new_tanggal DATE;

    -- Ambil data entri baru
    SELECT stok, hi, dp.tanggal INTO new_stok, new_hi, new_tanggal
    FROM kernel k
    INNER JOIN data_penyimpanan dp ON k.id_penyimpanan = dp.id
    WHERE k.id_penyimpanan = new_id_penyimpanan;

    -- Ambil stok sebelumnya
    SELECT COALESCE(k.stok, 0) INTO prev_stok
    FROM kernel k
    INNER JOIN data_penyimpanan dp ON k.id_penyimpanan = dp.id
    WHERE dp.lokasi = new_lokasi
    AND dp.tanggal < new_tanggal
    ORDER BY dp.tanggal DESC
    LIMIT 1;

    -- Hitung stok input murni (stok baru - hi)
    SET stok_input = new_stok - COALESCE(new_hi, 0);

    -- Update stok entri baru (prev_stok + stok_input)
    SET new_stok = prev_stok + stok_input;
    UPDATE kernel
    SET stok = new_stok
    WHERE id_penyimpanan = new_id_penyimpanan;

    -- Sesuaikan stok data berikutnya (tambah stok_input murni)
    UPDATE kernel k
    INNER JOIN data_penyimpanan dp ON k.id_penyimpanan = dp.id
    SET k.stok = k.stok + stok_input
    WHERE dp.lokasi = new_lokasi
    AND dp.tanggal > new_tanggal;

    -- Sesuaikan stok penyimpanan (kurangi hi dari stok mentah, lalu tambah stok_input untuk data berikutnya)
    UPDATE penyimpanan p
    INNER JOIN kategori kat ON p.id_kategori = kat.id
    INNER JOIN data_penyimpanan dp ON kat.id_penyimpanan = dp.id
    SET p.stok = CASE 
        WHEN dp.tanggal = new_tanggal THEN p.stok - COALESCE(p.hi, 0) 
        ELSE p.stok + stok_input 
    END
    WHERE dp.lokasi = new_lokasi
    AND dp.tanggal >= new_tanggal;

    -- Sesuaikan jumlah_total
    UPDATE jumlah_total jt
    INNER JOIN kategori kat ON jt.id_kategori = kat.id
    INNER JOIN data_penyimpanan dp ON kat.id_penyimpanan = dp.id
    SET jt.stok = (
        SELECT SUM(p.stok)
        FROM penyimpanan p
        WHERE p.id_kategori = kat.id
    )
    WHERE dp.lokasi = new_lokasi
    AND dp.tanggal >= new_tanggal;
END //

DELIMITER ;