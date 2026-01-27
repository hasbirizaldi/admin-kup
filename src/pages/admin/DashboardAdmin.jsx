import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Selamat Datang {user?.name} 👋</h2>
          <p>Ini adalah halaman dashboard admin.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
