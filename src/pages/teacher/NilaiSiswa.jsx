import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import API from "../../services/api";

export default function NilaiSiswa() {
  const [nilai, setNilai] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState("");
  const [mapel, setMapel] = useState("");
  const [nilaiAngka, setNilaiAngka] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchNilai = async () => {
    try {
      setError("");
      const res = await API.get("/scores");
      setNilai(res.data);
    } catch (err) {
      console.error("Gagal fetch nilai:", err);
      setError("Gagal memuat data nilai. Silakan coba lagi nanti.");
    }
  };

  const fetchSiswa = async () => {
    try {
      setError("");
      const res = await API.get("/students");
      setSiswa(res.data);
    } catch (err) {
      console.error("Gagal fetch siswa:", err);
      setError("Gagal memuat data siswa. Silakan coba lagi nanti.");
    }
  };

  useEffect(() => {
    fetchNilai();
    fetchSiswa();
  }, []);

  const resetForm = () => {
    setSelectedSiswa("");
    setMapel("");
    setNilaiAngka("");
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (isEditing) {
        await API.put(`/scores/${editId}`, {
          student_id: selectedSiswa,
          subject: mapel,
          score: nilaiAngka,
        });
        setSuccess("Data nilai berhasil diperbarui!");
      } else {
        await API.post("/scores", {
          student_id: selectedSiswa,
          subject: mapel,
          score: nilaiAngka,
        });
        setSuccess("Data nilai berhasil ditambahkan!");
      }
      resetForm();
      fetchNilai();
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error("Gagal simpan nilai:", err);
      setError(err.response?.data?.message || "Gagal menyimpan data nilai!");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setError("");
      await API.delete(`/scores/${deleteId}`);
      setSuccess("Data nilai berhasil dihapus!");
      fetchNilai();
      setShowDeleteModal(false);
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error("Gagal hapus nilai:", err);
      setError("Gagal menghapus nilai. Silakan coba lagi nanti!");
    }
  };

  const handleEdit = (n) => {
    setIsEditing(true);
    setEditId(n.id);
    setSelectedSiswa(n.student_id);
    setMapel(n.subject);
    setNilaiAngka(n.score);
  };

  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden mb-12 sm:mb-0">
      <h2 className="text-3xl font-bold text-sky-400 mb-6">Data Nilai Siswa</h2>

      {/* ⚠️ Alert Error */}
      {error && (
        <div className="max-w-2xl mb-6">
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-md">
            <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5" />
            <div>
              <strong className="font-semibold">Terjadi Kesalahan!</strong>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Alert Success */}
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

      {/* 🧾 Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl max-w-2xl mx-auto mb-8">
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
              <span>Edit Nilai</span>
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
              <span>Tambah Nilai</span>
            </>
          )}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <select
            value={selectedSiswa}
            onChange={(e) => setSelectedSiswa(e.target.value)}
            className="bg-slate-800/50 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          >
            <option value="">Pilih Siswa</option>
            {siswa.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.class?.name})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Mata Pelajaran"
            value={mapel}
            onChange={(e) => {
              const value = e.target.value;
              const formatted = value
                .split(" ")
                .map((w) =>
                  w.length > 0
                    ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                    : ""
                )
                .join(" ");
              setMapel(formatted);
            }}
            className="bg-slate-800/50 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />

          <input
            type="number"
            placeholder="Nilai"
            value={nilaiAngka}
            onChange={(e) => {
              let value = e.target.value.replace(/[^0-9]/g, "");
              if (value === "") {
                setNilaiAngka("");
              } else {
                const num = Math.min(Math.max(Number(value), 1), 100);
                setNilaiAngka(num);
              }
            }}
            min="1"
            max="100"
            className="bg-slate-800/50 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />

          <div className="md:col-span-2 flex justify-end gap-3 mt-3">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500/50 text-white px-6 py-2 rounded-xl hover:bg-gray-500 transition font-medium"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className={`${
                isEditing
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-sky-500 hover:bg-sky-600"
              } text-white px-6 py-2 rounded-xl transition font-medium`}
            >
              {isEditing ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl w-full max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-slate-300">
          Daftar Nilai
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse text-gray-200 min-w-[600px]">
            <thead className="bg-sky-600/80 text-white">
              <tr>
                <th className="py-2 px-4">Siswa</th>
                <th className="py-2 px-4">Kelas</th>
                <th className="py-2 px-4">Mapel</th>
                <th className="py-2 px-4">Nilai</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {nilai.length > 0 ? (
                nilai.map((n) => (
                  <tr
                    key={n.id}
                    className="border-b border-white/10 hover:bg-sky-500/10 transition"
                  >
                    <td className="py-2 px-4">{n.student?.name}</td>
                    <td className="py-2 px-4">{n.student?.class?.name}</td>
                    <td className="py-2 px-4">{n.subject}</td>
                    <td className="py-2 px-4 font-semibold">{n.score}</td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(n)}
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
                        onClick={() => confirmDelete(n.id)}
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
                  <td colSpan="5" className="py-4 text-center text-slate-400">
                    Belum ada data nilai
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 w-80 text-center shadow-xl">
            <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold mb-2 text-slate-100">
              Konfirmasi Hapus
            </h4>
            <p className="text-sm text-slate-400 mb-5">
              Apakah Anda yakin ingin menghapus data nilai siswa ini?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 rounded-xl bg-gray-500/50 text-white hover:bg-gray-500 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
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
