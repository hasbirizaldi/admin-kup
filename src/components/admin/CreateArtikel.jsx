import { useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { alertError, alertSuccess } from "../../lib/alert";
import { useNavigate } from "react-router-dom";

const CreateArtikel = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "",
    title: "",
    slug: "",
    excerpt: "",
    published_at: "",
    image: null,
    imagePreview: null,
    image_alt: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    content: "",
    status: true,
    featured: false,
    noindex: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      setForm({
        ...form,
        image: file,
        imagePreview: file ? URL.createObjectURL(file) : null,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.content || !form.image) {
      alertError("Kategori, Judul, Konten, dan Gambar wajib diisi");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "imagePreview") return;
        let value = form[key];
        if (typeof value === "boolean") value = value ? 1 : 0;
        formData.append(key, value);
      });

      await axios.post("http://localhost:8000/api/artikels", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alertSuccess("Artikel berhasil dibuat");
      navigate("/artikel");
    } catch (err) {
      console.error(err);
      alertError("Gagal membuat artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Buat Artikel</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow space-y-6"
          >
            {/* KATEGORI */}
            <div>
              <label className="block font-semibold mb-1">
                Kategori <span className="text-red-500">*</span>
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded bg-white"
                required
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Berita">Berita</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Islami">Islami</option>
              </select>
            </div>

            {/* PUBLISHED AT */}
            <div>
              <label className="block font-semibold mb-1">
                Tanggal Publish
              </label>
              <input
                type="date"
                name="published_at"
                value={form.published_at}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>



            {/* JUDUL */}
            <input
              type="text"
              name="title"
              placeholder="Judul Artikel"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            {/* SLUG */}
            <input
              type="text"
              name="slug"
              placeholder="Slug (opsional)"
              value={form.slug}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            {/* EXCERPT */}
            <textarea
              name="excerpt"
              placeholder="Excerpt / Ringkasan"
              value={form.excerpt}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows={3}
            />

            {/* CONTENT */}
            <CKEditor
              editor={ClassicEditor}
              data={form.content}
              onChange={(e, editor) =>
                setForm({ ...form, content: editor.getData() })
              }
            />

            {/* IMAGE */}
            <input type="file" accept="image/*" onChange={handleChange} />

            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="Preview"
                className="max-h-48 rounded"
              />
            )}

            <input
              type="text"
              name="image_alt"
              placeholder="Alt gambar"
              value={form.image_alt}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            {/* SEO */}
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-bold">SEO</h3>

              <input
                type="text"
                name="meta_title"
                placeholder="Meta Title"
                value={form.meta_title}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                name="meta_description"
                placeholder="Meta Description"
                value={form.meta_description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                rows={2}
              />

              <input
                type="text"
                name="meta_keywords"
                placeholder="Meta Keywords"
                value={form.meta_keywords}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="url"
                name="canonical_url"
                placeholder="Canonical URL"
                value={form.canonical_url}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* OPTIONS */}
            <div className="flex gap-6">
              <label>
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                />{" "}
                Publish
              </label>

              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />{" "}
                Featured
              </label>

              <label>
                <input
                  type="checkbox"
                  name="noindex"
                  checked={form.noindex}
                  onChange={handleChange}
                />{" "}
                Noindex
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Menyimpan..." : "Simpan Artikel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateArtikel;
