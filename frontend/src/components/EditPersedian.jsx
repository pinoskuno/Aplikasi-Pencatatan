import React, { useEffect, useState } from "react";
import { updatePenyimpanan } from "../api/api"; // Impor fungsi API
import Swal from "sweetalert2";

const EditCatatanPersediaan = ({ dataToEdit, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    tanggal: "",
    lokasi: "",
    pkm: { nilai_pkm: "", nilai_do: "", nilai_hi: "" },
    kernel: { stok: "", alb: "", kadar_air: "", kadar_kotoran: "", do: "", hi: "" },
    kategori: [],
  });

  const clusters = {
    Bekri: [
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
    Betung: [
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
  const lokasiDenganPKM = ["Bekri", "Betung"];
  const lokasiDenganKernel = ["Bekri", "Betung", "Talang Sawit"];

  useEffect(() => {
    if (dataToEdit) {
      const kategoriObj = dataToEdit.kategori || {};
      const initialKategori = clusters[dataToEdit.lokasi].map((kat) => {
        const existingKat = kategoriObj[kat.nama] || { penyimpanan: [] };
        return {
          nama_kategori: kat.nama,
          penyimpanan: kat.penyimpanan.map((peny) => {
            const existingPeny = existingKat.penyimpanan.find((p) => p.jenis_tank === peny.jenis_tank) || {};
            return {
              jenis_tank: peny.jenis_tank,
              stok: existingPeny.stok !== undefined ? String(existingPeny.stok) : "",
              alb: existingPeny.alb !== undefined ? String(existingPeny.alb) : "",
              kadar_air: existingPeny.kadar_air !== undefined ? String(existingPeny.kadar_air) : "",
              kadar_kotoran: existingPeny.kadar_kotoran !== undefined ? String(existingPeny.kadar_kotoran) : "",
              do: existingPeny.do !== undefined ? String(existingPeny.do) : "",
              hi: existingPeny.hi !== undefined ? String(existingPeny.hi) : "",
            };
          }),
        };
      });

      setFormData({
        tanggal: dataToEdit.tanggal || "",
        lokasi: dataToEdit.lokasi || "",
        pkm: {
          nilai_pkm: dataToEdit.pkm?.nilai_pkm !== undefined ? String(dataToEdit.pkm.nilai_pkm) : "",
          nilai_do: dataToEdit.pkm?.nilai_do !== undefined ? String(dataToEdit.pkm.nilai_do) : "",
          nilai_hi: dataToEdit.pkm?.nilai_hi !== undefined ? String(dataToEdit.pkm.nilai_hi) : "",
        },
        kernel: {
          stok: dataToEdit.kernel?.stok !== undefined ? String(dataToEdit.kernel.stok) : "",
          alb: dataToEdit.kernel?.alb !== undefined ? String(dataToEdit.kernel.alb) : "",
          kadar_air: dataToEdit.kernel?.kadar_air !== undefined ? String(dataToEdit.kernel.kadar_air) : "",
          kadar_kotoran: dataToEdit.kernel?.kadar_kotoran !== undefined ? String(dataToEdit.kernel.kadar_kotoran) : "",
          do: dataToEdit.kernel?.do !== undefined ? String(dataToEdit.kernel.do) : "",
          hi: dataToEdit.kernel?.hi !== undefined ? String(dataToEdit.kernel.hi) : "",
        },
        kategori: initialKategori,
      });
    }
  }, [dataToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lokasi") {
      const newFormData = {
        ...formData,
        lokasi: value,
        kategori: clusters[value].map((kat) => ({
          nama_kategori: kat.nama,
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
    const kategori = [...formData.kategori];
    kategori[kategoriIndex].penyimpanan[penyimpananIndex][name] = value;
    setFormData({ ...formData, kategori });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Data yang diedit:", JSON.stringify(formData, null, 2)); // Debugging

      // Kirim kategori sebagai array, sesuai harapan backend
      const transformedData = {
        ...formData,
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

      await updatePenyimpanan(formData.tanggal, formData.lokasi, transformedData);
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diperbarui!",
        timer: 1500,
        showConfirmButton: false,
      });
      onUpdate(transformedData); // Update data di parent component
      onClose(); // Tutup modal setelah sukses
    } catch (error) {
      console.error("Error updating data:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui data: " + error.message,
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Catatan Persediaan</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="col-md-6">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    name="tanggal"
                    className="form-control bg-light"
                    value={formData.tanggal}
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

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCatatanPersediaan;