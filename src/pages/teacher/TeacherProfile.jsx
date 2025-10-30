import { useEffect, useState } from "react";
import { User, Mail, Lock, Save, CheckCircle2, XCircle } from "lucide-react";
import API from "../../services/api";

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState(null);
  const [form, setForm] = useState({ nip: "", name: "", email: "", password: "" });
  const [notif, setNotif] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/teacher/profile");
        setTeacher(res.data.data);
        setForm({
          nip: res.data.data.nip || "",
          name: res.data.data.name || "",
          email: res.data.data.email || "",
          password: "",
        });
        setLoading(false);
      } catch (err) {
        console.error("❌ Gagal memuat profil guru:", err);
        setNotif({ type: "error", message: "Gagal memuat profil guru." });
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put("/teacher/profile", form);
      setNotif({ type: "success", message: "Profil berhasil diperbarui." });
      setForm({ ...form, password: "" });
    } catch (err) {
      console.error("❌ Gagal update profil:", err);
      setNotif({ type: "error", message: "Gagal memperbarui profil guru." });
    }
  };

  if (loading)
    return (
      <div className="text-center text-slate-400 py-10">
        Memuat data profil...
      </div>
    );

  return (
    <div className="min-h-screen w-full text-slate-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-sky-400 mb-2 flex items-center gap-3">
          <User className="w-7 h-7 text-sky-400" />
          Profil Guru
        </h2>
        <p className="text-slate-400 text-sm">
          Perbarui data pribadi dan akun Anda di sini.
        </p>
      </div>

      {/* Notifikasi */}
      {notif.message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notif.type === "success"
              ? "bg-emerald-500/10 border border-emerald-400/30 text-emerald-300"
              : "bg-red-500/10 border border-red-400/30 text-red-300"
          }`}
        >
          {notif.type === "success" ? (
            <CheckCircle2 className="inline-block w-5 h-5 mr-2 text-emerald-400" />
          ) : (
            <XCircle className="inline-block w-5 h-5 mr-2 text-red-400" />
          )}
          {notif.message}
        </div>
      )}

      {/* Form Profil */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl p-6 max-w-xl"
      >
        <div className="mb-4">
          <label className="block text-slate-300 mb-1 font-medium">NIP</label>
          <input
            type="text"
            name="nip"
            value={form.nip}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 text-slate-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 mb-1 font-medium">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 text-slate-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 mb-1 font-medium">Email</label>
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg">
            <Mail className="w-5 h-5 ml-3 text-slate-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="flex-1 bg-transparent text-slate-100 px-3 py-2 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 mb-1 font-medium">
            Password Baru
          </label>
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg">
            <Lock className="w-5 h-5 ml-3 text-slate-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ingin mengubah"
              className="flex-1 bg-transparent text-slate-100 px-3 py-2 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-sky-500/80 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          <Save className="w-5 h-5" />
          Simpan Perubahan
        </button>
      </form>

      <p className="mt-10 text-xs text-slate-500 border-t border-white/10 pt-4 text-center">
        © {new Date().getFullYear()} · Guru Dashboard —{" "}
        <a
          href="https://www.instagram.com/vortechdev_"
          target="_blank"
          className="text-sky-400 font-semibold hover:underline"
        >
          @VortechDev
        </a>
      </p>
    </div>
  );
}
