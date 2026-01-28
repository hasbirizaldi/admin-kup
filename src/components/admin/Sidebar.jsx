import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { FaHome, FaUsers, FaUser, FaYoutube } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { AiOutlineSchedule } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import { alertConfirm } from "../../lib/alert";
import { MdWork } from "react-icons/md";
import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { IoMdPhotos } from "react-icons/io";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [openDokter, setOpenDokter] = useState(false);

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded transition
     hover:bg-slate-700
     ${isActive ? "bg-slate-700" : ""}`;

  const handleLogout = async () => {
    const confirm = await alertConfirm(
      "Apakah Anda yakin ingin logout?"
    );

    if (!confirm) return;

    try {
      await axios.post(
        "https://brewokode.site/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      // abaikan error (token expired dll)
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };


  return (
    <>
      <div
        className={`bg-slate-800 text-white min-h-screen transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Logo */}
        <div className="p-4 font-bold text-center border-b border-slate-700">
          {collapsed ? "A" : "Admin Panel"}
        </div>

        {/* Menu */}
        <ul className="p-2 space-y-2">
          <NavLink to="/" className={menuClass}>
            <FaHome size={18} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

           {(role === "super_admin" || role === "admin") && (
            <NavLink to="/poliklinik" className={menuClass}>
              <AiOutlineSchedule size={18} />
              {!collapsed && <span>Jadwal Poliklinik</span>}
            </NavLink>
           )}

           {(role === "super_admin" || role === "admin") && (
            <NavLink to="/artikel" className={menuClass}>
              <MdArticle size={18} />
              {!collapsed && <span>Artikel</span>}
            </NavLink>
           )}

          {(role === "super_admin" || role === "admin") && (
            <div className="relative">
              
              {/* PARENT MENU */}
              <button
                onClick={() => setOpenDokter(!openDokter)}
                className={`${menuClass} w-full flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <FaUserDoctor size={18} />
                  {!collapsed && <span>Dokter</span>}
                </div>

                {!collapsed && (
                  openDokter ? <IoChevronUp /> : <IoChevronDown />
                )}
              </button>

              {/* DROPDOWN */}
              {openDokter && !collapsed && (
                <div className="ml-8 mt-1 flex flex-col gap-1">

                  <NavLink to="/dokter" className={menuClass}>
                    Daftar Dokter
                  </NavLink>

                  <NavLink to="/spesialis" className={menuClass}>
                    Daftar Spesialis
                  </NavLink>

                  <NavLink to="/jadwal-dokter" className={menuClass}>
                    Jadwal Dokter
                  </NavLink>

                </div>
              )}
            </div>
          )}

           {(role === "super_admin" || role === "admin") && (
          <NavLink to="/sliders" className={menuClass}>
            <IoMdPhotos size={18} />
            {!collapsed && <span>Sliders</span>}
          </NavLink>
           )}

           {(role === "super_admin" || role === "admin") && (
          <NavLink to="/promosi-leaflet" className={menuClass}>
            <IoMdPhotos size={18} />
            {!collapsed && <span>Promosi & Leaflet</span>}
          </NavLink>
           )}

           {(role === "super_admin" || role === "admin") && (
            <NavLink to="/gallery" className={menuClass}>
              <IoMdPhotos size={18} />
              {!collapsed && <span>Gallery</span>}
            </NavLink>
           )}

           {(role === "super_admin" || role === "admin") && (
            <NavLink to="/video" className={menuClass}>
              <FaYoutube size={18} />
              {!collapsed && <span>Vidio</span>}
            </NavLink>
           )}
          
           {(role === "super_admin" || role === "admin") && (
           <NavLink to="/karier" className={menuClass}>
            <MdWork size={18} />
            {!collapsed && <span>Karier</span>}
          </NavLink>
           )}

           {(role === "super_admin" || role === "admin_pegawai") && (
           <NavLink to="/lamaran" className={menuClass}>
            <MdWork size={18} />
            {!collapsed && <span>Lamaran</span>}
          </NavLink>
           )}

          {role === "super_admin" && (
          <NavLink to="/users" className={menuClass}>
            <FaUsers size={18} />
            {!collapsed && <span>Users</span>}
          </NavLink>
        )}

          <NavLink to="/profile" className={menuClass}>
            <FaUser size={18} />
            {!collapsed && <span>Profile</span>}
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-3 p-2 rounded w-full hover:bg-red-600 transition"
          >
            <TbLogout2 size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </ul>
      </div>

    </>
  );
};

export default Sidebar;
