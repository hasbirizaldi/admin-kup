import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import axios from "axios";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";

const API_URL = "https://brewokode.site/api/jadwal-polikliniks";

const JadwalPoliklinik = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    tanggal: "",

    anwar: "",
    khayati: "",
    haryono: "",

    ricky: "",
    adi: "",

    saria: "",
    jalul: "",

    inet: "",

    levi: "",
    alam: "",

    windy: "",
    yayan: "",

    vida: "",
    iwan: "",

    khalifa: "",
    tri: "",

    sarijan: "",

    inkoni: "",

    aziz: "",

    andreas: "",

    satya: "",

    andy: "",

    fisio: "",

    wicara: "",

    vaksinasi: "",

    desi: "",
    gizi: "",

    d1: "",
    d2: "",
    d3: "",
    d4: "",
    d5: "",

    status: 1,
  });

  const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

const openCreate = () => {
  setIsEdit(false);
  setSelected(null);
  setForm({
    tanggal: "",

    anwar: "",
    khayati: "",
    haryono: "",

    ricky: "",
    adi: "",

    saria: "",
    jalul: "",

    inet: "",

    levi: "",
    alam: "",

    windy: "",
    yayan: "",

    vida: "",
    iwan: "",

    khalifa: "",
    tri: "",

    sarijan: "",

    inkoni: "",

    aziz: "",

    andreas: "",

    satya: "",

    andy: "",

    fisio: "",

    wicara: "",

    vaksinasi: "",

    desi: "",
    gizi: "",

    d1: "",
    d2: "",
    d3: "",
    d4: "",
    d5: "",

    status: 1,
  });
  setShowModal(true);
};

const openEdit = (item) => {
  setIsEdit(true);
  setSelected(item);

  setForm({
    ...item,
    tanggal: item.tanggal.substring(0, 10), // STRING ONLY
  });

  setShowModal(true);
};

const isToday = (tanggal) => {
  if (!tanggal) return false;

  const today = new Date();
  const tgl = new Date(tanggal);

  return (
    today.getFullYear() === tgl.getFullYear() &&
    today.getMonth() === tgl.getMonth() &&
    today.getDate() === tgl.getDate()
  );
};

const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  const [y, m, d] = tanggal.split("-");
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    if (isEdit) {
      await axios.put(`${API_URL}/${selected.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(API_URL, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    alertSuccess("Jadwal berhasil disimpan")
    setShowModal(false);
    fetchData();
  } catch (err) {
    console.error(err);
    alertError("Gagal menyimpan data");
  }
};

 const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const LEFT_FIELDS = [
    { name: "anwar", label: "dr. Anwar" },
    { name: "khayati", label: "dr. Khayati" },
    { name: "haryono", label: "dr. Haryono" },
    { name: "ricky", label: "dr. Ricky" },
    { name: "adi", label: "dr. Adi" },
    { name: "saria", label: "dr. Saria" },
    { name: "jalul", label: "dr. Jalul" },
    { name: "inet", label: "dr. Inet" },
    { name: "levi", label: "dr. Levi" },
    { name: "alam", label: "dr. Alam" },
    { name: "windy", label: "dr. Windy" },
    { name: "yayan", label: "dr. Yayan" },
    { name: "vida", label: "dr. Vida" },
    { name: "iwan", label: "dr. Iwan" },
  ];

  const RIGHT_FIELDS = [
    { name: "khalifa", label: "dr. Khalifa" },
    { name: "tri", label: "dr. Tri" },
    { name: "sarijan", label: "dr. Sarijan" },
    { name: "inkoni", label: "dr. Inkoni" },
    { name: "aziz", label: "dr. Aziz" },
    { name: "andreas", label: "dr. Andreas" },
    { name: "satya", label: "dr. Satya" },
    { name: "andi", label: "dr. Andi" },
    { name: "fisio", label: "Fisioterapi" },
    { name: "wicara", label: "Terapi Wicara & Okupasi" },
    { name: "vaksinasi", label: "Klink Vaksinasi Internasional" },
    { name: "desi", label: "dr. Desi" },
    { name: "gizi", label: "Klinik Gizi" },
  ];


  useEffect(() => {
    fetchData();
  }, []);
  
  const handleDelete = async (id) => {
    const result = await alertConfirm("Akan menghapus jadwal ini?");
    if (!result) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      alertSuccess("Jadwal berhasil dihapus")
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Jadwal Poliklinik</h2>
          <button
            onClick={openCreate}
            className="mb-4 px-4 py-2 bg-blue-700 cursor-pointer hover:bg-blue-800 text-white rounded"
          >
            + Tambah Jadwal
          </button>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-200">
                <tr>
                  <th className="p-3 text-left w210">#</th>
                  <th className="p-3 text-left">Tanggal</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="22" className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="22" className="p-4 text-center">
                      Data kosong!
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-t ${
                        isToday(item.tanggal)
                          ? "bg-green-200 hover:bg-green-200"
                          : "hover:bg-slate-50"
                      }`}
                    >

                      <td className="p-2">{index + 1}</td>

                    <td
                      className={`p-2 text-left font-semibold `}
                    >
                      <div className="flex items-center gap-2">
                        <span>{formatTanggal(item.tanggal)}</span>
                      </div>

                    </td>

                      <td className="p-2 flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="px-2 py-1 cursor-pointer text-xs bg-green-700 hover:bg-green-800 text-white rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-1 cursor-pointer text-xs bg-red-500 hover:bg-red-600 text-white rounded"
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
        <div className="bg-white w-[95%] max-w-5xl p-6 rounded-lg overflow-y-auto max-h-[90vh]">
          <h3 className="text-lg font-bold mb-4">
            {isEdit ? "Edit Jadwal Poliklinik" : "Tambah Jadwal Poliklinik"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* TANGGAL */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal || ""}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full cursor-pointer"
              />
            </div>

            {/* GRID 2 KOLOM */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* KIRI */}
            <div className="space-y-3">
              {LEFT_FIELDS.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
              ))}
            </div>

            {/* KANAN */}
            <div className="space-y-3">
              {RIGHT_FIELDS.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
              ))}
            </div>
          </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-2 pt-4">
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

export default JadwalPoliklinik;


