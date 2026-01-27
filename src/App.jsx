import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UserList from "./pages/admin/UserList";
import ArtikelList from "./pages/admin/ArtikelList";
import DokterList from "./pages/admin/DokterList";
import JadwalPoliklinik from "./pages/admin/JadwalPoliklinik";
import ProtectedRoute from "./pages/ProtectedRoute"
import Profile from "./pages/admin/Profile";
import CreateArtikel from "./components/admin/CreateArtikel";
import ArtikelDetail from "./pages/admin/ArtikelDetail";
import UpdateArtikel from "./components/admin/UpdateArtikel";
import PromosiLeaflet from "./pages/admin/PromosiLeaflet";
import Gallery from "./pages/admin/Gallery";
import Karier from "./pages/admin/Karier";
import Vidio from "./pages/admin/Vidio";
import Lamaran from "./pages/admin/Lamaran";
import Spesialis from "./pages/admin/Spesialis";
import JadwalDokter from "./pages/admin/JadwalDokter";
import Slider from "./pages/admin/Slider";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardAdmin />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <UserList />
          </ProtectedRoute>
        }
      />

       <Route
        path="/artikel"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <ArtikelList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-artikel"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <CreateArtikel />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/artikel/:slug"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <ArtikelDetail />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/artikel/edit/:slug"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <UpdateArtikel />
          </ProtectedRoute>
        }
      />

       <Route
        path="/promosi-leaflet"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <PromosiLeaflet />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gallery"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <Gallery />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sliders"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <Slider />
          </ProtectedRoute>
        }
      />

      <Route
        path="/video"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <Vidio />
          </ProtectedRoute>
        }
      />

      <Route
        path="/karier"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <Karier />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dokter"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <DokterList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jadwal-dokter"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <JadwalDokter />
          </ProtectedRoute>
        }
      />

      <Route
        path="/spesialis"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <Spesialis />
          </ProtectedRoute>
        }
      />

      <Route
        path="/poliklinik"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <JadwalPoliklinik />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lamaran"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin_pegawai"]}>
            <Lamaran />
          </ProtectedRoute>
        }
      />

      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
