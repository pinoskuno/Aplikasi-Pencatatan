import { useEffect, useState } from "react";
import { Table, Container, Form, Row, Col } from "react-bootstrap";

const CatatanPersediaan = () => {
  const [dataPenyimpanan, setDataPenyimpanan] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [previousDate, setPreviousDate] = useState("");

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
    setPreviousDate(index > 0 ? availableDates[index + 1] || "" : "");
  }, [selectedDate, availableDates]);

  const filteredData = dataPenyimpanan.filter((item) =>
    item.tanggal.startsWith(selectedDate)
  );
  return (
    <Container>
      <h2 className="text-center mb-4">PERSEDIAAN PRODUKSI CPO & PKO</h2>
      <Form.Group controlId="tanggalSelect" className="mb-3">
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
      <Row className="d-flex flex-warp">
        <Col md={6}>
          <h4 className="text-center">
            Data {new Date(selectedDate).toLocaleDateString()}
          </h4>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th rowSpan={2}>Tanggal</th>
                  <th rowSpan={2}>Lokasi</th>
                  <th rowSpan={2}>Kategori</th>
                  <th rowSpan={2}>Penyimpanan</th>
                  <th rowSpan={2}>Stok</th>
                  <th colSpan={3} className="text-center">
                    Mutu
                  </th>
                  <th colSpan={2} className="text-center">
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
                    {/* Baris utama untuk PKM dan Kernel */}
                    <tr key={`main-${index}`}>
                      <td
                        rowSpan={Object.keys(item.kategori).reduce(
                          (acc, key) =>
                            acc + item.kategori[key].penyimpanan.length + 4,
                          1
                        )}
                      >
                        {new Date(item.tanggal).toLocaleDateString()}
                      </td>
                      <td
                        rowSpan={Object.keys(item.kategori).reduce(
                          (acc, key) =>
                            acc + item.kategori[key].penyimpanan.length + 4,
                          1
                        )}
                      >
                        {item.lokasi}
                      </td>
                    </tr>

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

                        {/* Loop setiap penyimpanan dalam kategori PKM*/}
                        <tr key={`pkm-${index}-${katIndex}`}>
                          <td>
                            <strong>PKM</strong>
                          </td>
                          <td>{}</td>
                          <td>{item.pkm.stok}</td>
                          <td>{}</td>
                          <td>{}</td>
                          <td>{}</td>
                          <td>{item.pkm.nilai_do}</td>
                          <td>{item.pkm.nilai_hi}</td>
                        </tr>

                        {/* Loop setiap penyimpanan dalam kategori Kernel*/}
                        <tr key={`kernel-${index}-${katIndex}`}>
                          <td>
                            <strong>Kernel</strong>
                          </td>
                          <td>{}</td>
                          <td>{item.kernel.stok}</td>
                          <td>{item.kernel.alb}</td>
                          <td>{item.kernel.kadar_air}</td>
                          <td>{item.kernel.kadar_kotoran}</td>
                          <td>{item.kernel.do}</td>
                          <td>{item.kernel.hi}</td>
                        </tr>

                        {/* Baris jumlah untuk kategori */}
                        <tr
                          key={`jumlah-${index}-${katIndex}`}
                          className="table-secondary"
                        >
                          <td>
                            <strong>Total {kat.nama}</strong>
                          </td>
                          <td>{}</td>
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
                  </>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
        <Col md={6}>
          <h4 className="text-center">
            Data{" "}
            {previousDate
              ? new Date(previousDate).toLocaleDateString()
              : "Sebelumnya"}
          </h4>
          <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th rowSpan={2}>Tanggal</th>
                <th rowSpan={2}>Lokasi</th>
                <th rowSpan={2}>Kategori</th>
                <th rowSpan={2}>Penyimpanan</th>
                <th rowSpan={2}>Stok</th>
                <th colSpan={3} className="text-center">
                  Mutu
                </th>
                <th colSpan={2} className="text-center">
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
                  {/* Baris utama untuk PKM dan Kernel */}
                  <tr key={`main-${index}`}>
                    <td
                      rowSpan={Object.keys(item.kategori).reduce(
                        (acc, key) =>
                          acc + item.kategori[key].penyimpanan.length + 4,
                        1
                      )}
                    >
                      {new Date(item.tanggal).toLocaleDateString()}
                    </td>
                    <td
                      rowSpan={Object.keys(item.kategori).reduce(
                        (acc, key) =>
                          acc + item.kategori[key].penyimpanan.length + 4,
                        1
                      )}
                    >
                      {item.lokasi}
                    </td>
                  </tr>

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

                      {/* Loop setiap penyimpanan dalam kategori PKM*/}
                      <tr key={`pkm-${index}-${katIndex}`}>
                        <td>
                          <strong>PKM</strong>
                        </td>
                        <td>{}</td>
                        <td>{item.pkm.stok}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{item.pkm.nilai_do}</td>
                        <td>{item.pkm.nilai_hi}</td>
                      </tr>

                      {/* Loop setiap penyimpanan dalam kategori Kernel*/}
                      <tr key={`kernel-${index}-${katIndex}`}>
                        <td>
                          <strong>Kernel</strong>
                        </td>
                        <td>{}</td>
                        <td>{item.kernel.stok}</td>
                        <td>{item.kernel.alb}</td>
                        <td>{item.kernel.kadar_air}</td>
                        <td>{item.kernel.kadar_kotoran}</td>
                        <td>{item.kernel.do}</td>
                        <td>{item.kernel.hi}</td>
                      </tr>

                      {/* Baris jumlah untuk kategori */}
                      <tr
                        key={`jumlah-${index}-${katIndex}`}
                        className="table-secondary"
                      >
                        <td>
                          <strong>Total {kat.nama}</strong>
                        </td>
                        <td>{}</td>
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
                </>
              ))}
            </tbody>
          </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CatatanPersediaan;
