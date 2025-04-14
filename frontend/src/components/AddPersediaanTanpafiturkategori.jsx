import { useState } from "react";
import { createPenyimpanan } from "../api/api"; // Impor fungsi API
import Swal from "sweetalert2"; // Impor SweetAlert2

const AddPersediaanCluster = () => {
  const [formData, setFormData] = useState({
    tanggal: "",
    lokasi: "Bekri", // Default lokasi
    pkm: { nilai_pkm: "", nilai_do: "", nilai_hi: "" },
    kernel: { stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
    kategori: [],
  });


  // Definisi cluster berdasarkan lokasi
  const clusters = {
    "Bekri": [
      {
        nama: "CPO",
        penyimpanan: [
          { jenis_tank: "Storage Tank VI", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank VII", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank VIII", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank IX", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        ],
      },
      {
        nama: "PKO",
        penyimpanan: [
          { jenis_tank: "Tangki I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Tangki III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Tangki IV", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Tangki V", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Tangki IX", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        ],
      },
    ],
    "Betung": [
      {
        nama: "CPO",
        penyimpanan: [
          { jenis_tank: "Storage Tank I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        ],
      },
      {
        nama: "PKO",
        penyimpanan: [
          { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank IV", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank V", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        ],
      },
    ],
    "Talang Sawit": [
      {
        nama: "CPO",
        penyimpanan: [
          { jenis_tank: "Storage Tank I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        ],
      },
    ],
    "Sungai Lengi": [
      {
        nama: "CPO",
        penyimpanan: [
          { jenis_tank: "Storage Tank I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        ],
      },
      {
        nama: "Kernel Lengi",
        penyimpanan: [
          { jenis_tank: "Gudang Repa", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Gudang Pabrik", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        ],
      },
    ],
    "IPMG Boom Baru": [
      {
        nama: "CPO",
        penyimpanan: [
          { jenis_tank: "Storage Tank I", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank II", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank III", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
          { jenis_tank: "Storage Tank IV", stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        ],
      },
      
    ],
  };

  const lokasiOptions = Object.keys(clusters);
  const lokasiDenganPKM = ["Bekri", "Betung"]; // Lokasi yang memiliki PKM
  const lokasiDenganKernel = ["Bekri", "Betung", "Talang Sawit"];


// Inisialisasi kategori berdasarkan lokasi default "Bekri"
  useState(() => {
    setFormData((prev) => ({
      ...prev,
      kategori: clusters["Bekri"].map((kat) => ({
        nama_kategori: kat.nama, // Ubah "nama" menjadi "nama_kategori" agar sesuai backend
        penyimpanan: kat.penyimpanan.map((peny) => ({ ...peny })),
      })),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lokasi") {
      const newFormData = {
        ...formData,
        lokasi: value,
        kategori: clusters[value].map((kat) => ({
          nama_kategori: kat.nama, // Ubah "nama" menjadi "nama_kategori"
          penyimpanan: kat.penyimpanan.map((peny) => ({ ...peny })),
        })),
      };
      if (!lokasiDenganPKM.includes(value)) {
        newFormData.pkm = { nilai_pkm: "", nilai_do: "", nilai_hi: "" };
      }
      if (!lokasiDenganKernel.includes(value)) {
        newFormData.kernel = { stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" };
      }
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePKMChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      pkm: { ...formData.pkm, [name]: value },
    });
  };

  const handleKernelChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      kernel: { ...formData.kernel, [name]: value },
    });
  };

  const handlePenyimpananChange = (kategoriIndex, penyimpananIndex, e) => {
    const { name, value } = e.target;
    let kategori = [...formData.kategori];
    kategori[kategoriIndex].penyimpanan[penyimpananIndex][name] = value;
    setFormData({ ...formData, kategori });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Data yang dikirim:", JSON.stringify(formData, null, 2)); // Debugging

      // Transformasi data untuk sesuai dengan backend
      const transformedData = {
        ...formData,
        pkm: {
          nilai_pkm: formData.pkm.nilai_pkm === "" ? "" : Number(formData.pkm.nilai_pkm) || 0,
          nilai_do: formData.pkm.nilai_do === "" ? "" : Number(formData.pkm.nilai_do) || 0,
          nilai_hi: formData.pkm.nilai_hi === "" ? "" : Number(formData.pkm.nilai_hi) || 0,
        },
        kernel: {
          stok: formData.kernel.stok === "" ? "" : Number(formData.kernel.stok) || 0,
          alb: formData.kernel.alb === "" ? "" : Number(formData.kernel.alb) || 0,
          kadar_air: formData.kernel.kadar_air === "" ? "" : Number(formData.kernel.kadar_air) || 0,
          kadar_kotoran: formData.kernel.kadar_kotoran === "" ? "" : Number(formData.kernel.kadar_kotoran) || 0,
          do: formData.kernel.do === "" ? "" : Number(formData.kernel.do) || 0,
          hi: formData.kernel.hi === "" ? "" : Number(formData.kernel.hi) || 0,
        },
        kategori: formData.kategori.map((kat) => ({
          nama_kategori: kat.nama_kategori,
          penyimpanan: kat.penyimpanan.map((peny) => ({
            jenis_tank: peny.jenis_tank,
            stok: peny.stok === "" ? "" : Number(peny.stok) || 0,
            alb: peny.alb === "" ? "" : Number(peny.alb) || 0,
            kadar_air: peny.kadar_air === "" ? "" : Number(peny.kadar_air) || 0,
            kadar_kotoran: peny.kadar_kotoran === "" ? "" : Number(peny.kadar_kotoran) || 0,
            do: peny.do === "" ? "" : Number(peny.do) || 0,
            hi: peny.hi === "" ? "" : Number(peny.hi) || 0,
          })),
        })),
      };

      const response = await createPenyimpanan(transformedData);
      console.log("Response dari backend:", response); // Debugging

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diunggah!",
        timer: 1500,
        showConfirmButton: false,
      });

      // Reset form setelah sukses
      setFormData({
        tanggal: "",
        lokasi: "Bekri",
        pkm: { nilai_pkm: "", nilai_do: "", nilai_hi: "" },
        kernel: { stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
        kategori: clusters["Bekri"].map((kat) => ({
          nama_kategori: kat.nama,
          penyimpanan: kat.penyimpanan.map((peny) => ({ ...peny })),
        })),
      });
    } catch (error) {
      console.error("Error submitting penyimpanan:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan data: " + error.message,
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bolder center">
        <span className="text-gradient d-inline">INPUT PERSEDIAAN PRODUKSI SELURUH PKS</span>
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-md-6">
            <label className="form-label">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              className="form-control bg-light"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Lokasi</label>
            <select
              name="lokasi"
              className="form-control bg-light"
              value={formData.lokasi}
              onChange={handleChange}
            >
              {lokasiOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

{/* Form PKM - Hanya tampil untuk Bekri, Betung, Talang Sawit */}
{lokasiDenganPKM.includes(formData.lokasi) && (
          <>
            <div className="mb-3">
              <label className="form-label">PKM Stok</label>
              <input
                type="number"
                name="nilai_pkm"
                className="form-control bg-light"
                value={formData.pkm.nilai_pkm}
                onChange={handlePKMChange}
                
              />
            </div>
            <div className="form-row">
              <div className="col-md-6">
                <label className="form-label">PKM DO Hi</label>
                <input
                  type="number"
                  name="nilai_do"
                  step="0.01"
                  className="form-control bg-light"
                  value={formData.pkm.nilai_do}
                  onChange={handlePKMChange}
                  
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">PKM Sd Hi</label>
                <input
                  type="number"
                  name="nilai_hi"
                  step="0.01"
                  className="form-control bg-light"
                  value={formData.pkm.nilai_hi}
                  onChange={handlePKMChange}
                  
                />
              </div>
            </div>
          </>
        )}
{/* Form Kernel - Hanya tampil untuk Bekri, Betung, Talang Sawit */}
{lokasiDenganKernel.includes(formData.lokasi) && (
          <>
            <div className="form-row">
              <div className="col-md-6">
                <label className="form-label">Kernel Stok</label>
                <input
                  type="number"
                  name="stok"
                  className="form-control bg-light"
                  value={formData.kernel.stok}
                  onChange={handleKernelChange}
                  
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Kernel ALB</label>
                <input
                  type="number"
                  name="alb"
                  step="0.01"
                  className="form-control bg-light"
                  value={formData.kernel.alb}
                  onChange={handleKernelChange}
                  
                />
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-6">
                <label className="form-label">Kernel Kadar Air</label>
                <input
                  type="number"
                  name="kadar_air"
                  step="0.01"
                  className="form-control bg-light"
                  value={formData.kernel.kadar_air}
                  onChange={handleKernelChange}
                  
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Kernel Kadar Kotoran</label>
                <input
                  type="number"
                  name="kadar_kotoran"
                  step="0.01"
                  className="form-control bg-light"
                  value={formData.kernel.kadar_kotoran}
                  onChange={handleKernelChange}
                  
                />
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-6">
                <label className="form-label">Kernel DO Hi</label>
                <input
                  type="number"
                  name="do"
                  step="0.01"
                  className="form-control bg-light"
                  value={formData.kernel.do}
                  onChange={handleKernelChange}
                  
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Kernel Sd Hi</label>
                <input
                  type="number"
                  name="hi"
                  step="0.01"
                  className="form-control bg-light"
                  value={formData.kernel.hi}
                  onChange={handleKernelChange}
                  
                />
              </div>
            </div>
          </>
        )}

        {/* Kategori dan Penyimpanan sesuai Cluster */}
        {formData.kategori.map((kat, katIndex) => (
          <div key={katIndex} className="mt-3 border p-3">
            <h5>Kategori: {kat.nama_kategori}</h5>
            {kat.penyimpanan.map((p, pIndex) => (
              <div key={pIndex} className="mt-2 border p-2">
                <label className="form-label">Tank: {p.jenis_tank}</label>
                {Object.keys(p)
                  .filter((key) => key !== "jenis_tank")
                  .map((key) => (
                    <input
                      key={key}
                      type="number"
                      name={key}
                      placeholder={key}
                      className="form-control mt-2"
                      value={p[key]}
                      onChange={(e) => handlePenyimpananChange(katIndex, pIndex, e)}
                      
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}

        <div className="d-grid gap-2 mt-2 mb-5">
          <button type="submit" className="btn btn-success mt-3">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPersediaanCluster;