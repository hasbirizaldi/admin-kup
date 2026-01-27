import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";
import { formatTanggal, getEmbedUrl } from "../../lib/helper";

const API = "http://localhost:8000/api/vidios";

const Vidio = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

 const [title, setTitle] = useState("");
 const [category, setCategory] = useState("");
 const [link, setLink] = useState("");
 const [thumbnail, setThumbnail] = useState(null);
 const [featured, setFeatured] = useState(false);


  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async (pageNumber = 1, keyword = search) => {
    try {
        setLoading(true);

        const res = await axios.get(
        `${API}?page=${pageNumber}&search=${keyword}`,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );

        const pagination = res.data.data;

        setData((prev) =>
            pageNumber === 1
                ? pagination.data
                : [...prev, ...pagination.data]
            );


        setPage(pagination.current_page);
        setHasMore(pagination.current_page < pagination.last_page);
    } catch {
        alertError("Gagal mengambil data");
    } finally {
        setLoading(false);
    }
    };



  const openCreateModal = () => {
    setIsEdit(false);
    setEditId(null);
    setTitle("");
    setCategory("");
    setLink("");
    setThumbnail(null);
    setFeatured(false);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    setEditId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setLink(item.link);
    setFeatured(item.featured == 1);
    setThumbnail(null); // optional ganti
    setShowModal(true);
    };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !link) {
        return alertError("Judul, kategori, dan link wajib diisi");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("link", link);
    formData.append("featured", featured ? 1 : 0);

    // ✅ thumbnail OPSIONAL
    if (thumbnail) {
        formData.append("thumbnail", thumbnail);
    }

    try {
        if (isEdit) {
        await axios.post(`${API}/${editId}?_method=PUT`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alertSuccess("Berhasil diupdate");
        } else {
        await axios.post(API, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alertSuccess("Berhasil disimpan");
        }

        setShowModal(false);
        fetchData(1);
    } catch (err) {
        alertError(err.response?.data?.message || "Validasi gagal");
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

  useEffect(() => {
    fetchData(1, search);
    }, [search]);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold"> Vidio Youtube </h2>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              + Tambah Vidio
            </button>
          </div>
           <div className="mb-4">
                <input
                    type="text"
                    placeholder="Cari video..."
                    value={search}
                    onChange={(e) => {
                    setSearch(e.target.value);
                    fetchData(1, e.target.value);
                    }}
                    className="border px-3 py-2 rounded w-full md:w-1/3"
                />
            </div>

          {loading && page === 1 ? (
            <p>Loading...</p>
          ) : (
            <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.map((item) => (
                <div key={item.id} className="relative shadow rounded">
                  {item.featured == 1 && (
                    <span className="absolute top-2 left-2 bg-yellow-400 px-2 text-xs rounded text-white">
                      Featured
                    </span>
                  )}
                     <div>
                        <iframe
                            src={getEmbedUrl(item.link)}
                            title={item.title}
                            className="w-full aspect-video rounded-t"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            />


                        <div className="p-2">
                        <h3 className="font-semibold text-sm line-clamp-2">
                            {item.title}
                        </h3>
                        <span className="text-xs text-slate-500"> {item.category.charAt(0).toUpperCase() + item.category.slice(1)} |</span>
                         <span className="text-xs text-slate-500"> {formatTanggal(item.created_at)}</span>
                        </div>
                    </div>


                  <div className="p-2 flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-green-500 text-white text-sm px-3 py-1 rounded flex gap-1 cursor-pointer"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white text-sm px-3 py-1 rounded flex gap-1 cursor-pointer"
                    >
                      <AiFillDelete /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </>
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
       <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded w-full max-w-md"
        >
            <h3 className="font-semibold mb-3">
            {isEdit ? "Edit" : "Tambah"} Vidio Youtube
            </h3>

            {/* Judul */}
            <input
            className="border w-full mb-2 px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul Video"
            required
            />

            {/* Kategori */}
            <select
            className="border w-full mb-2 px-3 py-2 rounded bg-white cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            >
            <option value="">-- Pilih Kategori --</option>
            <option value="promosi">Promosi</option>
            <option value="kesehatan">Kesehatan</option>
            <option value="islami">Islami</option>
            <option value="simrs">SIMRS</option>
            </select>

            {/* Link */}
            <input
            className="border w-full mb-2 px-3 py-2 rounded"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link YouTube"
            required
            />

            {/* Featured */}
            <label className="flex gap-2 mb-2 items-center cursor-pointer">
            <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
            </label>

            {/* Thumbnail */}
            <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="border w-full mb-3 py-2 px-3 rounded cursor-pointer"
            />

            {/* Action */}
            <div className="flex justify-end gap-2">
            <button
                type="button"
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded cursor-pointer"
            >
                Batal
            </button>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
                Simpan
            </button>
            </div>
        </form>
        </div>

      )}
    </div>
  );
};

export default Vidio;
