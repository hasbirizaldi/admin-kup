import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { formatTanggal } from "../../lib/helper";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";
import { Link } from "react-router-dom";

const ArtikelList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");



  useEffect(() => {
    fetchArtikels(currentPage);
  }, [currentPage, search]);


  const fetchArtikels = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://brewokode.site/api/artikels`,
        {
          params: {
            page,
            search, // 🔍 kirim search
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setArtikels(res.data.data.data);
      setCurrentPage(res.data.data.current_page);
      setLastPage(res.data.data.last_page);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data artikel");
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (slug) => {
    const result = await alertConfirm("Akan menghapus artikel ini?");
       if (!result) return;

    setDeletingId(slug);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://brewokode.site/api/artikels/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchArtikels(currentPage);
      alertSuccess("Artikel berhasil dihapus");
    } catch (error) {
      console.error(error);
      alertError("Gagal menghapus artikel");
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
            Semua Artikel
            </h2>
            <Link to="/create-artikel" className="px-4 py-2 text-xs bg-blue-700 text-white rounded hover:bg-blue-800 cursor-pointer "> + Buat Artikel</Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto p-4">
            <div className="flex items-center justify-between mb-4 gap-3">
              <input
                type="text"
                placeholder="Cari judul artikel..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // reset halaman
                }}
                className="px-3 py-2 border rounded w-64 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {loading ? (
              <p className="p-4 text-center">Loading...</p>
            ) : error ? (
              <p className="p-4 text-center text-red-500">{error}</p>
            ) : artikels.length === 0 ? (
              <p className="p-4 text-center text-red-500">Tidak ada artikel.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-200">
                  <tr>
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Judul</th>
                    <th className="p-3 text-left">Kategori</th>
                    <th className="p-3 text-left">Penulis</th>
                    <th className="p-3 text-left">Tanggal</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Featured</th>
                    <th className="p-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {artikels.map((artikel, index) => (
                    <tr key={artikel.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 align-top">  {(currentPage - 1) * 5 + index + 1}</td>
                      <td className="p-3 font-medium max-w-[200px] truncate align-top" title={artikel.title}>
                        {artikel.title}
                      </td>
                      <td className="p-3 align-top">{artikel.category}</td>
                      <td className="p-3 align-top">{artikel.user?.name ?? "-"}</td>
                      <td className="p-3 align-top">{formatTanggal(artikel.published_at)}</td>
                      <td className="p-3 align-top">
                        {artikel.status ? (
                          <span className="text-green-600 font-semibold">Published</span>
                        ) : (
                          <span className="text-gray-500 font-semibold">Draft</span>
                        )}
                      </td>
                      <td className="p-3 align-top">
                        {artikel.featured ? (
                          <span className="text-green-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-gray-500 font-semibold">No</span>
                        )}
                      </td>
                      <td className="p-3 align-top space-x-2">
                         <Link
                          to={`/artikel/edit/${artikel.slug}`}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs inline-block">
                          Edit
                        </Link>
                        <Link to={`/artikel/${artikel.slug}`}
                          className="px-3 py-1 bg-yellow-600 text-white cursor-pointer rounded hover:bg-yellow-700 text-xs"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(artikel.slug)}
                          disabled={deletingId === artikel.slug}
                          className={`px-3 py-1 rounded text-xs cursor-pointer ${
                            deletingId === artikel.slug
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {deletingId === artikel.slug ? "Menghapus..." : "Hapus"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}


          </div>
            <div className="flex justify-center gap-4 items-center p-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-sm">
                Halaman {currentPage} dari {lastPage}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, lastPage))}
                disabled={currentPage === lastPage}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikelList;
