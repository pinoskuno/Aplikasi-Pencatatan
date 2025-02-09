import { useState } from "react";

const AddPersediaan = () => {
  const [formData, setFormData] = useState({
    tanggal: "",
    lokasi: "Bekri",
    pkm: "",
    kernel: { stok: "", alb: "", kadar_air: "", kadar_kotoran: "" },
    kategori: [],
  });

  const lokasiOptions = ["Bekri", "Betung", "Talang sawit", "Sungai Lengi"];
  const kategoriOptions = ["CPO", "PKO"];
  const jenisTankOptions = [
    "Storage Tank I", "Storage Tank II", "Storage Tank III", "Storage Tank IV", "Storage Tank V",
    "Storage Tank VI", "Storage Tank VII", "Storage Tank VIII", "Storage Tank IX", "Storage Tank X",
    "Tanki I", "Tanki II", "Tanki III", "Tanki IV", "Tanki V", "Tanki VI", "Tanki VII", "Tanki VIII", "Tanki IX", "Tanki X",
    "Gudang Repa", "Gudang Pabrik"
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

  const addKategori = () => {
    setFormData({
      ...formData,
      kategori: [...formData.kategori, {
        nama: "CPO",
        penyimpanan: [],
        jumlah: { stok: "", alb: "", kadar_air: "", kadar_kotoran: "" }
      }],
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
    const response = await fetch("http://localhost:5000/penyimpanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="container mt-4">
      <h2>Input Data Penyimpanan</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tanggal</label>
          <input type="date" name="tanggal" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Lokasi</label>
          <select name="lokasi" className="form-control" onChange={handleChange}>
            {lokasiOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={addKategori}>Tambah Kategori</button>
        {formData.kategori.map((kat, katIndex) => (
          <div key={katIndex} className="mt-3 border p-3">
            <h5>Kategori</h5>
            <select className="form-control" onChange={(e) => handleKategoriChange(katIndex, e)}>
              {kategoriOptions.map((katOpt) => (
                <option key={katOpt} value={katOpt}>{katOpt}</option>
              ))}
            </select>
            <h6>Jumlah</h6>
            {Object.keys(kat.jumlah).map((key) => (
              <input key={key} type="number" name={key} placeholder={key} className="form-control mt-2" onChange={(e) => handleJumlahChange(katIndex, e)} />
            ))}
            <button type="button" className="btn btn-secondary mt-2" onClick={() => addPenyimpanan(katIndex)}>Tambah Penyimpanan</button>
            {kat.penyimpanan.map((p, pIndex) => (
              <div key={pIndex} className="mt-2 border p-2">
                <select name="jenis_tank" className="form-control" onChange={(e) => handlePenyimpananChange(katIndex, pIndex, e)}>
                  {jenisTankOptions.map((tank) => (
                    <option key={tank} value={tank}>{tank}</option>
                  ))}
                </select>
                {Object.keys(p).filter(key => key !== "jenis_tank").map((key) => (
                  <input key={key} type="number" name={key} placeholder={key} className="form-control mt-2" onChange={(e) => handlePenyimpananChange(katIndex, pIndex, e)} />
                ))}
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="btn btn-success mt-3">Submit</button>
      </form>
    </div>
  );
};

export default AddPersediaan;
