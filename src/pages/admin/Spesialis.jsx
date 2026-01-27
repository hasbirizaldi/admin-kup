import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";

const API = "http://localhost:8000/api/spesialis";

const Spesialis = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [spesialis, setSpesialis] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [nama, setNama] = useState("");

  const token = localStorage.getItem("token");

  const fetchSpesialis = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSpesialis(res.data.data);
    } catch (error) {
      console.error("Gagal ambil data spesialis", error);
      alertError("Gagal mengambil data!")
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axios.put(`${API}/${selectedId}`, 
          { nama },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(API,
          { nama },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alertSuccess("Data berhasil disimpan")
      setShowModal(false);
      setNama("");
      setIsEdit(false);
      fetchSpesialis();
    } catch (error) {
      alertError("Terjadi kesalahan!")
      console.error("Gagal simpan spesialis", error);
    }
  };

  const handleEdit = (item) => {
    setSelectedId(item.id);
    setNama(item.nama);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await alertConfirm("Akan menghapus user ini?");
       if (!result) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alertSuccess("Data berhasil dihapus")
      fetchSpesialis();
    } catch (error) {
      alertError("Terjadi kesalahan!")
      console.error("Gagal hapus spesialis", error);
    }
  };



  useEffect(() => {
    fetchSpesialis();
  }, []);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4">Data Spesialis</h2>
            <button
              onClick={() => {
                setShowModal(true);
                setIsEdit(false);
                setNama("");
              }}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              + Tambah Spesialis
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-200">
                <tr>
                  <th className="p-3 text-left w-16">No</th>
                  <th className="p-3 text-left">Nama Spesialis</th>
                  <th className="p-3 text-left w-32">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : spesialis.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center">
                      Data kosong
                    </td>
                  </tr>
                ) : (
                  spesialis.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{item.nama}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-green-700 text-white rounded cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
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
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Spesialis" : "Tambah Spesialis"}
            </h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Spesialis"
                className="w-full border p-2 rounded mb-4"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
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

export default Spesialis;
