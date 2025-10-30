import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import API from "../../services/api";

export default function Classes() {
  const [kelas, setKelas] = useState([]);
  const [majors, setMajors] = useState([]);
  const [namaKelas, setNamaKelas] = useState("");
  const [groupName, setGroupName] = useState("");
  const [majorId, setMajorId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      setError("");
      const res = await API.get("/classes");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.classes || [];
      setKelas(data);
    } catch (err) {
      console.error("Gagal fetch kelas:", err);
      setError("Gagal memuat data kelas. Silakan coba lagi nanti.");
    }
  };

  const fetchMajors = async () => {
    try {
      const res = await API.get("/majors");
      setMajors(res.data.data || res.data || []);
    } catch (err) {
      console.error("Gagal fetch majors:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMajors();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      if (!namaKelas.trim() || !groupName.trim() || !majorId) {
        setError("Semua field harus diisi!");
        return;
      }

      const isDuplicate = kelas.some(
        (k) =>
          k.name.toLowerCase() === namaKelas.toLowerCase() &&
          (!isEditing || k.id !== editId)
      );
      if (isDuplicate) {
        setError("Nama kelas sudah ada!");
        return;
      }

      if (isEditing) {
        await API.put(`/classes/${editId}`, {
          name: namaKelas,
          group_name: groupName,
          major_id: majorId,
        });
        showToast("Kelas berhasil diperbarui!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await API.post("/classes", {
          name: namaKelas,
          group_name: groupName,
          major_id: majorId,
        });
        showToast("Kelas berhasil ditambahkan!");
      }

      setNamaKelas("");
      setGroupName("");
      setMajorId("");
      fetchData();
    } catch (err) {
      console.error("Gagal simpan kelas:", err);
      setError(err.response?.data?.message || "Gagal menyimpan data kelas!");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/classes/${deleteId}`);
      showToast("Kelas berhasil dihapus!");
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Gagal hapus kelas:", err);
      setError("Gagal menghapus data kelas. Coba lagi nanti!");
    }
  };

  const handleEdit = (k) => {
    setIsEditing(true);
    setEditId(k.id);
    setNamaKelas(k.name);
    setGroupName(k.group_name || "");
    setMajorId(k.major_id || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNamaKelas("");
    setGroupName("");
    setMajorId("");
  };

  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden mb-12 sm:mb-0 relative">
      {toast && (
        <div className="max-w-2xl fixed top-5 right-5 z-50">
          <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl backdrop-blur-md animate-fade-in">
            <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" />
            <div>
              <strong className="font-semibold">Berhasil!</strong>
              <p className="text-sm">{toast}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-sky-400 mb-6">Data Kelas</h2>

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

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl max-w-lg mx-auto mb-8">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-slate-300">
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
              <span>Edit Kelas</span>
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
              <span>Tambah Kelas</span>
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex w-full gap-4">
            <select
              value={namaKelas}
              onChange={(e) => setNamaKelas(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            >
              <option value="" selected disabled>
                Pilih Kelas
              </option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>

            <select
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
            >
              <option value="" selected disabled>
                Pilih Rombel
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          <select
            value={majorId}
            onChange={(e) => setMajorId(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
          >
            <option value="" selected disabled>
              Pilih Jurusan
            </option>
            {majors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.abbreviation})
              </option>
            ))}
          </select>

          <div className="flex flex-wrap justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500/50 text-white px-6 py-2 rounded-xl hover:bg-gray-500 transition font-medium w-full sm:w-auto"
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
              } text-white px-6 py-2 rounded-xl transition font-medium w-full sm:w-auto`}
            >
              {isEditing ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl w-full max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-slate-300">
          Daftar Kelas
        </h3>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-sky-600/80 text-white">
              <tr>
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Kelas</th>
                <th className="py-2 px-4">Rombel</th>
                <th className="py-2 px-4">Jurusan</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kelas.length > 0 ? (
                kelas.map((k, index) => (
                  <tr
                    key={k.id}
                    className="border-b border-white/10 hover:bg-sky-500/10 transition"
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{k.name}</td>
                    <td className="py-2 px-4">{k.group_name}</td>
                    <td className="py-2 px-4">
                      {k.major?.name || "-"} ({k.major?.abbreviation || "-"})
                    </td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(k)}
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
                        onClick={() => confirmDelete(k.id)}
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
                    Belum ada data kelas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 w-80 text-center shadow-xl">
            <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold mb-2 text-slate-100">
              Hapus Kelas?
            </h4>
            <p className="text-sm text-slate-400 mb-5">
              Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
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
