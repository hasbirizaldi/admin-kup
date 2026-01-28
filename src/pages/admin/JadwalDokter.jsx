import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import {  alertError, alertSuccess } from "../../lib/alert";

const API_JADWAL = "https://brewokode.site/api/jadwal-dokters";
const API_DOKTER = "https://brewokode.site/api/get-all-dokter";
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Accept: "application/json",
  },
});


const JadwalDokter = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [jadwals, setJadwals] = useState([]);
  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [filterNama, setFilterNama] = useState("");
  const [filterHari, setFilterHari] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [form, setForm] = useState({
      id: null,
      dokter_id: "",
      hari: "",
      jam: "",
      status: true,
    });

    useEffect(() => {
    fetchJadwal();
    fetchDokter();
  }, []);

  useEffect(() => {
    fetchJadwal(1);
  }, [filterNama, filterHari]);


  const fetchJadwal = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(API_JADWAL, {
        ...authHeader(),
        params: {
          nama: filterNama,
          hari: filterHari,
          page: page,
        },
      });

      setJadwals(res.data.data);      // 🔴 penting
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.log(err.response);
      alertError("Gagal mengambil data jadwal");
    } finally {
      setLoading(false);
    }
  };



  const fetchDokter = async () => {
    const res = await axios.get(API_DOKTER, authHeader());
    setDokters(res.data);
  };

  const openCreate = () => {
    setIsEdit(false);
    setForm({
      id: null,
      dokter_id: "",
      hari: "",
      jam: "",
      status: true,
    });
    setShowModal(true);
  };

  const openEdit = (jadwal) => {
    setIsEdit(true);
    setForm({
      id: jadwal.id,
      dokter_id: jadwal.dokter_id,
      hari: jadwal.hari,
      jam: jadwal.jam ?? "",
      status: jadwal.status,
    });
    setShowModal(true);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isEdit) {
      await axios.put(
        `${API_JADWAL}/${form.id}`,
        form,
        authHeader()
      );
      alertSuccess("Jadwal berhasil diupdate");
    } else {
      await axios.post(
        API_JADWAL,
        form,
        authHeader()
      );
      alertSuccess("Jadwal berhasil ditambahkan");
    }

    setShowModal(false);
    fetchJadwal();
  } catch (err) {
    console.log(err.response);
    alertError("Gagal menyimpan jadwal");
  }
};

const handleDelete = async (id) => {
  const ok = window.confirm("Hapus jadwal ini?");
  if (!ok) return;

  try {
    await axios.delete(
      `${API_JADWAL}/${id}`,
      authHeader()
    );
    alertSuccess("Jadwal berhasil dihapus");
    fetchJadwal();
  } catch (err) {
    console.log(err.response);
    alertError("Gagal menghapus jadwal");
  }
};

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4">Jadwal Dokter</h2>
            <button
              onClick={openCreate}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              + Tambah Jadwal
            </button>

          </div>
          <div className="mb-4 flex gap-3 items-center">
            {/* Filter Nama */}
            <input
              type="text"
              placeholder="Cari nama dokter..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="border rounded px-3 py-2 w-64"
            />

            {/* Filter Hari */}
            <select
              value={filterHari}
              onChange={(e) => setFilterHari(e.target.value)}
              className="border rounded px-3 py-2 cursor-pointer"
            >
              <option value="">Semua Hari</option>
              {["senin","selasa","rabu","kamis","jumat","sabtu","minggu"].map(h => (
                <option key={h} value={h}>
                  {h.charAt(0).toUpperCase() + h.slice(1)}
                </option>
              ))}
            </select>

            {/* Tombol Search */}
            <button
              onClick={fetchJadwal}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              Search
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setFilterNama("");
                setFilterHari("");
                fetchJadwal();
              }}
              className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
            >
              Reset
            </button>
          </div>


          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-200">
                <tr>
                  <th className="p-3 text-left w-16">No</th>
                  <th className="p-3 text-left">Nama Dokter</th>
                  <th className="p-3 text-left">Hari</th>
                  <th className="p-3 text-left">Jam</th>
                  <th className="p-3 text-left w-32">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {jadwals.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.dokter?.nama}</td>
                   <td className="p-3">
                    {item?.hari?.charAt(0).toUpperCase() + item?.hari?.slice(1)}
                  </td>
                    <td className="p-3">{item?.jam ? item?.jam :(<span className="text-red-600">Tidak Praktik</span>)}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="px-3 py-1 bg-green-700 text-white rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>


            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm">
              Halaman {currentPage} dari {lastPage}
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => fetchJadwal(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>

              <button
                disabled={currentPage === lastPage}
                onClick={() => fetchJadwal(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white w-96 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">
        {isEdit ? "Edit Jadwal Dokter" : "Tambah Jadwal Dokter"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Dokter */}
        <select
          value={form.dokter_id}
          onChange={(e) => setForm({ ...form, dokter_id: e.target.value })}
          className="w-full border rounded p-2 cursor-pointer"
          required
        >
          <option value="">-- Pilih Dokter --</option>
          {dokters.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nama}
            </option>
          ))}
        </select>

        {/* Hari */}
        <select
          value={form.hari}
          onChange={(e) => setForm({ ...form, hari: e.target.value })}
          className="w-full border rounded p-2 cursor-pointer"
          required
        >
          <option value="">-- Pilih Hari --</option>
          {["senin","selasa","rabu","kamis","jumat","sabtu","minggu"].map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        {/* Jam */}
        <input
          type="text"
          placeholder="Jam (contoh: 08.00 - 12.00)"
          value={form.jam}
          onChange={(e) => setForm({ ...form, jam: e.target.value })}
          className="w-full border rounded p-2"
        />

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
};

export default JadwalDokter;
