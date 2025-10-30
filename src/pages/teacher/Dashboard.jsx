import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import API from "../../services/api";

export default function Dashboard() {
  const [kelasAmpu, setKelasAmpu] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setTeacherName(storedUser.name);
    } else {
      setTeacherName("Guru");
    }
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    let greet = "Halo";
    if (hour < 10) greet = "Selamat Pagi";
    else if (hour < 15) greet = "Selamat Siang";
    else if (hour < 19) greet = "Selamat Sore";
    else greet = "Selamat Malam";
    setGreeting(greet);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/teacher-class");
        setKelasAmpu(res.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Gagal fetch data guru:", err);
        setError("Gagal memuat data kelas yang Anda ajar.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full text-slate-100">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-sky-400 mb-2">
          {greeting}, {teacherName}!
        </h2>
        <p className="text-slate-400 text-sm">
          Berikut daftar kelas yang Anda ajar. Klik pada kelas untuk melihat detail siswa atau mengelola nilai.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kelasAmpu.length > 0 ? (
          kelasAmpu.map((kc, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl hover:scale-[1.02] transition-transform group"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-500/20 p-3 rounded-xl">
                    <BookOpen className="text-sky-400 w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-sky-300">
                    {kc.subject?.name || "Tanpa Mapel"}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">ID #{kc.id}</span>
              </div>

              <div className="text-sm text-slate-300 space-y-2 mb-4">
                <p className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>
                    Kelas:{" "}
                    <span className="font-medium text-white">
                      {kc.class?.name || "-"} {kc.class?.major?.abbreviation || "-"} {kc.class?.group_name || ""}
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>
                    Jumlah Siswa:{" "}
                    <span className="font-medium text-white">
                      {kc.studentCount}
                    </span>
                  </span>
                </p>
              </div>

              <button
                onClick={() => navigate(`/teacher/classes/${kc.id}`)}
                className="w-full py-2 rounded-lg bg-sky-500/80 hover:bg-sky-600 text-white font-semibold transition"
              >
                Lihat Detail
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-slate-400 py-12">
            Belum ada kelas yang Anda ajar.
          </div>
        )}
      </div>

      <p className="mt-12 text-xs text-slate-500 border-t border-white/10 pt-4 text-center">
        © {new Date().getFullYear()} · E-Nilai —{" "}
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
