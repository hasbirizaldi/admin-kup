import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";

const API = "https://brewokode.site/api/job-vacancies";

const AdminKarier = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [documents, setDocuments] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(true);


  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(res.data.data);
    } catch {
      alertError("Gagal mengambil data karier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setIsEdit(false);
    setEditId(null);
    setTitle("");
    setDescription("");
    setRequirements("");
    setDocuments("");
    setDeadline("");
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    setEditId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setRequirements(item.requirements.join("\n"));
    setDocuments(item.documents.join("\n"));
    setDeadline(item.deadline);
    setIsActive(item.is_active);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        title,
        description,
        requirements: requirements
            .split("\n")
            .map(r => r.trim())
            .filter(Boolean),

        documents: documents
            .split("\n")
            .map(d => d.trim())
            .filter(Boolean),

        deadline,
        is_active: isActive,
        };


    try {
      if (isEdit) {
        await axios.put(`${API}/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alertSuccess("Karier berhasil diupdate");
      } else {
        await axios.post(API, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alertSuccess("Karier berhasil ditambahkan");
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.log(err.response?.data);
      alertError("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await alertConfirm("Hapus lowongan ini?");
    if (!confirm) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alertSuccess("Berhasil dihapus");
      fetchData();
    } catch {
      alertError("Gagal menghapus");
    }
  };

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Admin Karier</h2>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              + Tambah Lowongan
            </button>
          </div>
            <h5 className="font-semibold">Daftar Lowongan</h5>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Judul</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Deadline</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{index+1}</td>
                    <td className="p-2">{item.title}</td>
                    <td className="p-2 text-center">
                    {item.is_active ? (
                        <span className="text-green-600 font-semibold">Aktif</span>
                    ) : (
                        <span className="text-red-600 font-semibold">Nonaktif</span>
                    )}
                    </td>

                    <td className="p-2 text-center">
                    {new Date(item.deadline).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                    </td>

                    <td className="p-2 flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        <AiFillDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-full max-w-5xl"
          >
            <h3 className="font-bold mb-4">
              {isEdit ? "Edit" : "Tambah"} Lowongan
            </h3>

            <input
              className="border w-full mb-2 p-2"
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="border w-full mb-2 p-2"
              placeholder="Posisi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <textarea
              className="border w-full mb-2 p-2"
              rows="4"
              placeholder="Persyaratan (1 baris = 1 item)"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />

            <textarea
              className="border w-full mb-2 p-2"
              rows="4"
              placeholder="Berkas (1 baris = 1 item)"
              value={documents}
              onChange={(e) => setDocuments(e.target.value)}
            />

            <input
              type="date"
              className="border w-full mb-4 p-2"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <label className="flex items-center gap-2 mb-4">
            <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
            />
            Aktifkan Lowongan
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded cursor-pointer"
              >
                Batal
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminKarier;
