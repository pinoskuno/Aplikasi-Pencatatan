-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 17, 2025 at 05:55 AM
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
  `mutu_alb` decimal(5,2) DEFAULT NULL,
  `vol_belum_serah` decimal(10,2) DEFAULT NULL,
  `harga_excl` decimal(15,2) DEFAULT NULL,
  `nilai` decimal(15,2) DEFAULT NULL,
  `fraco_fob` varchar(50) DEFAULT NULL,
  `rencana_pelayanan` date DEFAULT NULL,
  `realisasi_pelayanan` date DEFAULT NULL,
  `status_pembayaran` varchar(20) DEFAULT 'belum_bayar'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catatan`
--

INSERT INTO `catatan` (`id`, `judul`, `deskripsi`, `tanggal`, `nomor_kontrak`, `tanggal_kontrak`, `pembeli`, `jatuh_tempo_pembayaran`, `tanggal_bayar`, `mutu_alb`, `vol_belum_serah`, `harga_excl`, `nilai`, `fraco_fob`, `rencana_pelayanan`, `realisasi_pelayanan`, `status_pembayaran`) VALUES
(7, 'Bungkil Inti Sawit (PKM)', NULL, '2025-02-04 07:22:29', '0138/KSO-R7/HO-PALM/PKM-L/XII/2024', '2024-08-20', 'BLS', '2024-09-09', '2024-08-23', 0.00, 70.00, 1.41, 98.35, 'Bekri', NULL, NULL, 'Sudah Bayar'),
(11, 'Minyak sawit (CPO)', 's12', '2025-02-04 07:44:02', '231234', NULL, NULL, NULL, NULL, 2.00, 95.00, 19998.00, 1899810.00, 'sada', NULL, NULL, 'Belum Bayar'),
(12, 'Minyak sawit (CPO)', 'Mencarri ', '2025-02-04 08:00:06', '24198858858', '2025-02-24', 'LIMCO', '2025-02-08', '2025-01-27', 2.00, 51.00, 200000.00, 10200000.00, 'tba', '2025-02-24', '2025-02-09', 'Belum Bayar'),
(13, 'Minyak sawit (CPO)', NULL, '2025-02-06 07:19:31', '1755/KSO-R7/HO-PALM/CPO-L/XI/2024', '2024-11-11', 'BKP', '2024-11-29', '2024-11-29', 4.00, NULL, 15.64, NULL, 'Boom Baru', '0000-00-00', '2024-12-08', 'Sudah Bayar'),
(15, 'Minyak Intisawit (PKO)', NULL, '2025-02-06 08:02:42', '0186/KSO-R7/HO-PALM/PKO-L/XII/2024', '2024-03-20', 'ATI', '2024-04-18', NULL, 5.00, 100.00, 24.43, 2442.50, 'Bekri', NULL, NULL, 'Belum Bayar'),
(16, 'Minyak Intisawit (PKO)', NULL, '2025-02-11 06:43:17', '0053/KSO-R7/PALM/PKO-L/XII/2024', '2024-12-03', 'IKIN', '0000-00-00', '0000-00-00', 5.00, 346.57, 24.43, 8466.71, 'Bekri', NULL, NULL, 'Sudah Bayar'),
(17, 'Bungkil Inti Sawit (PKM)', NULL, '2025-02-11 07:36:45', '0007/KSO-R7/PALM/PKM-L/III/2024', '2024-03-19', 'ATI', '2024-04-17', NULL, NULL, 100.00, 1.83, 182.50, 'Betung', NULL, NULL, 'Belum Bayar'),
(18, 'Minyak sawit (CPO)', NULL, '2025-02-11 08:06:39', NULL, '2025-02-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Sudah Bayar'),
(19, 'Inti Sawit (PK)', NULL, '2025-02-12 02:52:48', '1000/kSO-R7/HO-PALM/CPO-L/XI/2024', '2025-02-10', 'BKP', '2025-02-11', '2025-02-10', 5.00, 2765.00, 2000.00, 5530000.00, 'Boom Baru', '2025-02-11', '2025-02-11', 'Belum Bayar');

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

INSERT INTO `data_penyimpanan` (`id`, `tanggal`, `lokasi`) VALUES
(3, '2025-01-01', 'Bekri'),
(4, '2025-02-02', 'Betung'),
(18, '2025-02-10', 'Betung'),
(19, '2025-02-10', 'Betung'),
(20, '2025-02-10', 'Talang sawit');

-- --------------------------------------------------------

--
-- Table structure for table `data_pkm`
--

CREATE TABLE `data_pkm` (
  `id` int(11) NOT NULL,
  `id_penyimpanan` int(11) NOT NULL,
  `nilai_pkm` decimal(10,2) NOT NULL,
  `nilai_hi` decimal(10,2) NOT NULL,
  `nilai_do` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_pkm`
--

INSERT INTO `data_pkm` (`id`, `id_penyimpanan`, `nilai_pkm`, `nilai_hi`, `nilai_do`) VALUES
(3, 18, 1153865.00, 383.45, 9.95),
(4, 19, 1153865.00, 383.45, 9.95),
(5, 20, 123.00, 2.00, 1.00);

-- --------------------------------------------------------

--
-- Table structure for table `jumlah_total`
--

