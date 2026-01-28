import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { alertSuccess, alertError } from "../../lib/alert";

const Profile = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const roleLabel = {
    super_admin: "Super Admin",
    admin: "Admin Website",
    admin_pegawai: "Admin Pegawai",
  };
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("https://brewokode.site/api/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setForm({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        password: "",
      });
    } catch (error) {
      console.log(error)
      alertError("Gagal memuat profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "https://brewokode.site/api/profile",
        {
          name: form.name,
          password: form.password || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alertSuccess("Profile berhasil diperbarui");
      setForm({ ...form, password: "" });
    } catch (error) {
      console.log(error)
      alertError("Gagal memperbarui profile");
    }
  };

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Profile Saya</h2>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Role
                  </label>
                 <input
                    type="text"
                    value={roleLabel[form.role] || "-"}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Kosongkan jika tidak diubah"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                  >
                    Simpan Perubahan
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
