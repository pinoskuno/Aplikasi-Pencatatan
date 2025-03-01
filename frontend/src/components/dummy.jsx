import { useEffect, useState } from "react";
import { Table, Container, Form, Row, Col } from "react-bootstrap";

const TotalPersediaan = () => {
  const [dataPenyimpanan, setDataPenyimpanan] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [previousDate, setPreviousDate] = useState("");

  // Daftar penyimpanan untuk CPO dan Kernel
  const cpoInspecTanks = [
    "Bekri CPO Storage Tank VII",
    "Bekri CPO Storage Tank VIII",
    "Betung CPO Storage Tank II",
    "Talang Swit CPO Talang Sawit",
    "Sungai Lengi CPO Storage Tank I",
  ];
  const cpoOutspecTanks = [
    "Bekri CPO Storage Tank VI",
    "Betung CPO Storage Tank I",
    "Sungai Lengi CPO Storage Tank II",
  ];
  const kernelInspecTanks = [
    "Bekri Kernel",
    "Betung Kernel",
    "Talang Sawit Kernel",
    "Sungai Lengi Kernel",
  ];
  const kernelOutspecTanks = [
    "Sungai Lengi Kernel",
    "Gudang Repa kernel",
  ];

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
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const index = availableDates.indexOf(selectedDate);
    setPreviousDate(index >= 0 && index + 1 < availableDates.length ? availableDates[index + 1] : "");
  }, [selectedDate, availableDates]);

  // Filter data berdasarkan tanggal saja (tanpa lokasi)
  const filteredData = dataPenyimpanan.filter((item) =>
    item.tanggal.startsWith(selectedDate)
  );
  const filteredDataPrevious = dataPenyimpanan.filter((item) =>
    item.tanggal.startsWith(previousDate)
  );

  // Fungsi untuk menghitung total berdasarkan data
  const calculateTotals = (data) => {
    const totals = {
      cpoInspec: { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 },
      cpoOutspec: { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 },
      kernelInspec: { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 },
      kernelOutspec: { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 },
      pko: { stok: 0, alb: 0, kadar_air: 0, kadar_kotoran: 0, do: 0, hi: 0 },
      pkm: { stok: 0, do: 0, hi: 0 },
    };

    data.forEach((item) => {
      // Total PKM
      totals.pkm.stok += item.pkm.nilai_pkm || 0;
      totals.pkm.do += item.pkm.nilai_do || 0;
      totals.pkm.hi += item.pkm.nilai_hi || 0;

      // Total Kategori (CPO, PKO, dan Kernel)
      Object.values(item.kategori).forEach((kat) => {
        if (kat.nama === "PKO") {
          // Total PKO dari jumlah
          totals.pko.stok += kat.jumlah.stok || 0;
          totals.pko.alb += kat.jumlah.alb || 0;
          totals.pko.kadar_air += kat.jumlah.kadar_air || 0;
          totals.pko.kadar_kotoran += kat.jumlah.kadar_kotoran || 0;
          totals.pko.do += kat.jumlah.do || 0;
          totals.pko.hi += kat.jumlah.hi || 0;
        } else if (kat.nama === "CPO") {
          kat.penyimpanan.forEach((penyimpanan) => {
            if (cpoInspecTanks.includes(penyimpanan.jenis_tank)) {
              totals.cpoInspec.stok += penyimpanan.stok || 0;
              totals.cpoInspec.alb += penyimpanan.alb || 0;
              totals.cpoInspec.kadar_air += penyimpanan.kadar_air || 0;
              totals.cpoInspec.kadar_kotoran += penyimpanan.kadar_kotoran || 0;
              totals.cpoInspec.do += penyimpanan.do || 0;
              totals.cpoInspec.hi += penyimpanan.hi || 0;
            } else if (cpoOutspecTanks.includes(penyimpanan.jenis_tank)) {
              totals.cpoOutspec.stok += penyimpanan.stok || 0;
              totals.cpoOutspec.alb += penyimpanan.alb || 0;
              totals.cpoOutspec.kadar_air += penyimpanan.kadar_air || 0;
              totals.cpoOutspec.kadar_kotoran += penyimpanan.kadar_kotoran || 0;
              totals.cpoOutspec.do += penyimpanan.do || 0;
              totals.cpoOutspec.hi += penyimpanan.hi || 0;
            }
          });
        } else if (kat.nama === "Kernel") {
          kat.penyimpanan.forEach((penyimpanan) => {
            if (kernelInspecTanks.includes(penyimpanan.jenis_tank)) {
              totals.kernelInspec.stok += penyimpanan.stok || 0;
              totals.kernelInspec.alb += penyimpanan.alb || 0;
              totals.kernelInspec.kadar_air += penyimpanan.kadar_air || 0;
              totals.kernelInspec.kadar_kotoran += penyimpanan.kadar_kotoran || 0;
              totals.kernelInspec.do += penyimpanan.do || 0;
              totals.kernelInspec.hi += penyimpanan.hi || 0;
            }
            if (kernelOutspecTanks.includes(penyimpanan.jenis_tank)) {
              totals.kernelOutspec.stok += penyimpanan.stok || 0;
              totals.kernelOutspec.alb += penyimpanan.alb || 0;
              totals.kernelOutspec.kadar_air += penyimpanan.kadar_air || 0;
              totals.kernelOutspec.kadar_kotoran += penyimpanan.kadar_kotoran || 0;
              totals.kernelOutspec.do += penyimpanan.do || 0;
              totals.kernelOutspec.hi += penyimpanan.hi || 0;
            }
          });
        }
      });
    });

    return totals;
  };

  const currentTotals = calculateTotals(filteredData);
  const previousTotals = calculateTotals(filteredDataPrevious);

  const renderTable = (totals, title) => (
    <Col md={6}>
      <h4 className="text-center">{title}</h4>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th rowSpan={2}>Kategori</th>
              <th rowSpan={2}>Stok</th>
              <th colSpan={3} className="text-center">Mutu</th>
              <th colSpan={2} className="text-center">DO</th>
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
            <tr>
              <td>CPO Inspec</td>
              <td>{totals.cpoInspec.stok}</td>
              <td>{totals.cpoInspec.alb}</td>
              <td>{totals.cpoInspec.kadar_air}</td>
              <td>{totals.cpoInspec.kadar_kotoran}</td>
              <td>{totals.cpoInspec.do}</td>
              <td>{totals.cpoInspec.hi}</td>
            </tr>
            <tr>
              <td>CPO Outspec</td>
              <td>{totals.cpoOutspec.stok}</td>
              <td>{totals.cpoOutspec.alb}</td>
              <td>{totals.cpoOutspec.kadar_air}</td>
              <td>{totals.cpoOutspec.kadar_kotoran}</td>
              <td>{totals.cpoOutspec.do}</td>
              <td>{totals.cpoOutspec.hi}</td>
            </tr>
            <tr>
              <td>Kernel Inspec</td>
              <td>{totals.kernelInspec.stok}</td>
              <td>{totals.kernelInspec.alb}</td>
              <td>{totals.kernelInspec.kadar_air}</td>
              <td>{totals.kernelInspec.kadar_kotoran}</td>
              <td>{totals.kernelInspec.do}</td>
              <td>{totals.kernelInspec.hi}</td>
            </tr>
            <tr>
              <td>Kernel Outspec</td>
              <td>{totals.kernelOutspec.stok}</td>
              <td>{totals.kernelOutspec.alb}</td>
              <td>{totals.kernelOutspec.kadar_air}</td>
              <td>{totals.kernelOutspec.kadar_kotoran}</td>
              <td>{totals.kernelOutspec.do}</td>
              <td>{totals.kernelOutspec.hi}</td>
            </tr>
            <tr>
              <td>PKO</td>
              <td>{totals.pko.stok}</td>
              <td>{totals.pko.alb}</td>
              <td>{totals.pko.kadar_air}</td>
              <td>{totals.pko.kadar_kotoran}</td>
              <td>{totals.pko.do}</td>
              <td>{totals.pko.hi}</td>
            </tr>
            <tr>
              <td>PKM</td>
              <td>{totals.pkm.stok}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>{totals.pkm.do}</td>
              <td>{totals.pkm.hi}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Col>
  );

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Total Persediaan Semua Lokasi</h2>
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Form.Group controlId="dateSelect">
            <Form.Label>Pilih Tanggal</Form.Label>
            <Form.Control
              as="select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Pilih Tanggal</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      {selectedDate && (
        <Row>
          {renderTable(currentTotals, `Data ${new Date(selectedDate).toLocaleDateString()}`)}
          {previousDate && renderTable(previousTotals, `Data Sebelumnya ${new Date(previousDate).toLocaleDateString()}`)}
        </Row>
      )}
    </Container>
  );
};

export default TotalPersediaan;