CREATE TABLE `jumlah_total` (
  `id` int(11) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `stok` int(11) NOT NULL,
  `alb` decimal(5,2) NOT NULL,
  `kadar_air` decimal(5,2) NOT NULL,
  `kadar_kotoran` decimal(5,2) NOT NULL,
  `do` decimal(5,2) NOT NULL,
  `hi` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jumlah_total`
--

INSERT INTO `jumlah_total` (`id`, `id_kategori`, `stok`, `alb`, `kadar_air`, `kadar_kotoran`, `do`, `hi`) VALUES
(5, 5, 13, 23.00, 31.00, 25.00, 0.00, 0.00),
(6, 6, 2131412, 999.99, 999.99, 999.99, 0.00, 0.00),
(7, 7, 13, 23.00, 31.00, 25.00, 0.00, 0.00),
(8, 8, 2131412, 999.99, 999.99, 999.99, 0.00, 0.00),
(14, 14, 12, 234.00, 567.00, 578.00, 890.00, 3.00),
(15, 15, 123, 678.00, 89.00, 67.00, 567.00, 578.00);

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

INSERT INTO `kategori` (`id`, `id_penyimpanan`, `nama_kategori`) VALUES
(5, 3, 'CPO'),
(6, 3, 'PKO'),
(7, 4, 'CPO'),
(8, 4, 'PKO'),
(10, 18, 'CPO'),
(11, 18, 'PKO'),
(12, 19, 'CPO'),
(13, 19, 'PKO'),
(14, 20, 'CPO'),
(15, 20, 'PKO');

-- --------------------------------------------------------

--
-- Table structure for table `kernel`
--

CREATE TABLE `kernel` (
  `id` int(11) NOT NULL,
  `id_penyimpanan` int(11) NOT NULL,
  `stok` int(11) NOT NULL,
  `alb` decimal(5,2) NOT NULL,
  `kadar_air` decimal(5,2) NOT NULL,
  `kadar_kotoran` decimal(5,2) NOT NULL,
  `do` decimal(5,2) NOT NULL,
  `hi` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kernel`
--

INSERT INTO `kernel` (`id`, `id_penyimpanan`, `stok`, `alb`, `kadar_air`, `kadar_kotoran`, `do`, `hi`) VALUES
(14, 20, 12341, 999.99, 234.00, 999.99, 999.99, 122.96);

-- --------------------------------------------------------

--
-- Table structure for table `penyimpanan`
--

CREATE TABLE `penyimpanan` (
  `id` int(11) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `jenis_tank` varchar(50) NOT NULL,
  `stok` int(11) NOT NULL,
  `alb` decimal(5,2) NOT NULL,
  `kadar_air` decimal(5,2) NOT NULL,
  `kadar_kotoran` decimal(5,2) NOT NULL,
  `do` decimal(5,2) NOT NULL,
  `hi` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penyimpanan`
--

INSERT INTO `penyimpanan` (`id`, `id_kategori`, `jenis_tank`, `stok`, `alb`, `kadar_air`, `kadar_kotoran`, `do`, `hi`) VALUES
(11, 5, 'Storage Tank I', 2312, 999.99, 231.00, 513.00, 0.00, 0.00),
(12, 5, 'Storage Tank II', 2341, 999.99, 999.99, 999.99, 0.00, 0.00),
(13, 5, 'Storage Tank III', 1234, 999.99, 999.99, 999.99, 0.00, 0.00),
(14, 6, 'Tanki I', 123, 123.00, 23.00, 999.99, 0.00, 0.00),
(15, 6, 'Tanki II', 123412, 999.99, 999.99, 999.99, 0.00, 0.00),
(16, 7, 'Storage Tank I', 2312, 999.99, 231.00, 513.00, 0.00, 0.00),
(17, 7, 'Storage Tank II', 2341, 999.99, 999.99, 999.99, 0.00, 0.00),
(18, 7, 'Storage Tank III', 1234, 999.99, 999.99, 999.99, 0.00, 0.00),
(19, 8, 'Tanki I', 123, 123.00, 23.00, 999.99, 0.00, 0.00),
(20, 8, 'Tanki II', 123412, 999.99, 999.99, 999.99, 0.00, 0.00),
(22, 10, 'Storage Tank I', 115154, 650.00, 241.00, 230.00, 0.00, -1.00),
(23, 10, 'Storage Tank II', 18723, 420.00, 30.00, 16.00, 999.99, 999.99),
(24, 11, 'Storage Tank I', 0, 0.00, 0.00, 0.00, 0.00, 0.00),
(25, 11, 'Storage Tank IV', 0, 0.00, 0.00, 0.00, 999.99, 999.99),
(26, 12, 'Storage Tank I', 115154, 650.00, 241.00, 230.00, 0.00, -1.00),
(27, 12, 'Storage Tank II', 18723, 420.00, 30.00, 16.00, 999.99, 999.99),
(28, 13, 'Storage Tank I', 0, 0.00, 0.00, 0.00, 0.00, 0.00),
(29, 13, 'Storage Tank IV', 0, 0.00, 0.00, 0.00, 999.99, 999.99),
(30, 14, 'Storage Tank I', 12, 21.00, 567.00, 890.00, 905.00, 344.00),
(31, 15, 'Storage Tank IX', 123, 43.00, 345.00, 12.00, 123.00, 324.00),
(32, 15, 'Storage Tank VII', 34, 789.00, 999.99, 791.00, 456.00, 12.00);

--
-- Indexes for dumped tables
--

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `data_penyimpanan`
--
ALTER TABLE `data_penyimpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `data_pkm`
--
ALTER TABLE `data_pkm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `jumlah_total`
--
ALTER TABLE `jumlah_total`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `kernel`
--
ALTER TABLE `kernel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `penyimpanan`
--
ALTER TABLE `penyimpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
