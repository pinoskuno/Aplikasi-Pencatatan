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

INSERT INTO `catatan` (`id`, `judul`, `deskripsi`, `tanggal`, `nomor_kontrak`, `tanggal_kontrak`, `pembeli`, `jatuh_tempo_pembayaran`, `tanggal_bayar`, `mutu_alb`, `vol_belum_serah`, `harga_excl`, `nilai`, `fraco_fob`, `rencana_pelayanan`, `realisasi_pelayanan`, `status_pembayaran`) VALUES
(7, 'Inti Sawit (PK)', 'weqrqs', '2025-02-04 07:22:29', '12312341', NULL, NULL, NULL, NULL, 41.00000000, 23219.00000000, 1221.00000000, 28350399.00000000, NULL, NULL, NULL, 'Sudah Bayar'),
(11, 'Minyak sawit (CPO)', 's12', '2025-02-04 07:44:02', '231234', NULL, NULL, NULL, NULL, 2.00000000, 95.00000000, 19998.00000000, 1899810.00000000, 'sada', NULL, NULL, 'Belum Bayar'),
(12, 'Minyak sawit (CPO)', 'Mencarri ', '2025-02-04 08:00:06', '24198858858', '2025-02-24', 'LIMCO', '2025-02-08', '2025-01-27', 2.00000000, 51.00000000, 200000.00000000, 10200000.00000000, 'tba', '2025-02-24', '2025-02-09', 'Belum Bayar'),
(13, 'Minyak sawit (CPO)', 'das', '2025-02-06 07:19:31', '314123', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Sudah Bayar'),
(14, 'Minyak sawit (CPO)', 'test', '2025-02-06 07:32:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Belum Bayar'),
(15, 'Minyak Intisawit (PKO)', '123123', '2025-02-06 08:02:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Belum Bayar');

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
(45, '2024-01-01', 'Bekri'),
(92, '2024-01-02', 'Bekri'),
(94, '2024-01-03', 'Bekri'),
(95, '2024-01-04', 'Bekri'),
(96, '2024-01-05', 'Bekri'),
(97, '2024-01-06', 'Bekri'),
(99, '2024-01-07', 'Bekri'),
(100, '2024-01-08', 'Bekri'),
(108, '2024-01-09', 'Bekri'),
(109, '2024-01-10', 'Bekri'),
(110, '2024-01-11', 'Bekri'),
(111, '2024-01-12', 'Bekri'),
(112, '2024-01-13', 'Bekri'),
(113, '2024-01-14', 'Bekri'),
(124, '2024-01-15', 'Bekri'),
(125, '2024-01-01', 'Betung'),
(126, '2024-01-02', 'Betung');

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

INSERT INTO `data_pkm` (`id`, `id_penyimpanan`, `nilai_pkm`, `nilai_hi`, `nilai_do`) VALUES
(17, 45, 22.00000000, 4.00000000, 3.00000000),
(58, 92, 145.00000000, 6.00000000, 25.97000000),
(60, 94, 268.00000000, 8.00000000, 48.94000000),
(61, 95, 391.00000000, 10.00000000, 71.91000000),
(62, 96, 514.00000000, 12.00000000, 94.88000000),
(63, 97, 637.00000000, 14.00000000, 117.85000000),
(65, 99, 638.00000000, 16.00000000, 118.85000000),
(66, 100, 639.00000000, 18.00000000, 119.85000000),
(74, 108, 660.00000000, 20.00000000, 140.85000000),
(75, 109, 681.00000000, 22.00000000, 161.85000000),
(76, 110, 702.00000000, 24.00000000, 182.85000000),
(77, 111, 723.00000000, 26.00000000, 203.85000000),
(78, 112, 744.00000000, 28.00000000, 224.85000000),
(79, 113, 765.00000000, 30.00000000, 245.85000000),
(90, 124, 786.00000000, 32.00000000, 266.85000000),
(91, 125, 21.00000000, 2.00000000, 21.00000000),
(92, 126, 42.00000000, 4.00000000, 42.00000000);

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

INSERT INTO `jumlah_total` (`id`, `id_kategori`, `stok`, `alb`, `kadar_air`, `kadar_kotoran`, `do`, `hi`) VALUES
(31, 31, 0, 0.00000000, 0.00000000, 2.00000000, 3.00000000, 4.00000000),
(32, 32, 23, 32.00000000, 32.00000000, 21.00000000, 23.00000000, 0.00000000),
(71, 77, 28, 44.00000000, 34.00000000, 26.00000000, 25.00000000, 34.00000000),
(72, 78, 0, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(75, 81, 33, 56.00000000, 36.00000000, 31.00000000, 27.00000000, 68.00000000),
(76, 82, 2, 3.00000000, 4.00000000, 23142.00000000, 23.00000000, 423.00000000),
(77, 83, 38, 68.00000000, 38.00000000, 36.00000000, 29.00000000, 102.00000000),
(78, 84, 4, 6.00000000, 8.00000000, 23323.00000000, 46.00000000, 846.00000000),
(79, 85, 43, 80.00000000, 40.00000000, 41.00000000, 31.00000000, 136.00000000),
(80, 86, 6, 9.00000000, 12.00000000, 23504.00000000, 69.00000000, 1269.00000000),
(81, 87, 48, 92.00000000, 42.00000000, 46.00000000, 33.00000000, 170.00000000),
(82, 88, 8, 12.00000000, 16.00000000, 23685.00000000, 92.00000000, 1692.00000000),
(83, 89, 0, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(84, 90, 0, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(85, 91, 0, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(86, 92, 0, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(87, 100, 1, 25.00000000, 45.00000000, 2.00000000, 41.00000000, 41.00000000),
(88, 101, 0, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(89, 102, 21, 50.00000000, 296.00000000, 14.00000000, 44.00000000, 55.00000000),
(90, 103, 0, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(91, 104, 41, 75.00000000, 547.00000000, 26.00000000, 47.00000000, 69.00000000),
(92, 105, 0, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(93, 106, 61, 100.00000000, 798.00000000, 38.00000000, 50.00000000, 83.00000000),
(94, 107, 15, 14.00000000, 15.00000000, 21.00000000, 15.00000000, 21.00000000),
(95, 108, 81, 125.00000000, 1049.00000000, 50.00000000, 53.00000000, 97.00000000),
(96, 109, 30, 28.00000000, 30.00000000, 42.00000000, 30.00000000, 42.00000000),
(97, 110, 101, 150.00000000, 1300.00000000, 62.00000000, 56.00000000, 111.00000000),
(98, 111, 45, 42.00000000, 45.00000000, 63.00000000, 45.00000000, 63.00000000),
(119, 132, 121, 175.00000000, 1551.00000000, 74.00000000, 59.00000000, 125.00000000),
(120, 133, 60, 56.00000000, 60.00000000, 84.00000000, 60.00000000, 84.00000000),
(121, 134, 20, 25.00000000, 251.00000000, 12.00000000, 3.00000000, 14.00000000),
(122, 135, 15, 14.00000000, 15.00000000, 21.00000000, 15.00000000, 21.00000000),
(123, 136, 40, 50.00000000, 502.00000000, 24.00000000, 6.00000000, 28.00000000),
(124, 137, 30, 28.00000000, 30.00000000, 42.00000000, 30.00000000, 42.00000000);

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
(31, 45, 'CPO'),
(32, 45, 'PKO'),
(77, 92, 'PKO'),
(78, 92, 'CPO'),
(81, 94, 'PKO'),
(82, 94, 'CPO'),
(83, 95, 'PKO'),
(84, 95, 'CPO'),
(85, 96, 'PKO'),
(86, 96, 'CPO'),
(87, 97, 'PKO'),
(88, 97, 'CPO'),
(89, 99, 'PKO'),
(90, 99, 'CPO'),
(91, 100, 'PKO'),
(92, 100, 'CPO'),
(100, 108, 'CPO'),
(101, 108, 'PKO'),
(102, 109, 'CPO'),
(103, 109, 'PKO'),
(104, 110, 'CPO'),
(105, 110, 'PKO'),
(106, 111, 'CPO'),
(107, 111, 'PKO'),
(108, 112, 'CPO'),
(109, 112, 'PKO'),
(110, 113, 'CPO'),
(111, 113, 'PKO'),
(132, 124, 'CPO'),
(133, 124, 'PKO'),
(134, 125, 'CPO'),
(135, 125, 'PKO'),
(136, 126, 'CPO'),
(137, 126, 'PKO');

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

INSERT INTO `kernel` (`id`, `id_penyimpanan`, `stok`, `alb`, `kadar_air`, `kadar_kotoran`, `do`, `hi`) VALUES
(21, 45, 3, 4.00000000, 3.00000000, 4.00000000, 3.00000000, 4.00000000),
(58, 92, 6, 6.00000000, 7.00000000, 9.00000000, 7.00000000, 49.00000000),
(60, 94, 9, 8.00000000, 11.00000000, 14.00000000, 11.00000000, 94.00000000),
(61, 95, 12, 10.00000000, 15.00000000, 19.00000000, 15.00000000, 139.00000000),
(62, 96, 15, 12.00000000, 19.00000000, 24.00000000, 19.00000000, 184.00000000),
(63, 97, 18, 14.00000000, 23.00000000, 29.00000000, 23.00000000, 229.00000000),
(65, 99, 21, 18.00000000, 26.00000000, 33.00000000, 26.00000000, 241.00000000),
(66, 100, 24, 22.00000000, 29.00000000, 37.00000000, 29.00000000, 253.00000000),
(74, 108, 25, 24.00000000, 30.00000000, 39.00000000, 34.00000000, 257.00000000),
(75, 109, 26, 26.00000000, 31.00000000, 41.00000000, 39.00000000, 261.00000000),
(76, 110, 27, 28.00000000, 32.00000000, 43.00000000, 44.00000000, 265.00000000),
(77, 111, 28, 30.00000000, 33.00000000, 45.00000000, 49.00000000, 269.00000000),
(78, 112, 29, 32.00000000, 34.00000000, 47.00000000, 54.00000000, 273.00000000),
(79, 113, 30, 34.00000000, 35.00000000, 49.00000000, 59.00000000, 277.00000000),
(90, 124, 31, 36.00000000, 36.00000000, 51.00000000, 64.00000000, 281.00000000),
(91, 125, 1, 2.00000000, 1.00000000, 2.00000000, 5.00000000, 4.00000000),
(92, 126, 2, 4.00000000, 2.00000000, 4.00000000, 10.00000000, 8.00000000);

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

INSERT INTO `penyimpanan` (`id`, `id_kategori`, `jenis_tank`, `stok`, `alb`, `kadar_air`, `kadar_kotoran`, `do`, `hi`) VALUES
(37, 83, 'Storage Tank I', 23, 23.00000000, 4.00000000, 23.00000000, 4.00000000, 32.00000000),
(38, 84, 'Tanki I', 23, 4.00000000, 23.00000000, 4.00000000, 323.00000000, 4.00000000),
(39, 85, 'Storage Tank I', 23, 23.00000000, 4.00000000, 23.00000000, 4.00000000, 32.00000000),
(40, 86, 'Tanki I', 23, 4.00000000, 23.00000000, 4.00000000, 323.00000000, 4.00000000),
(41, 87, 'Storage Tank II', 23, 23.00000000, 4.00000000, 23.00000000, 4.00000000, 32.00000000),
(42, 88, 'Tanki II', 23, 4.00000000, 23.00000000, 4.00000000, 323.00000000, 4.00000000),
(60, 100, 'Tanki II', 54, 454.00000000, 5.00000000, 454.00000000, 45.00000000, 45.00000000),
(61, 100, 'Tanki I', 2, 2.00000000, 15.00000000, 4.00000000, 51.00000000, 78.00000000),
(62, 102, 'Tanki II', 108, 908.00000000, 10.00000000, 908.00000000, 90.00000000, 90.00000000),
(63, 102, 'Tanki I', 4, 4.00000000, 30.00000000, 8.00000000, 102.00000000, 156.00000000),
(64, 104, 'Tanki IV', 54, 454.00000000, 5.00000000, 454.00000000, 45.00000000, 45.00000000),
(65, 104, 'Tanki III', 2, 2.00000000, 15.00000000, 4.00000000, 51.00000000, 78.00000000),
(66, 104, 'Tanki II', 108, 908.00000000, 10.00000000, 908.00000000, 90.00000000, 90.00000000),
(67, 104, 'Tanki I', 4, 4.00000000, 30.00000000, 8.00000000, 102.00000000, 156.00000000),
(68, 106, 'Tanki IV', 108, 908.00000000, 10.00000000, 908.00000000, 90.00000000, 90.00000000),
(69, 106, 'Tanki III', 4, 4.00000000, 30.00000000, 8.00000000, 102.00000000, 156.00000000),
(70, 106, 'Tanki II', 108, 908.00000000, 10.00000000, 908.00000000, 90.00000000, 90.00000000),
(71, 106, 'Tanki I', 4, 4.00000000, 30.00000000, 8.00000000, 102.00000000, 156.00000000),
(72, 107, 'Storage Tank I', 20, 2.00000000, 20.00000000, 2.00000000, 3.00000000, 14.00000000),
(73, 107, 'Storage Tank II', 15, 121.00000000, 151.00000000, 128.00000000, 56.00000000, 32.00000000),
(74, 108, 'Tanki IV', 162, 953.00000000, 15.00000000, 1362.00000000, 135.00000000, 135.00000000),
(75, 108, 'Tanki III', 6, 6.00000000, 45.00000000, 12.00000000, 153.00000000, 234.00000000),
(76, 108, 'Tanki II', 108, 908.00000000, 10.00000000, 908.00000000, 90.00000000, 90.00000000),
(77, 108, 'Tanki I', 4, 4.00000000, 30.00000000, 8.00000000, 102.00000000, 156.00000000),
(78, 109, 'Storage Tank I', 40, 4.00000000, 40.00000000, 4.00000000, 6.00000000, 28.00000000),
(79, 109, 'Storage Tank II', 30, 242.00000000, 302.00000000, 256.00000000, 112.00000000, 64.00000000),
(80, 110, 'Tanki IV', 216, 998.00000000, 20.00000000, 1387.00000000, 180.00000000, 180.00000000),
(81, 110, 'Tanki III', 8, 8.00000000, 60.00000000, 16.00000000, 204.00000000, 312.00000000),
(82, 110, 'Tanki II', 108, 908.00000000, 10.00000000, 908.00000000, 90.00000000, 90.00000000),
(83, 110, 'Tanki I', 4, 4.00000000, 30.00000000, 8.00000000, 102.00000000, 156.00000000),
(84, 111, 'Storage Tank I', 60, 6.00000000, 60.00000000, 6.00000000, 9.00000000, 42.00000000),
(85, 111, 'Storage Tank II', 45, 363.00000000, 453.00000000, 384.00000000, 168.00000000, 96.00000000),
(126, 132, 'Tanki IV', 270, 1043.00000000, 25.00000000, 1412.00000000, 225.00000000, 225.00000000),
(127, 132, 'Tanki III', 10, 10.00000000, 75.00000000, 20.00000000, 255.00000000, 390.00000000),
(128, 132, 'Tanki II', 108, 908.00000000, 10.00000000, 908.00000000, 90.00000000, 90.00000000),
(129, 132, 'Tanki I', 4, 4.00000000, 30.00000000, 8.00000000, 102.00000000, 156.00000000),
(130, 133, 'Storage Tank I', 80, 8.00000000, 80.00000000, 8.00000000, 12.00000000, 56.00000000),
(131, 133, 'Storage Tank II', 60, 484.00000000, 604.00000000, 512.00000000, 224.00000000, 128.00000000),
(132, 134, 'Tanki IV', 54, 45.00000000, 5.00000000, 25.00000000, 45.00000000, 45.00000000),
(133, 134, 'Tanki III', 2, 2.00000000, 15.00000000, 4.00000000, 51.00000000, 78.00000000),
(134, 135, 'Storage Tank I', 20, 2.00000000, 20.00000000, 2.00000000, 3.00000000, 14.00000000),
(135, 135, 'Storage Tank II', 15, 121.00000000, 151.00000000, 128.00000000, 56.00000000, 32.00000000),
(136, 136, 'Tanki I', 54, 45.00000000, 5.00000000, 25.00000000, 45.00000000, 45.00000000),
(137, 136, 'Tanki III', 4, 4.00000000, 30.00000000, 8.00000000, 102.00000000, 156.00000000),
(138, 136, 'Tanki IV', 54, 45.00000000, 5.00000000, 25.00000000, 45.00000000, 45.00000000),
(139, 137, 'Storage Tank I', 40, 4.00000000, 40.00000000, 4.00000000, 6.00000000, 28.00000000),
(140, 137, 'Storage Tank IV', 15, 121.00000000, 151.00000000, 128.00000000, 56.00000000, 32.00000000),
(141, 137, 'Storage Tank II', 15, 121.00000000, 151.00000000, 128.00000000, 56.00000000, 32.00000000);

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
