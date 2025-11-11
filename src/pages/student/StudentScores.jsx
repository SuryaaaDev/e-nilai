import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  BookOpen,
  LogOut,
  UserCircle2,
  Award,
  Lock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // 🔹 animasi keluar
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfileAndScores();
  }, []);

  const fetchProfileAndScores = async () => {
    try {
      const [profileRes, scoreRes] = await Promise.all([
        API.get("/student/profile"),
        API.get("/student/scores"),
      ]);
      setStudent(profileRes.data.data);
      setScores(scoreRes.data.data || []);
      setError(null);
    } catch (error) {
      console.error("❌ Gagal memuat data:", error);
      setError("Gagal memuat data nilai. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Konfirmasi password tidak cocok!");
      return;
    }

    try {
      setIsUpdating(true);
      await API.put("/student/update-password", {
        currentPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess("Password berhasil diubah!");
      handleCloseModal();
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("❌ Gagal update password:", error);
      setError(error.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowModal(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 relative">
      <header className="bg-slate-900/70 backdrop-blur-md border-b border-white/10 py-4 px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="text-sky-400" size={28} />
          <h1 className="text-xl font-bold text-sky-400">E-Nilai</h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          {student ? (
            <>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition"
              >
                <UserCircle2 size={24} />
                <span className="font-medium">
                  {student.name.length > 10
                    ? student.name.slice(0, 10) + "..."
                    : student.name}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <div className="text-gray-400">Memuat...</div>
          )}
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-sky-400 mb-4 flex items-center gap-2">
          <BookOpen size={26} /> Nilai Saya
        </h2>
        <p className="text-slate-400 mb-6">
          Berikut daftar nilai kamu di setiap mata pelajaran.
        </p>

        {error && (
          <div className="fixed top-5 right-5 z-50">
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-md animate-fade-in">
              <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5" />
              <div>
                <strong className="font-semibold">Terjadi Kesalahan!</strong>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="fixed top-5 right-5 z-50">
            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl backdrop-blur-md animate-fade-in">
              <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" />
              <div>
                <strong className="font-semibold">Berhasil!</strong>
                <p className="text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-slate-400">Memuat data...</div>
        ) : scores.length === 0 ? (
          <div className="bg-white/5 border border-white/10 text-slate-400 p-8 text-center rounded-2xl shadow backdrop-blur-xl">
            Belum ada data nilai.
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-xl overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-sky-600/80 text-white">
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap">No</th>
                  <th className="py-3 px-4 whitespace-nowrap">
                    Mata Pelajaran
                  </th>
                  <th className="py-3 px-4 whitespace-nowrap">Kelas</th>
                  <th className="py-3 px-4 whitespace-nowrap">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/10 hover:bg-sky-500/10 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{item.subject?.name || "-"}</td>
                    <td className="py-3 px-4">{item.class?.name || "-"}</td>
                    <td className="py-3 px-4 font-semibold text-sky-300">
                      {item.score || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-30">
          <div
            className={`bg-slate-900 border border-slate-700 w-full max-w-sm h-full shadow-xl p-6 ${
              isClosing ? "animate-slideRight" : "animate-slideLeft"
            }`}
          >
            <h2 className="text-2xl font-bold text-sky-400 mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
              <Lock size={22} /> Ubah Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
                >
                  {isUpdating ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        .animate-slideLeft {
          animation: slideLeft 0.3s ease-out forwards;
        }
        .animate-slideRight {
          animation: slideRight 0.3s ease-in forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
