import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import API from "../../services/api";

export default function TeacherClasses() {
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null); // ✅ untuk edit
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      setError("");
      const [resTeacherClasses, resTeachers, resClasses, resSubjects] =
        await Promise.all([
          API.get("/teacher-classes"),
          API.get("/teachers"),
          API.get("/classes"),
          API.get("/subjects"),
        ]);

      const tcData = Array.isArray(resTeacherClasses.data.data)
        ? resTeacherClasses.data.data
        : [];

      setTeacherClasses(tcData);
      setTeachers(resTeachers.data.data || []);
      setClasses(resClasses.data.data || []);
      setSubjects(resSubjects.data.data || []);
    } catch (err) {
      console.error("Gagal fetch data:", err);
      setError("Gagal memuat data. Silakan coba lagi nanti.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      if (!selectedTeacher || !selectedClass || !selectedSubject) {
        setError("Guru, kelas, dan mata pelajaran harus dipilih!");
        return;
      }

      const isDuplicate = teacherClasses.some(
        (tc) =>
          tc.teacher_id === parseInt(selectedTeacher) &&
          tc.class_id === parseInt(selectedClass) &&
          tc.subject_id === parseInt(selectedSubject) &&
          tc.id !== editId // ✅ abaikan id yang sedang diedit
      );

      if (isDuplicate) {
        setError("Data ini sudah ada!");
        return;
      }

      if (editId) {
        // Edit mode
        await API.put(`/teacher-classes/${editId}`, {
          teacher_id: selectedTeacher,
          class_id: selectedClass,
          subject_id: selectedSubject,
        });
        showToast("Data berhasil diperbarui!");
      } else {
        // Tambah mode
        await API.post("/teacher-classes", {
          teacher_id: selectedTeacher,
          class_id: selectedClass,
          subject_id: selectedSubject,
        });
        showToast("Data berhasil ditambahkan!");
      }

      // Reset form
      setSelectedTeacher("");
      setSelectedClass("");
      setSelectedSubject("");
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error("Gagal simpan data:", err);
      setError(err.response?.data?.message || "Gagal menyimpan data!");
    }
  };

  const handleEdit = (tc) => {
    setSelectedTeacher(tc.teacher_id);
    setSelectedClass(tc.class_id);
    setSelectedSubject(tc.subject_id);
    setEditId(tc.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/teacher-classes/${deleteId}`);
      showToast("Data berhasil dihapus!");
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Gagal hapus data:", err);
      setError("Gagal menghapus data. Coba lagi nanti!");
    }
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

      <h2 className="text-3xl font-bold text-sky-400 mb-6">
        Data Pengajaran
      </h2>

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

      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl max-w-lg mx-auto mb-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-300 flex items-center gap-2">
            {editId ? (
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
              <span>Edit Pengajaran</span>
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
              <span>Tambah Pengajaran</span>
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
          >
            <option value="" disabled selected>Pilih Guru</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
          >
            <option value="" disabled selected>Pilih Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.major?.abbreviation || ""} {c.group_name}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-800 border border-white/10 text-slate-100 px-4 py-2 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400 outline-none"
          >
            <option value="" disabled selected>Pilih Mata Pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setSelectedTeacher("");
                  setSelectedClass("");
                  setSelectedSubject("");
                }}
                className="px-6 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl transition font-medium"
            >
              {editId ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl w-full max-w-5xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-slate-300">
          Daftar Pengajaran
        </h3>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-sky-600/80 text-white">
              <tr>
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Nama Guru</th>
                <th className="py-2 px-4">Kelas</th>
                <th className="py-2 px-4">Mata Pelajaran</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {teacherClasses.length > 0 ? (
                teacherClasses.map((tc, index) => (
                  <tr
                    key={tc.id}
                    className="border-b border-white/10 hover:bg-sky-500/10 transition"
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4 font-semibold">
                      {tc.teacher?.name || "-"}
                    </td>
                    <td className="py-2 px-4">{tc.class?.name || "-"} {tc.class?.major?.abbreviation || "-"} {tc.class?.group_name || "-"}</td>
                    <td className="py-2 px-4">{tc.subject?.name || "-"}</td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(tc)}
                        className="bg-blue-500/80 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
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
                        onClick={() => confirmDelete(tc.id)}
                        className="bg-red-500/80 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
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
                  <td colSpan="6" className="py-4 text-center text-slate-400">
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Hapus */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 w-80 text-center shadow-xl">
            <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold mb-2 text-slate-100">
              Hapus Data?
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
