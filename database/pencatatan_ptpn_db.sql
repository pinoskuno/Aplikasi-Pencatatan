-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 20, 2025 at 04:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pencatatan_ptpn_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `catatan`
--

CREATE TABLE `catatan` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `tanggal` timestamp NOT NULL DEFAULT current_timestamp(),
  `nomor_kontrak` varchar(50) DEFAULT NULL,
  `tanggal_kontrak` date DEFAULT NULL,
  `pembeli` varchar(100) DEFAULT NULL,
  `jatuh_tempo_pembayaran` date DEFAULT NULL,
  `tanggal_bayar` date DEFAULT NULL,
  `mutu_alb` decimal(16,8) DEFAULT NULL,
  `vol_belum_serah` decimal(16,8) DEFAULT NULL,
  `harga_excl` decimal(16,8) DEFAULT NULL,
  `nilai` decimal(16,8) DEFAULT NULL,
  `fraco_fob` varchar(50) DEFAULT NULL,
  `rencana_pelayanan` date DEFAULT NULL,
  `realisasi_pelayanan` date DEFAULT NULL,
  `status_pembayaran` varchar(20) DEFAULT 'belum_bayar'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catatan`
--

-- --------------------------------------------------------

--
-- Table structure for table `data_penyimpanan`
--

CREATE TABLE `data_penyimpanan` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `lokasi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_penyimpanan`
--
-- --------------------------------------------------------

--
-- Table structure for table `data_pkm`
--

CREATE TABLE `data_pkm` (
  `id` int(11) NOT NULL,
  `id_penyimpanan` int(11) NOT NULL,
  `nilai_pkm` decimal(16,8) NOT NULL,
  `nilai_hi` decimal(16,8) NOT NULL,
  `nilai_do` decimal(16,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_pkm`
--


-- --------------------------------------------------------

--
-- Table structure for table `jumlah_total`
--

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

--
-- Dumping data for table `jumlah_total`
--
-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `id_penyimpanan` int(11) NOT NULL,
  `nama_kategori` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--


-- --------------------------------------------------------

--
-- Table structure for table `kernel`
--

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

--
-- Dumping data for table `kernel`
--


-- --------------------------------------------------------

--
-- Table structure for table `penyimpanan`
--

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

--
-- Dumping data for table `penyimpanan`
--
-- Indexes for table `catatan`
--
ALTER TABLE `catatan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_penyimpanan`
--
ALTER TABLE `data_penyimpanan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_pkm`
--
ALTER TABLE `data_pkm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_penyimpanan` (`id_penyimpanan`);

--
-- Indexes for table `jumlah_total`
--
ALTER TABLE `jumlah_total`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_penyimpanan` (`id_penyimpanan`);

--
-- Indexes for table `kernel`
--
ALTER TABLE `kernel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_penyimpanan` (`id_penyimpanan`);

--
-- Indexes for table `penyimpanan`
--
ALTER TABLE `penyimpanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `catatan`
--
ALTER TABLE `catatan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `data_penyimpanan`
--
ALTER TABLE `data_penyimpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `data_pkm`
--
ALTER TABLE `data_pkm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `jumlah_total`
--
ALTER TABLE `jumlah_total`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `kernel`
--
ALTER TABLE `kernel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `penyimpanan`
--
ALTER TABLE `penyimpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data_pkm`
--
ALTER TABLE `data_pkm`
  ADD CONSTRAINT `data_pkm_ibfk_1` FOREIGN KEY (`id_penyimpanan`) REFERENCES `data_penyimpanan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jumlah_total`
--
ALTER TABLE `jumlah_total`
  ADD CONSTRAINT `jumlah_total_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kategori`
--
ALTER TABLE `kategori`
  ADD CONSTRAINT `kategori_ibfk_1` FOREIGN KEY (`id_penyimpanan`) REFERENCES `data_penyimpanan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kernel`
--
ALTER TABLE `kernel`
  ADD CONSTRAINT `kernel_ibfk_1` FOREIGN KEY (`id_penyimpanan`) REFERENCES `data_penyimpanan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `penyimpanan`
--
ALTER TABLE `penyimpanan`
  ADD CONSTRAINT `penyimpanan_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
