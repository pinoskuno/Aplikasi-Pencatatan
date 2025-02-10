import { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";

const CatatanPersediaan = () => {
  const [dataPenyimpanan, setDataPenyimpanan] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/data_penyimpanan")
      .then((response) => response.json())
      .then((data) => setDataPenyimpanan(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Container>
      <h2 className="my-3">Data Penyimpanan</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th rowSpan={2}>Tanggal</th>
            <th rowSpan={2}>Lokasi</th>
            <th rowSpan={2}>PKM</th>
            <th colSpan={6} className="text-center">Kernel</th>
            <th rowSpan={2}>Kategori</th>
            <th rowSpan={2}>Penyimpanan</th>
            <th colSpan={6} className="text-center">Jumlah</th>
          </tr>
          <tr>
            <th>Stok</th>
            <th>ALB</th>
            <th>Kadar Air</th>
            <th>Kadar Kotoran</th>
            <th>DO</th>
            <th>HI</th>
            <th>Stok</th>
            <th>ALB</th>
            <th>Kadar Air</th>
            <th>Kadar Kotoran</th>
            <th>DO</th>
            <th>HI</th>
          </tr>
        </thead>
        <tbody>
          {dataPenyimpanan.map((item, index) => (
            <>
              {/* Baris utama untuk PKM dan Kernel */}
              <tr key={`main-${index}`}>
                <td rowSpan={Object.keys(item.kategori).reduce((acc, key) => acc + item.kategori[key].penyimpanan.length + 1, 1)}>
                  {new Date(item.tanggal).toLocaleDateString()}
                </td>
                <td rowSpan={Object.keys(item.kategori).reduce((acc, key) => acc + item.kategori[key].penyimpanan.length + 1, 1)}>
                  {item.lokasi}
                </td>
                <td rowSpan={Object.keys(item.kategori).reduce((acc, key) => acc + item.kategori[key].penyimpanan.length + 1, 1)}>
                  DO: {item.pkm.nilai_do}, HI: {item.pkm.nilai_hi}
                </td>
                <td rowSpan={Object.keys(item.kategori).reduce((acc, key) => acc + item.kategori[key].penyimpanan.length + 1, 1)}>
                  {item.kernel.stok}
                </td>
                <td>{item.kernel.alb}</td>
                <td>{item.kernel.kadar_air}</td>
                <td>{item.kernel.kadar_kotoran}</td>
                <td>{item.kernel.do}</td>
                <td>{item.kernel.hi}</td>
              </tr>

              {/* Loop kategori dan penyimpanan */}
              {Object.values(item.kategori).map((kat, katIndex) => (
                <>
                  {/* Baris kategori */}
                  <tr key={`kat-${index}-${katIndex}`} className="table-primary">
                    <td rowSpan={kat.penyimpanan.length + 1}>
                      <strong>{kat.nama}</strong>
                    </td>
                  </tr>

                  {/* Loop setiap penyimpanan dalam kategori */}
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
                  <tr key={`jumlah-${index}-${katIndex}`} className="table-secondary">
                    <td><strong>Total {kat.nama}</strong></td>
                    <td><strong>{kat.jumlah.stok}</strong></td>
                    <td><strong>{kat.jumlah.alb}</strong></td>
                    <td><strong>{kat.jumlah.kadar_air}</strong></td>
                    <td><strong>{kat.jumlah.kadar_kotoran}</strong></td>
                    <td><strong>{kat.jumlah.do}</strong></td>
                    <td><strong>{kat.jumlah.hi}</strong></td>
                  </tr>
                </>
              ))}
            </>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CatatanPersediaan;
