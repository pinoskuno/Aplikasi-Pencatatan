import { useEffect, useState } from "react";
import { Table, Container, Form, Row, Col, Button } from "react-bootstrap";

const CatatanPersediaan = () => {
  const [dataPenyimpanan, setDataPenyimpanan] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [previousDate, setPreviousDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(""); // State untuk lokasi
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    if (!selectedLocation) return;

    // Ambil daftar tanggal berdasarkan lokasi yang dipilih
    const dates = [
      ...new Set(
        dataPenyimpanan
          .filter((item) => item.lokasi === selectedLocation)
          .map((item) => item.tanggal.substring(0, 10))
      ),
    ]
      .sort()
      .reverse();

    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
      setPreviousDate(dates[1] || "");
    } else {
      setSelectedDate("");
      setPreviousDate("");
    }
  }, [selectedLocation, dataPenyimpanan]);

  useEffect(() => {
    fetch("http://localhost:5000/data_penyimpanan")
      .then((response) => response.json())
      .then((data) => {
        setDataPenyimpanan(data);
        const dates = [
          ...new Set(data.map((item) => item.tanggal.substring(0, 10))),
        ]
          .sort()
          .reverse();
        setAvailableDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
          setPreviousDate(dates[1] || "");
        }

        // Ambil daftar lokasi unik
        const locations = [...new Set(data.map((item) => item.lokasi))].sort();
        setAvailableLocations(locations);
        if (locations.length > 0) {
          setSelectedLocation(locations[0]); // Set default lokasi pertama
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const index = availableDates.indexOf(selectedDate);
    setPreviousDate(index > 0 ? availableDates[index + 1] || "" : "");
  }, [selectedDate, availableDates]);

  // Filter data berdasarkan tanggal & lokasi
  const filteredData = dataPenyimpanan.filter(
    (item) =>
      item.lokasi === selectedLocation && item.tanggal.startsWith(selectedDate)
  );

  const filteredDataPrevious = dataPenyimpanan.filter(
    (item) =>
      item.lokasi === selectedLocation && item.tanggal.startsWith(previousDate)
  );

  const cpoInspecTanks = [
    "Bekri CPO Storage Tank VII",
    "Bekri CPO Storage Tank VIII",
    "Betung CPO Storage Tank II",
    "Total CPO Talang Sawit",
    "Sungai Lengi CPO Storage Tank I",
  ];
  const cpoOutspecTanks = [
    "Bekri CPO Storage Tank VI",
    "Betung CPO Storage Tank I",
    "Sungai Lengi CPO Storage Tank II",
  ];

  // Tank tambahan untuk tabel "Total Seluruh"
  const cpoInspecTotalSeluruhTanks = [
    "IPMG Boom Baru CPO Storage Tank II",
    "IPMG Boom Baru CPO Storage Tank III",
  ];
  const cpoOutspecTotalSeluruhTanks = ["IPMG Boom Baru CPO Storage Tank IV"];
  const kernelInspecLocations = ["Bekri", "Betung", "Talang Sawit"]; // Sungai Lengi dipisah

  useEffect(() => {
    const index = availableDates.indexOf(selectedDate);
    setPreviousDate(
      index >= 0 && index + 1 < availableDates.length
        ? availableDates[index + 1]
        : ""
    );
  }, [selectedDate, availableDates]);

  const filteredDataNewTabel = dataPenyimpanan.filter((item) =>
    item.tanggal.startsWith(selectedDate)
  );
  const filteredDataPreviousNewTabel = dataPenyimpanan.filter((item) =>
    item.tanggal.startsWith(previousDate)
  );

  const calculateTotals = (data) => {
    const totals = {
      cpoInspec: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
      cpoOutspec: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
      kernelInspec: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
      kernelOutspec: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
      pko: { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 },
      pkm: { stok: 0, do: 0, hi: 0 },
      totalCPO: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
      totalKernel: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
    };

    data.forEach((item) => {
      // Total PKM
      totals.pkm.stok += Number(item.pkm.nilai_pkm) || 0;
      totals.pkm.do += Number(item.pkm.nilai_do) || 0;
      totals.pkm.hi += Number(item.pkm.nilai_hi) || 0;

      // Total Kernel Inspec (Bekri, Betung, Talang Sawit)
      if (kernelInspecLocations.includes(item.lokasi)) {
        totals.kernelInspec.stok += Number(item.kernel.stok) || 0;
        totals.kernelInspec.alb += Number(item.kernel.alb) || 0;
        totals.kernelInspec.kadar_air += Number(item.kernel.kadar_air) || 0;
        totals.kernelInspec.kadar_kotoran +=
          Number(item.kernel.kadar_kotoran) || 0;
        totals.kernelInspec.do += Number(item.kernel.do) || 0;
        totals.kernelInspec.hi += Number(item.kernel.hi) || 0;

        // Tambahkan ke totalKernel untuk Bekri, Betung, Talang Sawit
        totals.totalKernel.stok += Number(item.kernel.stok) || 0;
        totals.totalKernel.alb += Number(item.kernel.alb) || 0;
        totals.totalKernel.kadar_air += Number(item.kernel.kadar_air) || 0;
        totals.totalKernel.kadar_kotoran +=
          Number(item.kernel.kadar_kotoran) || 0;
        totals.totalKernel.do += Number(item.kernel.do) || 0;
        totals.totalKernel.hi += Number(item.kernel.hi) || 0;
      }

      // Total CPO, PKO, dan Kernel Lengi dari kategori
      Object.values(item.kategori).forEach((kat) => {
        if (kat.nama === "PKO") {
          kat.penyimpanan.forEach((penyimpanan) => {
            totals.pko.stok += Number(penyimpanan.stok) || 0;
            totals.pko.alb += Number(penyimpanan.alb) || 0;
            totals.pko.kadar_air += Number(penyimpanan.kadar_air) || 0;
            totals.pko.kadar_kotoran += Number(penyimpanan.kadar_kotoran) || 0;
            totals.pko.do += Number(penyimpanan.do) || 0;
            totals.pko.hi += Number(penyimpanan.hi) || 0;
          });
        } else if (kat.nama === "CPO") {
          kat.penyimpanan.forEach((penyimpanan) => {
            const fullTankName = `${item.lokasi} CPO ${penyimpanan.jenis_tank}`;
            if (cpoInspecTanks.includes(fullTankName)) {
              totals.cpoInspec.stok += Number(penyimpanan.stok) || 0;
              totals.cpoInspec.alb += Number(penyimpanan.alb) || 0;
              totals.cpoInspec.kadar_air += Number(penyimpanan.kadar_air) || 0;
              totals.cpoInspec.kadar_kotoran +=
                Number(penyimpanan.kadar_kotoran) || 0;
              totals.cpoInspec.do += Number(penyimpanan.do) || 0;
              totals.cpoInspec.hi += Number(penyimpanan.hi) || 0;

              // Tambahkan ke totalCPO
              totals.totalCPO.stok += Number(penyimpanan.stok) || 0;
              totals.totalCPO.alb += Number(penyimpanan.alb) || 0;
              totals.totalCPO.kadar_air += Number(penyimpanan.kadar_air) || 0;
              totals.totalCPO.kadar_kotoran +=
                Number(penyimpanan.kadar_kotoran) || 0;
              totals.totalCPO.do += Number(penyimpanan.do) || 0;
              totals.totalCPO.hi += Number(penyimpanan.hi) || 0;
            } else if (cpoOutspecTanks.includes(fullTankName)) {
              totals.cpoOutspec.stok += Number(penyimpanan.stok) || 0;
              totals.cpoOutspec.alb += Number(penyimpanan.alb) || 0;
              totals.cpoOutspec.kadar_air += Number(penyimpanan.kadar_air) || 0;
              totals.cpoOutspec.kadar_kotoran +=
                Number(penyimpanan.kadar_kotoran) || 0;
              totals.cpoOutspec.do += Number(penyimpanan.do) || 0;
              totals.cpoOutspec.hi += Number(penyimpanan.hi) || 0;
            }
          });
        } else if (
          kat.nama === "Kernel Lengi" &&
          item.lokasi === "Sungai Lengi"
        ) {
          kat.penyimpanan.forEach((penyimpanan) => {
            const fullTankName = `${item.lokasi} Kernel Lengi ${penyimpanan.jenis_tank}`;
            // Kernel Inspec: Gudang Pabrik
            if (fullTankName === "Sungai Lengi Kernel Lengi Gudang Pabrik") {
              totals.kernelInspec.stok += Number(penyimpanan.stok) || 0;
              totals.kernelInspec.alb += Number(penyimpanan.alb) || 0;
              totals.kernelInspec.kadar_air +=
                Number(penyimpanan.kadar_air) || 0;
              totals.kernelInspec.kadar_kotoran +=
                Number(penyimpanan.kadar_kotoran) || 0;
              totals.kernelInspec.do += Number(penyimpanan.do) || 0;
              totals.kernelInspec.hi += Number(penyimpanan.hi) || 0;
            }
            // Kernel Outspec: Gudang Repa
            if (fullTankName === "Sungai Lengi Kernel Lengi Gudang Repa") {
              totals.kernelOutspec.stok += Number(penyimpanan.stok) || 0;
              totals.kernelOutspec.alb += Number(penyimpanan.alb) || 0;
              totals.kernelOutspec.kadar_air +=
                Number(penyimpanan.kadar_air) || 0;
              totals.kernelOutspec.kadar_kotoran +=
                Number(penyimpanan.kadar_kotoran) || 0;
              totals.kernelOutspec.do += Number(penyimpanan.do) || 0;
              totals.kernelOutspec.hi += Number(penyimpanan.hi) || 0;
            }
            // Total Kernel: Gudang Pabrik + Gudang Repa
            if (
              fullTankName === "Sungai Lengi Kernel Lengi Gudang Pabrik" ||
              fullTankName === "Sungai Lengi Kernel Lengi Gudang Repa"
            ) {
              totals.totalKernel.stok += Number(penyimpanan.stok) || 0;
              totals.totalKernel.alb += Number(penyimpanan.alb) || 0;
              totals.totalKernel.kadar_air +=
                Number(penyimpanan.kadar_air) || 0;
              totals.totalKernel.kadar_kotoran +=
                Number(penyimpanan.kadar_kotoran) || 0;
              totals.totalKernel.do += Number(penyimpanan.do) || 0;
              totals.totalKernel.hi += Number(penyimpanan.hi) || 0;
            }
          });
        }
      });
    });

    console.log("Calculated Totals:", totals);
    return totals;
  };

  // Fungsi untuk menghitung tabel "Total Seluruh"
  const calculateTotalSeluruh = (data, totalsAtas) => {
    const totals = {
      cpoInspec: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
      cpoOutspec: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
      jumlahInspec: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
      jumlahTotal: {
        stok: 0,
        alb: 0,
        kadar_air: 0,
        kadar_kotoran: 0,
        do: 0,
        hi: 0,
      },
    };

    // Ambil totalCPO dari tabel atas sebagai dasar CPO Inspec
    totals.cpoInspec.stok = totalsAtas.totalCPO.stok;
    totals.cpoInspec.alb = totalsAtas.totalCPO.alb;
    totals.cpoInspec.kadar_air = totalsAtas.totalCPO.kadar_air;
    totals.cpoInspec.kadar_kotoran = totalsAtas.totalCPO.kadar_kotoran;
    totals.cpoInspec.do = totalsAtas.totalCPO.do;
    totals.cpoInspec.hi = totalsAtas.totalCPO.hi;

    // Tambahkan data dari tank tambahan untuk CPO Inspec dan Outspec
    data.forEach((item) => {
      Object.values(item.kategori).forEach((kat) => {
        if (kat.nama === "CPO") {
          kat.penyimpanan.forEach((penyimpanan) => {
            const fullTankName = `${item.lokasi} CPO ${penyimpanan.jenis_tank}`;
            if (cpoInspecTotalSeluruhTanks.includes(fullTankName)) {
              totals.cpoInspec.stok += Number(penyimpanan.stok) || 0;
              totals.cpoInspec.alb += Number(penyimpanan.alb) || 0;
              totals.cpoInspec.kadar_air += Number(penyimpanan.kadar_air) || 0;
              totals.cpoInspec.kadar_kotoran +=
                Number(penyimpanan.kadar_kotoran) || 0;
              totals.cpoInspec.do += Number(penyimpanan.do) || 0;
              totals.cpoInspec.hi += Number(penyimpanan.hi) || 0;
            } else if (cpoOutspecTotalSeluruhTanks.includes(fullTankName)) {
              totals.cpoOutspec.stok += Number(penyimpanan.stok) || 0;
              totals.cpoOutspec.alb += Number(penyimpanan.alb) || 0;
              totals.cpoOutspec.kadar_air += Number(penyimpanan.kadar_air) || 0;
              totals.cpoOutspec.kadar_kotoran +=
                Number(penyimpanan.kadar_kotoran) || 0;
              totals.cpoOutspec.do += Number(penyimpanan.do) || 0;
              totals.cpoOutspec.hi += Number(penyimpanan.hi) || 0;
            }
          });
        }
      });
    });

    // Hitung jumlahTotal (CPO Inspec + CPO Outspec)
    totals.jumlahTotal.stok = totals.cpoInspec.stok + totals.cpoOutspec.stok;
    totals.jumlahTotal.alb = totals.cpoInspec.alb + totals.cpoOutspec.alb;
    totals.jumlahTotal.kadar_air =
      totals.cpoInspec.kadar_air + totals.cpoOutspec.kadar_air;
    totals.jumlahTotal.kadar_kotoran =
      totals.cpoInspec.kadar_kotoran + totals.cpoOutspec.kadar_kotoran;
    totals.jumlahTotal.do = totals.cpoInspec.do + totals.cpoOutspec.do;
    totals.jumlahTotal.hi = totals.cpoInspec.hi + totals.cpoOutspec.hi;

    console.log("Total Seluruh:", totals);
    return totals;
  };

  const currentTotals = calculateTotals(filteredDataNewTabel);
  const previousTotals = calculateTotals(filteredDataPreviousNewTabel);
  const currentTotalSeluruh = calculateTotalSeluruh(
    filteredDataNewTabel,
    currentTotals
  );
  const previousTotalSeluruh = calculateTotalSeluruh(
    filteredDataPreviousNewTabel,
    previousTotals
  );

  const handleDelete = () => {
    if (!filteredData.length) {
      alert("Tidak ada data untuk dihapus pada tanggal dan lokasi ini.");
      return;
    }
  
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus semua data untuk tanggal ${selectedDate} dan lokasi ${selectedLocation}?`
      )
    ) {
      fetch(
        `http://localhost:5000/data_penyimpanan/by_date_location?date=${selectedDate}&location=${selectedLocation}`,
        { method: "DELETE" }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Data berhasil dihapus") {
            setDataPenyimpanan(
              dataPenyimpanan.filter(
                (item) =>
                  !(
                    item.lokasi === selectedLocation &&
                    item.tanggal.startsWith(selectedDate)
                  )
              )
            );
            alert("Data berhasil dihapus.");
          }
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
          alert("Terjadi kesalahan saat menghapus data.");
        });
    }
  };

  const renderTable = (totals, title, isTotalSeluruh = false) => (
    <Col md={6}>
      <h4 className="text-center">{title}</h4>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th rowSpan={2} colSpan={2} className="text-center text-black">Kategori</th>
              <th rowSpan={2}>Stok</th>
              <th colSpan={3} className="text-center text-black">
                Mutu
              </th>
              <th colSpan={2} className="text-center text-black">
                DO
              </th>
            </tr>
            <tr>
              <th>ALB</th>
              <th>Kadar Air</th>
              <th>Kadar Kotoran</th>
              <th>Hi</th>
              <th>Sd Hi</th>
            </tr>
          </thead>
          <tbody>
            {isTotalSeluruh ? (
              <>
                <tr>
                  <td rowSpan={2}><strong>CPO</strong></td>
                  <td><strong>Inspec</strong></td>
                  <td>{totals.cpoInspec.stok}</td>
                  <td>{totals.cpoInspec.alb}</td>
                  <td>{totals.cpoInspec.kadar_air}</td>
                  <td>{totals.cpoInspec.kadar_kotoran}</td>
                  <td>{totals.cpoInspec.do}</td>
                  <td>{totals.cpoInspec.hi}</td>
                </tr>
                <tr>
                  <td><strong>Outspec</strong></td>
                  <td>{totals.cpoOutspec.stok}</td>
                  <td>{totals.cpoOutspec.alb}</td>
                  <td>{totals.cpoOutspec.kadar_air}</td>
                  <td>{totals.cpoOutspec.kadar_kotoran}</td>
                  <td>{totals.cpoOutspec.do}</td>
                  <td>{totals.cpoOutspec.hi}</td>
                </tr>
                <tr>
                  <td colSpan={2}><strong>Jumlah (Total)</strong></td>
                  <td>{totals.jumlahTotal.stok}</td>
                  <td>{totals.jumlahTotal.alb}</td>
                  <td>{totals.jumlahTotal.kadar_air}</td>
                  <td>{totals.jumlahTotal.kadar_kotoran}</td>
                  <td>{totals.jumlahTotal.do}</td>
                  <td>{totals.jumlahTotal.hi}</td>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <td rowSpan={2}><strong>CPO</strong></td>
                  <td><strong>Inspec</strong></td>
                  <td>{totals.cpoInspec.stok}</td>
                  <td>{totals.cpoInspec.alb}</td>
                  <td>{totals.cpoInspec.kadar_air}</td>
                  <td>{totals.cpoInspec.kadar_kotoran}</td>
                  <td>{totals.cpoInspec.do}</td>
                  <td>{totals.cpoInspec.hi}</td>
                </tr>
                <tr>
                  <td><strong>Outspec</strong></td>
                  <td>{totals.cpoOutspec.stok}</td>
                  <td>{totals.cpoOutspec.alb}</td>
                  <td>{totals.cpoOutspec.kadar_air}</td>
                  <td>{totals.cpoOutspec.kadar_kotoran}</td>
                  <td>{totals.cpoOutspec.do}</td>
                  <td>{totals.cpoOutspec.hi}</td>
                </tr>
                <tr>
                  <td colSpan={2}><strong>Total CPO</strong></td>
                  <td>{totals.totalCPO.stok}</td>
                  <td>{totals.totalCPO.alb}</td>
                  <td>{totals.totalCPO.kadar_air}</td>
                  <td>{totals.totalCPO.kadar_kotoran}</td>
                  <td>{totals.totalCPO.do}</td>
                  <td>{totals.totalCPO.hi}</td>
                </tr>
                <tr>
                  <td rowSpan={2}><strong>Kernel</strong></td>
                  <td><strong>Inspec</strong></td>
                  <td>{totals.kernelInspec.stok}</td>
                  <td>{totals.kernelInspec.alb}</td>
                  <td>{totals.kernelInspec.kadar_air}</td>
                  <td>{totals.kernelInspec.kadar_kotoran}</td>
                  <td>{totals.kernelInspec.do}</td>
                  <td>{totals.kernelInspec.hi}</td>
                </tr>
                <tr>
                  <td><strong>Outspec</strong></td>
                  <td>{totals.kernelOutspec.stok}</td>
                  <td>{totals.kernelOutspec.alb}</td>
                  <td>{totals.kernelOutspec.kadar_air}</td>
                  <td>{totals.kernelOutspec.kadar_kotoran}</td>
                  <td>{totals.kernelOutspec.do}</td>
                  <td>{totals.kernelOutspec.hi}</td>
                </tr>
                <tr>
                  <td colSpan={2}><strong>Total Kernel</strong></td>
                  <td>{totals.totalKernel.stok}</td>
                  <td>{totals.totalKernel.alb}</td>
                  <td>{totals.totalKernel.kadar_air}</td>
                  <td>{totals.totalKernel.kadar_kotoran}</td>
                  <td>{totals.totalKernel.do}</td>
                  <td>{totals.totalKernel.hi}</td>
                </tr>
                <tr>
                  <td colSpan={2}><strong>PKO</strong></td>
                  <td>{totals.pko.stok}</td>
                  <td>{totals.pko.alb}</td>
                  <td>{totals.pko.kadar_air}</td>
                  <td>{totals.pko.kadar_kotoran}</td>
                  <td>{totals.pko.do}</td>
                  <td>{totals.pko.hi}</td>
                </tr>
                <tr>
                  <td colSpan={2}><strong>PKM</strong></td>
                  <td>{totals.pkm.stok}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>{totals.pkm.do}</td>
                  <td>{totals.pkm.hi}</td>
                </tr>
              </>
            )}
          </tbody>
        </Table>
      </div>
    </Col>
  );

  return (
    <Container>
      <h2 class="text-center mb-4 fw-bolder center mt-4">
        <span class="text-gradient d-inline">
          PERSEDIAAN PRODUKSI
        </span>
      </h2>
      <Row className="mb-3 align-items-end">
  <Col md={4}>
    <Form.Group controlId="tanggalSelect">
      <Form.Label>Pilih Tanggal:</Form.Label>
      <Form.Select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        {availableDates.map((date) => (
          <option key={date} value={date}>
            {new Date(date).toLocaleDateString()}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>
  <Col md={4}>
    <Form.Group controlId="lokasiSelect">
      <Form.Label>Pilih Lokasi:</Form.Label>
      <Form.Select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      >
        {availableLocations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>
  <Col md={4}>
    <Button variant="danger" onClick={handleDelete} className="w-100">
      Hapus Data Hari Ini
    </Button>
  </Col>
</Row>
      <Row className="d-flex flex-warp">
        <Col md={6}>
          <h4 className="text-center">
            Data Sebelumnya
          </h4>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th rowSpan={2}>Kategori</th>
                  <th rowSpan={2}>Penyimpanan</th>
                  <th rowSpan={2}>Stok</th>
                  <th colSpan={3} className="text-center text-black">
                    Mutu
                  </th>
                  <th colSpan={2} className="text-center text-black">
                    DO
                  </th>
                </tr>
                <tr>
                  <th>ALB</th>
                  <th>Kadar Air</th>
                  <th>Kadar Kotoran</th>
                  <th>Hi</th>
                  <th>Sd Hi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataPrevious.map((item, index) => (
                  <>
                    {/* Loop kategori dan penyimpanan */}
                    {Object.values(item.kategori).map((kat, katIndex) => (
                      <>
                        {/* Baris kategori */}
                        <tr
                          key={`kat-${index}-${katIndex}`}
                          className="table-primary"
                        >
                          <td rowSpan={kat.penyimpanan.length + 1}>
                            <strong>{kat.nama}</strong>
                          </td>
                        </tr>

                        {/* Loop setiap penyimpanan nilai dalam kategori */}
                        {kat.penyimpanan.map((penyimpanan, penyIndex) => (
                          <tr key={`peny-${index}-${katIndex}-${penyIndex}`}>
                            <td>{penyimpanan.jenis_tank}</td>
                            <td>{penyimpanan.stok}</td>
                            <td>{penyimpanan.alb}</td>
                            <td>{penyimpanan.kadar_air}</td>
                            <td>{penyimpanan.kadar_kotoran}</td>
                            <td>{penyimpanan.do}</td>
                            <td>{penyimpanan.hi}</td>
                          </tr>
                        ))}

                        {/* Baris jumlah untuk kategori */}
                        <tr
                          key={`jumlah-${index}-${katIndex}`}
                          className="table-secondary"
                        >
                          <td colSpan={2}>
                            <strong>Total {kat.nama}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.stok}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.alb}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.kadar_air}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.kadar_kotoran}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.do}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.hi}</strong>
                          </td>
                        </tr>
                      </>
                    ))}

                    {/* Pindahkan bagian PKM dan Kernel ke bawah setelah kategori */}
                    <tr key={`pkm-${index}`} className="table-warning">
                      <td colSpan={2}>
                        <strong>PKM</strong>
                      </td>
                      <td>{item.pkm.nilai_pkm}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{item.pkm.nilai_do}</td>
                      <td>{item.pkm.nilai_hi}</td>
                    </tr>

                    <tr key={`kernel-${index}`} className="table-warning">
                      <td colSpan={2}>
                        <strong>Kernel</strong>
                      </td>
                      <td>{item.kernel.stok}</td>
                      <td>{item.kernel.alb}</td>
                      <td>{item.kernel.kadar_air}</td>
                      <td>{item.kernel.kadar_kotoran}</td>
                      <td>{item.kernel.do}</td>
                      <td>{item.kernel.hi}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
        <Col md={6}>
          <h4 className="text-center">
            Data Hari Ini
          </h4>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
               
                  <th rowSpan={2}>Kategori</th>
                  <th rowSpan={2}>Penyimpanan</th>
                  <th rowSpan={2}>Stok</th>
                  <th colSpan={3} className="text-center text-black">
                    Mutu
                  </th>
                  <th colSpan={2} className="text-center text-black">
                    DO
                  </th>
                </tr>
                <tr>
                  <th>ALB</th>
                  <th>Kadar Air</th>
                  <th>Kadar Kotoran</th>
                  <th>Hi</th>
                  <th>Sd Hi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <>

                    {/* Loop kategori dan penyimpanan */}
                    {Object.values(item.kategori).map((kat, katIndex) => (
                      <>
                        {/* Baris kategori */}
                        <tr
                          key={`kat-${index}-${katIndex}`}
                          className="table-primary"
                        >
                          <td rowSpan={kat.penyimpanan.length + 1}>
                            <strong>{kat.nama}</strong>
                          </td>
                        </tr>

                        {/* Loop setiap penyimpanan nilai dalam kategori */}
                        {kat.penyimpanan.map((penyimpanan, penyIndex) => (
                          <tr key={`peny-${index}-${katIndex}-${penyIndex}`}>
                            <td>{penyimpanan.jenis_tank}</td>
                            <td>{penyimpanan.stok}</td>
                            <td>{penyimpanan.alb}</td>
                            <td>{penyimpanan.kadar_air}</td>
                            <td>{penyimpanan.kadar_kotoran}</td>
                            <td>{penyimpanan.do}</td>
                            <td>{penyimpanan.hi}</td>
                          </tr>
                        ))}

                        {/* Baris jumlah untuk kategori */}
                        <tr
                          key={`jumlah-${index}-${katIndex}`}
                          className="table-secondary"
                        >
                          <td colSpan={2}>
                            <strong>Total {kat.nama}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.stok}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.alb}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.kadar_air}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.kadar_kotoran}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.do}</strong>
                          </td>
                          <td>
                            <strong>{kat.jumlah.hi}</strong>
                          </td>
                        </tr>
                      </>
                    ))}

                    {/* PKM dan Kernel diletakkan di bawah setelah kategori */}
                    <tr key={`pkm-${index}`} className="table-warning">
                      <td colSpan={2}>
                        <strong>PKM</strong>
                      </td>
                      <td>{item.pkm.nilai_pkm}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{item.pkm.nilai_do}</td>
                      <td>{item.pkm.nilai_hi}</td>
                    </tr>

                    <tr key={`kernel-${index}`} className="table-warning">
                      <td colSpan={2}>
                        <strong>Kernel</strong>
                      </td>
                      <td>{item.kernel.stok}</td>
                      <td>{item.kernel.alb}</td>
                      <td>{item.kernel.kadar_air}</td>
                      <td>{item.kernel.kadar_kotoran}</td>
                      <td>{item.kernel.do}</td>
                      <td>{item.kernel.hi}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Row>
        {selectedDate && (
          <>
            <Row>
              <h2 className="mt-4 text-center text-gradient mb-4">
                Total Persediaan Seluruh PKS
              </h2>
              {renderTable(previousTotals , `Data Sebelumnya`)}
              {previousDate && renderTable(currentTotals, `Data Hari Ini`)}
            </Row>
            <Row className="mt-4">
              <h2 className="mt-4 text-center text-gradient mb-4">
                Total Seluruh Persediaan Regional VII
              </h2>
              {renderTable(previousTotalSeluruh, `Total Seluruh Sebelumnya `, true)}
              {previousDate &&
                renderTable(
                   currentTotalSeluruh,
                  `Total Seluruh Hari Ini`,
                  true
                )}
            </Row>
          </>
        )}
      </Row>
    </Container>
  );
};

export default CatatanPersediaan;
