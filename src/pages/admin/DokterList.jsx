import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";

const API = "http://localhost:8000/api/dokters";

const DokterList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [spesialis, setSpesialis] = useState([]);

  const [filterNama, setFilterNama] = useState("");
  const [filterSpesialis, setFilterSpesialis] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    id: null,
    nama: "",
    title: "",
    spesialis_id: "",
    poliklinik: 1,
    status: 1,
    foto: null,
  });

  const fetchDokters = async (filters = {}, page = 1) => {
    setLoading(true);

    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { ...filters, page },  // kirim page + filter
      });

      setDokters(res.data.data);
      setCurrentPage(res.data.current_page);
      setTotalPages(res.data.last_page);
    } catch (error) {
      alertError("Gagal mengambil data dokter");
    }

    setLoading(false);
  };


  const fetchSpesialis = async () => {
    const res = await axios.get("http://localhost:8000/api/spesialis", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setSpesialis(res.data.data);
  };

  const handleSearch = () => {
    const filters = {};
    if (filterNama) filters.nama = filterNama;
    if (filterSpesialis) filters.spesialis = filterSpesialis;

    fetchDokters(filters, 1);
  };

  const handlePageChange = (page) => {
    const filters = {};
    if (filterNama) filters.nama = filterNama;
    if (filterSpesialis) filters.spesialis = filterSpesialis;

    fetchDokters(filters, page);
  };

  const openCreate = () => {
    setForm({
      id: null,
      nama: "",
      title: "",
      spesialis_id: "",
      poliklinik: 1,
      status: 1,
      foto: null,
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const openEdit = (dokter) => {
    setForm({
      id: dokter.id,
      nama: dokter.nama,
      title: dokter.title,
      spesialis_id: dokter.spesialis_id,
      poliklinik: dokter.poliklinik,
      status: dokter.status,
      foto: null,
    });
    setIsEdit(true);
    setShowModal(true);
  };

  useEffect(() => {
    fetchDokters({}, 1);
    fetchSpesialis();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", form.nama);
    formData.append("title", form.title);
    formData.append("spesialis_id", form.spesialis_id);
    formData.append("poliklinik", form.poliklinik);
    formData.append("status", form.status);

    if (form.foto) {
      formData.append("foto", form.foto);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    if (isEdit) {
      await axios.post(
        `${API}/${form.id}?_method=PUT`,
        formData,
        config
      );
      alertSuccess("Data berhasil disimpan")
    } else {
      await axios.post(API, formData, config);
      alertSuccess("Data berhasil diupdate")

    }

    setShowModal(false);
    fetchDokters();
  };

  const handleDelete = async (id) => {
    const result = await alertConfirm("Akan menghapus user ini?");
    if (!result) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alertSuccess("Data berhasil dihapus")
      fetchDokters();
    } catch (error) {
      console.error(error);
      alertError('Wakwaw')
    }
  };

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Dokter List</h2>

          <button
            onClick={openCreate}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            + Tambah Dokter
          </button>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Cari Nama Dokter"
              value={filterNama}
              onChange={e => setFilterNama(e.target.value)}
              className="p-2 border rounded flex-grow bg-white"
            />
            
            <select
              value={filterSpesialis}
              onChange={e => setFilterSpesialis(e.target.value)}
              className="p-2 border rounded cursor-pointer bg-white"
            >
              <option value="">Semua Spesialis</option>
              {spesialis.map(s => (
                <option key={s.id} value={s.nama}>{s.nama}</option>
              ))}
            </select>
            
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              Search
            </button>
          </div>


          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-200">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3 text-left">Foto</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Spesialis</th>
                  <th className="p-3 text-left">Poliklinik</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : dokters.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">
                      Data kosong
                    </td>
                  </tr>
                ) : (
                  dokters.map((dokter, index) => (
                    <tr key={dokter.id} className="border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{dokter?.foto && (
                        <img
                          src={`http://localhost:8000/storage/${dokter.foto}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      </td>
                      <td className="p-3">{dokter.nama}</td>
                      <td className="p-3 font-semibold">
                        {dokter.spesialis?.nama}
                      </td>
                      <td className="p-3">
                        {dokter.poliklinik ? (
                          <span className="text-green-700 font-semibold">Ya</span>
                          ):(
                            <span className="text-red-500 font-semibold">Tidak</span>
                          )}
                      </td>
                      <td className="p-3">
                        {dokter.status ? (
                          <span className="text-green-700 font-semibold">Aktif</span>
                          ):(
                            <span className="text-red-500 font-semibold">Tidak Aktif</span>
                          )}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => openEdit(dokter)}
                          className="px-3 py-1 bg-green-700 text-white rounded cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(dokter.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded cursor-pointer ${
                    currentPage === pageNum ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>


        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 relative">
            
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Dokter" : "Tambah Dokter"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                className="w-full p-2 border rounded"
                placeholder="Nama Dokter"
                value={form.nama}
                onChange={(e) =>
                  setForm({ ...form, nama: e.target.value })
                }
              />

              <select
                className="w-full p-2 border rounded cursor-pointer"
                value={form.spesialis_id}
                onChange={(e) =>
                  setForm({ ...form, spesialis_id: e.target.value })
                }
              >
                <option value="" >Pilih Spesialis</option>
                {spesialis.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <select
                  className="w-full p-2 border rounded cursor-pointer"
                  value={form.poliklinik}
                  onChange={(e) =>
                    setForm({ ...form, poliklinik: Number(e.target.value) })
                  }
                >
                  <option value={1}>Poliklinik</option>
                  <option value={0}>Non Poliklinik</option>
                </select>

                <select
                  className="w-full p-2 border rounded cursor-pointer cursor-pointer"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: Number(e.target.value) })
                  }

                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Nonaktif</option>
                </select>
              </div>

              <input
                type="file"
                onChange={(e) =>
                  setForm({ ...form, foto: e.target.files[0] })
                }
                className="border rounded p-2 cursor-pointer"
              />

              <div className="flex justify-end gap-2">
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

export default DokterList;
