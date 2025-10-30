import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  UserPlus,
  CheckCircle2,
  XCircle,
  FileInput,
  BarChart3,
} from "lucide-react";
import API from "../../services/api";

export default function TeacherClassDetail() {
  const { id } = useParams(); 
  const [kelas, setKelas] = useState(null);
  const [subject, setSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  const [nilaiBaru, setNilaiBaru] = useState({});
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState({ type: "", message: "" });
  const [activeTab, setActiveTab] = useState("input"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tcRes = await API.get(`/teacher-classes/${id}`);
        const tc = tcRes.data.data;

        if (!tc || !tc.class || !tc.subject) {
          throw new Error("Data teacher class tidak lengkap");
        }

        setKelas(tc.class);
        setSubject(tc.subject);

        const studentsRes = await API.get(`/students/class/${tc.class.id}`);
        setStudents(studentsRes.data.data || []);

        const scoreRes = await API.get(`/scores/class/${tc.class.id}/subject/${tc.subject.id}`);

        setScores(scoreRes.data.data || []);

        setLoading(false);
      } catch (err) {
        console.error("❌ Gagal fetch detail kelas:", err);
        setNotif({
          type: "error",
          message: "Gagal memuat data kelas dan siswa.",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (studentId, value) => {
    setNilaiBaru((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async (studentId) => {
    const score = nilaiBaru[studentId];
    if (!score) {
      setNotif({ type: "error", message: "Nilai tidak boleh kosong." });
      return;
    }

    try {
      await API.post("/scores", {
        student_id: studentId,
        class_id: kelas.id,
        subject_id: subject.id,
        score: parseFloat(score),
      });

      const updated = await API.get(
        `/scores/class/${kelas.id}/subject/${subject.id}`
      );
      setScores(updated.data.data || []);

      setNotif({ type: "success", message: "Nilai berhasil disimpan." });
      setNilaiBaru((prev) => ({ ...prev, [studentId]: "" }));
    } catch (err) {
      console.error("❌ Gagal simpan nilai:", err);
      setNotif({ type: "error", message: "Gagal menyimpan nilai siswa." });
    }
  };

  if (loading)
    return (
      <div className="text-center text-slate-400 py-10">
        Memuat data kelas...
      </div>
    );

  const values = scores.map((s) => s.score);
  const average =
    values.length > 0
      ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
      : "-";
  const highest = values.length > 0 ? Math.max(...values) : "-";
  const lowest = values.length > 0 ? Math.min(...values) : "-";

  return (
    <div className="min-h-screen w-full text-slate-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-sky-400 mb-2 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-sky-400" />
          {subject?.name || "Mata Pelajaran"} —{" "}
          {kelas?.name || "Kelas Tidak Diketahui"}{" "}
          {kelas?.major?.abbreviation || ""} {kelas?.group_name}
        </h2>
        <p className="text-slate-400 text-sm">
          Kelola dan lihat nilai siswa di kelas ini.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("input")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === "input"
              ? "bg-sky-500 text-white"
              : "bg-white/10 text-slate-300"
          }`}
        >
          <FileInput className="w-4 h-4" />
          Input Nilai
        </button>
        <button
          onClick={() => setActiveTab("rekap")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === "rekap"
              ? "bg-sky-500 text-white"
              : "bg-white/10 text-slate-300"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Rekap Nilai
        </button>
      </div>

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

      {activeTab === "input" ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl overflow-hidden">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-white/10 text-slate-300">
              <tr>
                <th className="py-3 px-4 font-semibold">No</th>
                <th className="py-3 px-4 font-semibold">Nama Siswa</th>
                <th className="py-3 px-4 font-semibold">NIS</th>
                <th className="py-3 px-4 font-semibold">Nilai</th>
                <th className="py-3 px-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s, index) => (
                  <tr
                    key={s.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{s.name}</td>
                    <td className="py-3 px-4">{s.nis}</td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={nilaiBaru[s.id] || ""}
                        onChange={(e) =>
                          handleInputChange(s.id, e.target.value)
                        }
                        className="w-24 bg-white/10 border border-white/20 text-slate-100 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleSubmit(s.id)}
                        className="flex items-center gap-2 bg-sky-500/80 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg transition"
                      >
                        <UserPlus className="w-4 h-4" />
                        Simpan
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-slate-400 py-6">
                    Tidak ada siswa di kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl overflow-hidden">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-white/10 text-slate-300">
                <tr>
                  <th className="py-3 px-4 font-semibold">No</th>
                  <th className="py-3 px-4 font-semibold">Nama Siswa</th>
                  <th className="py-3 px-4 font-semibold">NIS</th>
                  <th className="py-3 px-4 font-semibold">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {scores.length > 0 ? (
                  scores.map((s, index) => (
                    <tr
                      key={s.id}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{s.student?.name}</td>
                      <td className="py-3 px-4">{s.student?.nis}</td>
                      <td className="py-3 px-4">{s.score}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-slate-400 py-6">
                      Belum ada nilai tersimpan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-slate-300">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sky-400 text-lg font-bold">{average}</p>
              <p className="text-sm text-slate-400">Rata-rata</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-emerald-400 text-lg font-bold">{highest}</p>
              <p className="text-sm text-slate-400">Tertinggi</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-red-400 text-lg font-bold">{lowest}</p>
              <p className="text-sm text-slate-400">Terendah</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
