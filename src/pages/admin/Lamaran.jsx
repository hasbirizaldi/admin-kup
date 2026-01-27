import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { AiFillDelete } from "react-icons/ai";
import {  alertConfirm, alertError, alertSuccess,  } from "../../lib/alert";

const API = "http://localhost:8000/api/lamaran-admin";

const Lamaran = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filterPosisi, setFilterPosisi] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          posisi: filterPosisi,
          page: page,
        },
      });

      setData(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotalData(res.data.total);
    } catch {
      alertError("Gagal mengambil data lamaran");
    } finally {
      setLoading(false);
    }
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

    // refresh data
    setData(prev => prev.filter(item => item.id !== id));
    alertSuccess('Data berhasil di hapus')
  } catch (error) {
    console.log(error)
    alertError("Gagal menghapus lamaran");
  }
};

const handleDeleteAll = async () => {
  const result = await alertConfirm(
    "SEMUA DATA LAMARAN akan dihapus!\nTindakan ini tidak bisa dibatalkan."
  );
  if (!result) return;

  try {
    await axios.delete(API, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setData([]);
    alertSuccess("Semua data lamaran berhasil dihapus");
  } catch (error) {
    console.log(error);
    alertError("Gagal menghapus semua data");
  }
};

const handleExportExcel = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8000/api/lamaran-admin/export",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept:"application/json"
        },
        params: {
          posisi: filterPosisi, // 🔥 KUNCI
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data-lamaran.xlsx");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.log(error)
    alertError("Gagal export Excel");
  }
};


useEffect(() => {
  fetchData(1); // reset ke halaman 1
}, [filterPosisi]);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100 ">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Admin Karier</h2>
           <button
              onClick={handleDeleteAll}
              className="bg-red-600 text-white px-4 py-1.5 rounded cursor-pointer hover:bg-red-700 font-semibold"
            >
              Hapus Semua Data
            </button>

          </div>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Cari Posisi..."
              value={filterPosisi}
              onChange={(e) => setFilterPosisi(e.target.value)}
              className="border rounded px-3 py-2 w-64"
            />

            <button
              onClick={() => {
                setFilterPosisi("");
                fetchData();
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Reset
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export Excel
          </button>


          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="min-w-max bg-white rounded shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Foto</th>
                    <th className="p-2 text-left">Berkas</th>
                    <th className="p-2 text-left">Nama</th>
                    <th className="p-2 text-left">Posisi</th>
                    <th className="p-2 text-left">Pendidikan</th>
                    <th className="p-2 text-left">Asal Universitas</th>
                    <th className="p-2 text-left">Jurusan</th>
                    <th className="p-2 text-left">No HP</th>
                    <th className="p-2 text-left">Usia</th>
                    <th className="p-2 text-left">TB</th>
                    <th className="p-2 text-left">BB</th>
                    <th className="p-2 text-left">Alamat</th>
                    <th className="p-2 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                         {item.pas_foto ? (
                            <img
                              src={`http://localhost:8000/storage/${item.pas_foto}`}
                              alt={item.nama_lengkap}
                              className="w-12 h-16 object-cover rounded border mx-auto"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                      </td>
                      <td className="p-2 text-center">
                        {item.berkas_lamaran ? (
                          <button
                            onClick={() => {
                              setSelectedFile(item.berkas_lamaran);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:underline cursor-pointer font-semibold"
                          >
                            Lihat
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="p-2">{item.nama_lengkap}</td>
                      <td className="p-2">{item.job?.description}</td>
                      <td className="p-2">{item.pendidikan}</td>
                      <td className="p-2">{item.asal_universitas}</td>
                      <td className="p-2">{item.jurusan}</td>
                      <td className="p-2">{item.no_hp}</td>
                      <td className="p-2 text-center">
                        {Math.floor(
                          (new Date() - new Date(item.tanggal_lahir)) /
                            (1000 * 60 * 60 * 24 * 365.25)
                        )}
                      </td>
                      <td className="p-2">{item.tinggi_badan}</td>
                      <td className="p-2">{item.berat_badan}</td>
                      <td className="p-2">{item.alamat}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          <AiFillDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}
          {lastPage > 1 && (
            <div className=" flex justify-start">
              <div className="flex items-center gap-2 bg-white p-3 rounded shadow">
                <button
                  disabled={currentPage === 1}
                  onClick={() => fetchData(currentPage - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchData(page)}
                    className={`px-3 py-1 border rounded
                      ${page === currentPage ? "bg-blue-600 text-white" : ""}`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === lastPage}
                  onClick={() => fetchData(currentPage + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 my-3 ">
            Total  <b>{totalData}</b> data lamaran
          </p>




        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg relative">
            
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">Berkas Lamaran</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-4 h-[80vh]">
              <iframe
                src={`http://localhost:8000/storage/${selectedFile}`}
                className="w-full h-full rounded"
                title="Berkas Lamaran"
              />
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t flex justify-end">
              <a
                href={`http://localhost:8000/storage/${selectedFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Lamaran;
