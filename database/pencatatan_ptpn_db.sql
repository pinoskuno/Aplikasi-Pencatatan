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
