// src/api/api.js

// Ambil base URL dari environment variable, fallback ke localhost jika tidak ada
const BASE_URL = "http://localhost:5000";

// Fungsi utilitas untuk menangani response dan error
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};



// --- Endpoint untuk Catatan (Kontrak/Pembayaran) ---

// Mengambil semua catatan
export const getCatatan = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/catatan`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching catatan:', error);
    throw error;
  }
};

// Memperbarui catatan berdasarkan ID
export const updateCatatan = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/catatan/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating catatan with id ${id}:`, error);
    throw error;
  }
};

// Menambahkan catatan baru
export const createCatatan = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/catatan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating catatan:', error);
    throw error;
  }
};

// Menghapus catatan berdasarkan ID
export const deleteCatatan = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/catatan/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting catatan with id ${id}:`, error);
    throw error;
  }
};

// --- Endpoint untuk Penyimpanan (Persediaan) ---

// Mengambil semua data penyimpanan
export const getDataPenyimpanan = async () => {
    try {
      const response = await fetch(`${BASE_URL}/data_penyimpanan`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching data penyimpanan:', error);
      throw error;
    }
  };

// src/api/api.js (bagian relevan)

// Memperbarui data penyimpanan berdasarkan tanggal dan lokasi
export const updatePenyimpanan = async (tanggal, lokasi, data) => {
    try {
      const response = await fetch(`${BASE_URL}/penyimpanan/${tanggal}/${lokasi}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating penyimpanan for ${tanggal}/${lokasi}:`, error);
      throw error;
    }
  };
// Menghapus data penyimpanan berdasarkan tanggal dan lokasi
export const deletePenyimpanan = async (tanggal, lokasi) => {
    try {
      const response = await fetch(`${BASE_URL}/penyimpanan/${tanggal}/${lokasi}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting penyimpanan for ${tanggal}/${lokasi}:`, error);
      throw error;
    }
  };

// Menambahkan atau memperbarui data penyimpanan
export const createPenyimpanan = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/penyimpanan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating penyimpanan:', error);
    throw error;
  }
};