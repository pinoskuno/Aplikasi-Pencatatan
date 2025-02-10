import { useState } from "react";

const AddPersediaan = () => {
  const [formData, setFormData] = useState({
    tanggal: "",
    lokasi: "Bekri",
    pkm: { nilai_pkm: "", nilai_do: "", nilai_hi: "" },
    kernel: { stok: "", alb: "", kadar_air: "", kadar_kotoran: "",do: "", hi: "" },
    kategori: [],
  });
  const [notification, setNotification] = useState(null);

  const lokasiOptions = ["Bekri", "Betung", "Talang sawit", "Sungai Lengi"];
  const kategoriOptions = ["CPO", "PKO"];
  const jenisTankOptions = [
    "Storage Tank I",
    "Storage Tank II",
    "Storage Tank III",
    "Storage Tank IV",
    "Storage Tank V",
    "Storage Tank VI",
    "Storage Tank VII",
    "Storage Tank VIII",
    "Storage Tank IX",
    "Storage Tank X",
    "Tanki I",
    "Tanki II",
    "Tanki III",
    "Tanki IV",
    "Tanki V",
    "Tanki VI",
    "Tanki VII",
    "Tanki VIII",
    "Tanki IX",
    "Tanki X",
    "Gudang Repa",
    "Gudang Pabrik",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKernelChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      kernel: { ...formData.kernel, [name]: value },
    });
  };
  const handlePKMChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      pkm: { ...formData.pkm, [name]: value },
    });
  };

  const addKategori = () => {
    setFormData({
      ...formData,
      kategori: [
        ...formData.kategori,
        {
          nama: "CPO",
          penyimpanan: [],
          jumlah: { stok: "", alb: "", kadar_air: "", kadar_kotoran: "",do:"",hi:"" },
        },
      ],
    });
  };

  const handleKategoriChange = (index, e) => {
    const { value } = e.target;
    let kategori = [...formData.kategori];
    kategori[index].nama = value;
    setFormData({ ...formData, kategori });
  };

  const handleJumlahChange = (index, e) => {
    const { name, value } = e.target;
    let kategori = [...formData.kategori];
    kategori[index].jumlah[name] = value;
    setFormData({ ...formData, kategori });
  };

  const addPenyimpanan = (kategoriIndex) => {
    let kategori = [...formData.kategori];
    kategori[kategoriIndex].penyimpanan.push({
      jenis_tank: "Storage Tank I",
      stok: "",
      alb: "",
      kadar_air: "",
      kadar_kotoran: "",
      do:"",
      hi:"",
    });
    setFormData({ ...formData, kategori });
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
      const response = await fetch("http://localhost:5000/penyimpanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setNotification({ type: "success", message: "Data berhasil diunggah!" });
      } else {
        setNotification({ type: "error", message: `Gagal: ${data.message}` });
      }
    } catch (error) {
      setNotification({ type: "error", message: "Terjadi kesalahan!" });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="container mt-4">
      <h2>Input Data Penyimpanan</h2>
      {notification && (
        <div className={`alert alert-${notification.type === "success" ? "success" : "danger"}`}>
          {notification.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tanggal</label>
          <input
            type="date"
            name="tanggal"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Lokasi</label>
          <select
            name="lokasi"
            className="form-control"
            onChange={handleChange}
          >
            {lokasiOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <h5>Kernel</h5>
        <div className="mb-3">
          <label className="form-label">Nilai PKM</label>
          <input
            type="number"
            name="nilai_pkm"
            className="form-control"
            value={formData.pkm.nilai_pkm}
            onChange={handlePKMChange }
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">PKM DO</label>
          <input
            type="number"
            name="nilai_do"
            step="0.01"
            className="form-control"
            value={formData.pkm.nilai_do}
            onChange={handlePKMChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">PKM HI</label>
          <input
            type="number"
            name="nilai_hi"
            step="0.01"
            className="form-control"
            value={formData.pkm.nilai_hi}
            onChange={handlePKMChange}
            required
          />
        </div>


        <h5>Kernel</h5>
        <div className="mb-3">
          <label className="form-label">Stok</label>
          <input
            type="number"
            name="stok"
            className="form-control"
            value={formData.kernel.stok}
            onChange={handleKernelChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ALB</label>
          <input
            type="number"
            name="alb"
            step="0.01"
            className="form-control"
            value={formData.kernel.alb}
            onChange={handleKernelChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Kadar Air</label>
          <input
            type="number"
            name="kadar_air"
            step="0.01"
            className="form-control"
            value={formData.kernel.kadar_air}
            onChange={handleKernelChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Kadar Kotoran</label>
          <input
            type="number"
            name="kadar_kotoran"
            step="0.01"
            className="form-control"
            value={formData.kernel.kadar_kotoran}
            onChange={handleKernelChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Kernel DO</label>
          <input
            type="number"
            name="do"
            step="0.01"
            className="form-control"
            value={formData.kernel.do}
            onChange={handleKernelChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Kernel HI</label>
          <input
            type="number"
            name="hi"
            step="0.01"
            className="form-control"
            value={formData.kernel.hi}
            onChange={handleKernelChange}
            required
          />
        </div>


        <button type="button" className="btn btn-primary" onClick={addKategori}>
          Tambah Kategori
        </button>
        {formData.kategori.map((kat, katIndex) => (
          <div key={katIndex} className="mt-3 border p-3">
            <h5>Kategori</h5>
            <select
              className="form-control"
              onChange={(e) => handleKategoriChange(katIndex, e)}
            >
              {kategoriOptions.map((katOpt) => (
                <option key={katOpt} value={katOpt}>
                  {katOpt}
                </option>
              ))}
            </select>
            <h6>Jumlah</h6>
            {Object.keys(kat.jumlah).map((key) => (
              <input
                key={key}
                type="number"
                name={key}
                placeholder={key}
                className="form-control mt-2"
                onChange={(e) => handleJumlahChange(katIndex, e)}
              />
            ))}
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={() => addPenyimpanan(katIndex)}
            >
              Tambah Penyimpanan
            </button>
            {kat.penyimpanan.map((p, pIndex) => (
              <div key={pIndex} className="mt-2 border p-2">
                <select
                  name="jenis_tank"
                  className="form-control"
                  onChange={(e) => handlePenyimpananChange(katIndex, pIndex, e)}
                >
                  {jenisTankOptions.map((tank) => (
                    <option key={tank} value={tank}>
                      {tank}
                    </option>
                  ))}
                </select>
                {Object.keys(p)
                  .filter((key) => key !== "jenis_tank")
                  .map((key) => (
                    <input
                      key={key}
                      type="number"
                      name={key}
                      placeholder={key}
                      className="form-control mt-2"
                      onChange={(e) =>
                        handlePenyimpananChange(katIndex, pIndex, e)
                      }
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="btn btn-success mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPersediaan;