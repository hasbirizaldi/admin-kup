import { useEffect, useState } from "react";
import axios from "axios";
import { alertError, alertSuccess } from "../../lib/alert";

const UserModal = ({ show, onClose, onSuccess, editUser = null }) => {
  const isEdit = Boolean(editUser);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    status: 1,
  });

  const [loading, setLoading] = useState(false);
  const roleLogin = localStorage.getItem("role");

  useEffect(() => {
    if (editUser) {
        setForm({
        name: editUser.name,
        email: editUser.email,
        password: "",
        role: editUser.role,
        status: editUser.status,
        });
    } else if (show) {
        setForm({
        name: "",
        email: "",
        password: "",
        role: "admin",
        status: 1,
        });
    }
    }, [editUser, show]);


  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (isEdit) {
      await axios.put(
        `https://brewokode.site/api/users/${editUser.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } else {
      await axios.post("https://brewokode.site/api/users", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    }

    await alertSuccess('Data berhasil disimpan')
    onSuccess();
    onClose();
  } catch (error) {
    console.log(error)
    await alertError('Terjadi kesalahan!')
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit User" : "Tambah User"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {!isEdit && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {roleLogin === "super_admin" && (
              <option value="super_admin">Super Admin</option>
            )}
            <option value="admin">Admin Website</option>
            <option value="admin_pegawai">Admin Pegawai</option>
          </select>

          {/* STATUS */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value={1}>Aktif</option>
            <option value={0}>Nonaktif</option>
          </select>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
