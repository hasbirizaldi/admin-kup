import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";

const API = "http://localhost:8000/api/galleries";

const Gallery = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [featured, setFeatured] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}?page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const pagination = res.data.data;

      if (pageNumber === 1) {
        setData(pagination.data);
      } else {
        setData((prev) => [...prev, ...pagination.data]);
      }

      setPage(pagination.current_page);
      setHasMore(pagination.current_page < pagination.last_page);
    } catch {
      alertError("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const openCreateModal = () => {
    setIsEdit(false);
    setEditId(null);
    setTitle("");
    setImage(null);
    setFeatured(false);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    setEditId(item.id);
    setTitle(item.title);
    setFeatured(item.featured == 1);
    setImage(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return alertError("Judul wajib diisi");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("featured", featured ? 1 : 0);
    if (image) formData.append("image", image);

    try {
      if (isEdit) {
        await axios.post(`${API}/${editId}?_method=PUT`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alertSuccess("Berhasil diupdate");
      } else {
        if (!image) return alertError("Gambar wajib diisi");
        await axios.post(API, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alertSuccess("Berhasil disimpan");
      }

      setShowModal(false);
      fetchData(1);
    } catch (err) {
      console.log(err.response?.data);
      alertError(
        err.response?.data?.message ||
        "Validasi gagal"
      );
    }

  };

  const handleDelete = async (id) => {
    const result = await alertConfirm("Akan menghapus user ini?");
    if (!result) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alertSuccess("Berhasil dihapus");
      fetchData(1);
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
            <h2 className="text-xl font-bold"> Gallery </h2>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              + Tambah
            </button>
          </div>

          {loading && page === 1 ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.map((item) => (
                <div key={item.id} className="relative shadow rounded">
                  {item.featured == 1 && (
                    <span className="absolute top-2 left-2 bg-yellow-400 px-2 text-xs rounded text-white">
                      Featured
                    </span>
                  )}

                  <img
                    src={`http://localhost:8000/storage/${item.image}`}
                    className="w-full object-cover rounded-t"
                  />

                  <div className="p-2 flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-green-500 text-white px-3 py-1 rounded flex gap-1 cursor-pointer"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded flex gap-1 cursor-pointer"
                    >
                      <AiFillDelete /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchData(page + 1)}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-2 rounded"
              >
               Muat lainya
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded w-full max-w-md"
          >
            <h3 className="font-semibold mb-3">
              {isEdit ? "Edit" : "Tambah"} Gallery
            </h3>

            <input
              className="border w-full mb-2 px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul"
            />

            <label className="flex gap-2 mb-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Featured
            </label>

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="border w-full mb-3 py-2 px-3 rounded cursor-pointer"
            />

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

export default Gallery;
