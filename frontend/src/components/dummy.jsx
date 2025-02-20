import { useEffect, useState } from "react";
import { Table, Container, Form, Row, Col, Button } from "react-bootstrap";

const CatatanPersediaan = () => {
  const [dataPenyimpanan, setDataPenyimpanan] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [previousDate, setPreviousDate] = useState("");

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // State untuk Sorting
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch("http://localhost:5000/data_penyimpanan")
      .then((response) => response.json())
      .then((data) => {
        setDataPenyimpanan(data);
        const dates = [...new Set(data.map((item) => item.tanggal.substring(0, 10)))]
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
    setPreviousDate(index > 0 ? availableDates[index + 1] || "" : "");
  }, [selectedDate, availableDates]);

  const filteredData = dataPenyimpanan.filter((item) => item.tanggal.startsWith(selectedDate));
  const filteredDataPrevious = dataPenyimpanan.filter((item) => item.tanggal.startsWith(previousDate));

  // Fungsi Sorting
  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
  };

  // Fungsi untuk mendapatkan data yang sudah di-sort
  const getSortedData = (data) => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  };

  // Fungsi Pagination
  const paginate = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const sortedFilteredData = getSortedData(filteredData);
  const paginatedData = paginate(sortedFilteredData);

  return (
    <Container>
      <h2 className="text-center mb-4">PERSEDIAAN PRODUKSI CPO & PKO</h2>
      <Form.Group controlId="tanggalSelect" className="mb-3">
        <Form.Label>Pilih Tanggal:</Form.Label>
        <Form.Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row>
        <Col md={6}>
          <h4 className="text-center">Data {new Date(selectedDate).toLocaleDateString()}</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th onClick={() => handleSort("tanggal")}>Tanggal {sortColumn === "tanggal" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}</th>
                <th onClick={() => handleSort("lokasi")}>Lokasi {sortColumn === "lokasi" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}</th>
                <th>Kategori</th>
                <th>Penyimpanan</th>
                <th onClick={() => handleSort("stok")}>Stok {sortColumn === "stok" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}</th>
                <th>Mutu</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.tanggal).toLocaleDateString()}</td>
                  <td>{item.lokasi}</td>
                  <td>{item.kategori?.nama}</td>
                  <td>{item.kategori?.penyimpanan?.map((p) => p.jenis_tank).join(", ")}</td>
                  <td>{item.kategori?.penyimpanan?.map((p) => p.stok).join(", ")}</td>
                  <td>Mutu Placeholder</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              ⬅️ Previous
            </Button>
            <span>Page {currentPage}</span>
            <Button disabled={paginatedData.length < itemsPerPage} onClick={() => setCurrentPage(currentPage + 1)}>
              Next ➡️
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CatatanPersediaan;
