import { useEffect, useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { alertError, alertSuccess } from "../../lib/alert";
import { useNavigate, useParams } from "react-router-dom";

const CreateArtikel = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const { slug } = useParams();
const isEdit = Boolean(slug);

useEffect(() => {
  if (!isEdit) return;

  const fetchArtikel = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://brewokode.site/api/artikels/${slug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data.data ?? res.data;

      setForm({
        category: data.category,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        published_at: data.published_at,
        image: null,
        imagePreview: data.image_url ?? null,
        image_alt: data.image_alt,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
        canonical_url: data.canonical_url,
        content: data.content,
        status: Boolean(data.status),
        featured: Boolean(data.featured),
        noindex: Boolean(data.noindex),
      });

      // 🔥 INI KUNCI TAGS IKUT UPDATE
      setTags(data.tags.map(tag => tag.name));

    } catch (err) {
      console.log(err)
      alertError("Gagal memuat artikel");
    }
  };

  fetchArtikel();
}, [slug]);

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const value = tagInput.trim().toLowerCase();
      if (!value) return;

      if (!tags.includes(value)) {
        setTags([...tags, value]);
      }

      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };


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

    // 🔥 KIRIM TAGS
    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    let url = "https://brewokode.site/api/artikels";

    if (isEdit) {
      url = `https://brewokode.site/api/artikels/${slug}`;
      formData.append("_method", "PUT"); // WAJIB
    }

    await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alertSuccess(isEdit ? "Artikel diperbarui" : "Artikel dibuat");
    navigate("/artikel");

  } catch (err) {
    console.error(err);
    alertError("Gagal menyimpan artikel");
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
                className="w-full border px-3 py-2 cursor-pointer rounded bg-white"
                required
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Islami">Islami</option>
                <option value="Berita">Berita</option>
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
                className="w-full border px-3 py-2 rounded cursor-pointer"
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
            <input type="file" accept="image/*" onChange={handleChange} className="border py-2 rounded mt-5 px-3 border-gray-800 cursor-pointer"/>

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
                  onChange={handleChange} className="cursor-pointer"
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

{/* TAGS */}
<div>
  <label className="block font-semibold mb-1">Tags</label>

  <div className="flex flex-wrap gap-2 border rounded px-3 py-2">
    {tags.map((tag, index) => (
      <span
        key={index}
        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center gap-1"
      >
        #{tag}
        <button
          type="button"
          onClick={() => removeTag(index)}
          className="text-red-500 font-bold"
        >
          ×
        </button>
      </span>
    ))}

    <input
      type="text"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyDown={handleTagKeyDown}
      placeholder="Ketik tag lalu Enter"
      className="flex-1 outline-none"
    />
  </div>

  <p className="text-xs text-gray-500 mt-1">
    Tekan Enter atau koma untuk menambah tag
  </p>
</div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-700"
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
