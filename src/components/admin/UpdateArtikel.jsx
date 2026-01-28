import { useEffect, useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { alertError, alertSuccess } from "../../lib/alert";
import { useNavigate, useParams } from "react-router-dom";

const UpdateArtikel = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    category: "",
    title: "",
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
    status: false,
    featured: false,
    noindex: false,
    tags: [],
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://brewokode.site/api/artikel/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const a = res.data.data;
        const tagsArr = a.tags ? a.tags.map(t => t.name) : [];
        setForm({
          category: a.category,
          title: a.title,
          excerpt: a.excerpt ?? "",
          published_at: a.published_at ?? "",
          image: null,
          imagePreview: a.image
            ? `https://brewokode.site/storage/${a.image}`
            : null,
          image_alt: a.image_alt ?? "",
          meta_title: a.meta_title ?? "",
          meta_description: a.meta_description ?? "",
          meta_keywords: a.meta_keywords ?? "",
          canonical_url: a.canonical_url ?? "",
          content: a.content,
          status: !!a.status,
          featured: !!a.featured,
          noindex: !!a.noindex,
          tags: tagsArr,
        });
        setTagInput(tagsArr.join(", "));
      } catch (err) {
        console.error(err);
        alertError("Gagal memuat artikel");
      }
    };

    fetchArtikel();
  }, [slug]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.title || !form.category || !form.content) {
    alertError("Kategori, Judul, dan Konten wajib diisi");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // ================= DATA UTAMA =================
    Object.keys(form).forEach((key) => {
      if (key === "imagePreview" || key === "tags") return;

      let value = form[key];
      if (typeof value === "boolean") value = value ? 1 : 0;

      if (value !== null) {
        formData.append(key, value);
      }
    });

    // ================= TAGS (WAJIB PISAH) =================
    form.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // ================= METHOD PUT =================
    formData.append("_method", "PUT");

    await axios.post(
      `https://brewokode.site/api/artikels/${slug}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alertSuccess("Artikel berhasil diperbarui");
    navigate("/artikel");
  } catch (err) {
    console.error(err.response?.data || err);
    alertError("Gagal memperbarui artikel");
  } finally {
    setLoading(false);
  }
};


  // ================= RENDER =================
  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 min-h-screen bg-slate-100">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Artikel</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow space-y-6"
          >
            {/* KATEGORI */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Berita">Berita</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Islami">Islami</option>
            </select>

            {/* JUDUL */}
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            {/* EXCERPT */}
            <textarea
              name="excerpt"
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
                setForm((prev) => ({
                  ...prev,
                  content: editor.getData(),
                }))
              }
            />

            {/* IMAGE */}
            <label className="px-4 py-2 text-sm  bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="mt-8 mb-4 cursor-pointer"
              />
            </label>

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

            <div>
              <label className="block font-semibold mb-1">Tags</label>

              <input
  type="text"
  value={tagInput}
  onChange={(e) => {
    const value = e.target.value;
    setTagInput(value);

    setForm(prev => ({
      ...prev,
      tags: value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "")
    }));
  }}
  placeholder="contoh: laravel, react, seo"
  className="w-full border px-3 py-2 rounded"
/>


              <p className="text-xs text-gray-500 mt-1">
                Pisahkan dengan koma
              </p>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Menyimpan..." : "Update Artikel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateArtikel;
