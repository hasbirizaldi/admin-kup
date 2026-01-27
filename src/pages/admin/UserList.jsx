import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import UserModal from "../../components/admin/UserModal";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";

const UserList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await alertConfirm("Akan menghapus user ini?");
    if (!result) return;

    try {
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });

        await alertSuccess('User berhasil dihapus')
        fetchUsers(); 
        } catch (error) {
            console.log(error);
            await alertError('Terjadi kesalahan')
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
            Daftar User
            </h2>
            <button onClick={() => {setEditUser(null); setShowModal(true);}} className="px-4 py-2 text-xs bg-blue-700 text-white rounded hover:bg-blue-800 cursor-pointer "> + Tambah User</button>
        </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-200">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        {{
                          super_admin: "Super Admin",
                          admin: "Admin Website",
                          admin_pegawai: "Admin Pegawai",
                        }[user.role] || "Unknown Role"}
                      </td>

                      <td className="p-3">
                        {user.status === 1 ? (
                          <span className="text-green-600 font-semibold">
                            Aktif
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex items-center gap-2 cursor-pointer">
                        <button onClick={() => {setEditUser(user); setShowModal(true);}} className="px-3 py-1 text-xs bg-green-600 text-white rounded cursor-pointer">
                        Edit
                        </button>

                       <button
                        onClick={() => handleDelete(user.id)}
                        disabled={user.role === "super_admin"}
                        className={`px-3 py-1 text-xs rounded text-white
                            ${
                            user.role === "super_admin"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 cursor-pointer"
                            }`}
                        >
                        Delete
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
      <UserModal
        show={showModal}
        editUser={editUser}
        onClose={() => {
            setShowModal(false);
            setEditUser(null);
        }}
        onSuccess={fetchUsers}
        />
    </div>
  );
};

export default UserList;
