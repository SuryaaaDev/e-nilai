import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import API from "../../services/api";

export default function Students() {
  const [siswa, setSiswa] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSiswa = async () => {
    try {
      const res = await API.get("/students");
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setSiswa(data);
      setError(null);
    } catch (err) {
      console.error("Error fetch siswa:", err);
      setError("Gagal memuat data siswa. Silakan coba lagi.");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      const data = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.classes || [];
      setClasses(data);
    } catch (err) {
      console.error("Error fetch kelas:", err);
      setError("Gagal memuat data kelas.");
    }
  };

  useEffect(() => {
    fetchSiswa();
    fetchClasses();
  }, []);

  const resetForm = () => {
    setNis("");
    setNama("");
    setEmail("");
    setClassId("");
    setPassword("");
    setIsEditing(false);
    setEditId(null);
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      if (!nis || !nama || !classId) {
        setError("NIS, Nama, dan Kelas wajib diisi saat edit.");
        return;
      }
    } else {
      if (!nis || !nama || !email || !password || !classId) {
        setError("Semua field wajib diisi saat menambah siswa.");
        return;
      }
    }

    try {
      if (isEditing) {
        await API.put(`/students/${editId}`, {
          nis,
          name: nama,
          class_id: classId,
          email,
        });
        showSuccess("Data siswa berhasil diperbarui!");
      } else {
        await API.post("/students", {
          nis,
          name: nama,
          email,
          password,
          class_id: classId,
        });
        showSuccess("Siswa berhasil ditambahkan!");
      }

      resetForm();
      fetchSiswa();
      setError(null);
    } catch (err) {
      console.error(
        "❌ Error saat menyimpan siswa:",
        err.response?.data || err
      );
      const msg =
        err.response?.data?.message ||
        "Gagal menyimpan data siswa. Periksa input dan coba lagi.";
      setError(msg);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await API.delete(`/students/${deleteId}`);
      fetchSiswa();
      setError(null);
      showSuccess("Siswa berhasil dihapus!");
      setDeleteId(null);
    } catch {
      setError("Gagal menghapus siswa. Silakan coba lagi.");
    }
  };

  const handleEdit = (s) => {
    setIsEditing(true);
    setEditId(s.id);
    setNis(s.nis);
    setNama(s.name);
    setEmail(s.user?.email || "");
    setClassId(s.class?.id || "");
    setPassword("");
  };

  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden mb-12 sm:mb-0">
      <h2 className="text-3xl font-bold text-sky-400 mb-6">Data Siswa</h2>

      {error && (
        <div className="max-w-2xl mb-6 animate-fade-in">
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-md">
            <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5" />
            <div>
              <strong className="font-semibold">Terjadi Kesalahan!</strong>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-2xl fixed top-5 right-5 z-50">
          <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl backdrop-blur-md animate-fade-in">
            <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" />
            <div>
              <strong className="font-semibold">Berhasil!</strong>
              <p className="text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl max-w-4xl mx-auto mb-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-300 flex items-center gap-2">
          {isEditing ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m19.3 8.925l-4.25-4.2l1.4-1.4q.575-.575 1.413-.575t1.412.575l1.4 1.4q.575.575.6 1.388t-.55 1.387L19.3 8.925ZM17.85 10.4L7.25 21H3v-4.25l10.6-10.6l4.25 4.25Z"
                ></path>
              </svg>
              <span>Edit Siswa</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 36 36"
              >
                <path
                  fill="currentColor"
                  d="M31 15H21V5a3 3 0 1 0-6 0v10H5a3 3 0 1 0 0 6h10v10a3 3 0 1 0 6 0V21h10a3 3 0 1 0 0-6z"
                ></path>
              </svg>
              <span>Tambah Siswa</span>
            </>
          )}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="NIS"
            value={nis}
            onChange={(e) => setNis(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Nama Siswa"
            value={nama}
            onChange={(e) => {
              const value = e.target.value;
              const capitalized = value
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ");
              setNama(capitalized);
            }}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            required={!isEditing}
          />

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          >
            <option value="" disabled>
              Pilih Kelas
            </option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.major?.abbreviation || "-"} {c.group_name}
              </option>
            ))}
          </select>

          <div className="sm:col-span-2 flex justify-end gap-3 mt-3 flex-wrap">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500/50 text-white px-6 py-2 rounded-xl hover:bg-gray-500 transition font-medium w-full sm:w-auto"
              >
                Batal
              </button>
            )}
            <button
              className={`${
                isEditing
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-sky-500 hover:bg-sky-600"
              } text-white px-6 py-2 rounded-xl transition font-medium w-full sm:w-auto`}
            >
              {isEditing ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl w-full max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-slate-300">
          Daftar Siswa
        </h3>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-sky-600/80 text-white">
              <tr>
                <th className="py-2 px-4">NIS</th>
                <th className="py-2 px-4">Nama</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Kelas</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {siswa.length > 0 ? (
                siswa.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-white/10 hover:bg-sky-500/10 transition"
                  >
                    <td className="py-2 px-4">{s.nis}</td>
                    <td className="py-2 px-4">{s.name}</td>
                    <td className="py-2 px-4">{s.user?.email || "-"}</td>
                    <td className="py-2 px-4">
                      {s.class
                        ? `${s.class.name || ""} ${
                            s.class.major?.abbreviation || ""
                          } ${s.class.group_name || ""}`.trim()
                        : "-"}
                    </td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-blue-500/80 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <g fill="currentColor">
                            <path d="M15.9 2L3 14.9v5.7h5.7L21.5 7.7zM7.8 18.5H5v-2.8l7.9-7.9l2.8 2.8zm6.5-12.1l1.6-1.6l2.8 2.8l-1.6 1.6z"></path>
                            <path d="M12 21h8.6v-2H14z" opacity=".5"></path>
                          </g>
                        </svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(s.id)}
                        className="bg-red-500/80 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 text-center text-slate-400 italic"
                  >
                    Belum ada data siswa
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 w-80 text-center shadow-xl">
            <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold mb-2 text-slate-100">
              Konfirmasi Hapus
            </h4>
            <p className="text-sm text-slate-400 mb-5">
              Apakah Anda yakin ingin menghapus data siswa ini?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-gray-500/50 text-white hover:bg-gray-500 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
