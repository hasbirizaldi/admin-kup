 import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { formatTanggal } from "../../lib/helper";
import { FaArrowLeft } from "react-icons/fa";

const ArtikelDetail = () => {
  const { slug } = useParams();
  const { id } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://brewokode.site/api/artikel/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArtikel(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchArtikel();
  }, [id]);
console.log(artikel)
  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  if (!artikel) return <p className="p-4 text-center">Artikel tidak ditemukan</p>;

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6 bg-white m-6 rounded shadow">
          <Link to="/artikel" className="flex flex-row items-center mb-3 gap-2 text-lg bg-gray-700 text-white rounded py-1 w-34 justify-center"><FaArrowLeft/>Kembali</Link>
          <h2 className="text-2xl font-bold mb-4">{artikel.title}</h2>
          <p className="mb-2 text-sm text-gray-600">
            Kategori: {artikel.category} | Penulis: {artikel.user?.name ?? "-"} | Tanggal: {formatTanggal(artikel.published_at)}
          </p>
          {artikel.image && (
            <img
              src={`https://brewokode.site/storage/${artikel.image}`}
              alt={artikel.image_alt || artikel.title}
              className="max-w-[800px] mb-4 rounded"
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: artikel.content }} />
          <div className="flex flex-wrap gap-2 mt-2">
            {artikel.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
              >
                #{tag.name}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtikelDetail;
