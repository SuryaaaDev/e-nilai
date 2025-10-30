import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { AlertTriangle } from "lucide-react";
import API from "../../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [jumlahGuru, setJumlahGuru] = useState(0);
  const [jumlahKelas, setJumlahKelas] = useState(0);
  const [jumlahJurusan, setJumlahJurusan] = useState(0);
  const [kelasLabels, setKelasLabels] = useState([]);
  const [kelasCounts, setKelasCounts] = useState([]);
  const [majorLabels, setMajorLabels] = useState([]);
  const [majorCounts, setMajorCounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, teachersRes, classesRes, majorsRes] = await Promise.all([
          API.get("/students"),
          API.get("/teachers"),
          API.get("/classes"),
          API.get("/majors"),
        ]);

        // gunakan .data.data agar sesuai struktur response API
        const students = studentsRes.data.data || [];
        const teachers = teachersRes.data.data || [];
        const classes = classesRes.data.data || [];
        const majors = majorsRes.data.data || [];

        // hitung total
        setJumlahSiswa(students.length);
        setJumlahGuru(teachers.length);
        setJumlahKelas(classes.length);
        setJumlahJurusan(majors.length);

        // Jumlah siswa per kelas
        const groupedClasses = {};
        students.forEach((s) => {
          const kelas = s.class?.name
            ? `${s.class.name} ${s.class.group_name || ""}`.trim()
            : "Tidak Diketahui";
          groupedClasses[kelas] = (groupedClasses[kelas] || 0) + 1;
        });
        setKelasLabels(Object.keys(groupedClasses));
        setKelasCounts(Object.values(groupedClasses));

        // Jumlah siswa per jurusan
        const groupedMajors = {};
        students.forEach((s) => {
          const jurusan = s.class?.major?.abbreviation || "Tidak Diketahui";
          groupedMajors[jurusan] = (groupedMajors[jurusan] || 0) + 1;
        });
        setMajorLabels(Object.keys(groupedMajors));
        setMajorCounts(Object.values(groupedMajors));

        setError(null);
      } catch (err) {
        console.error("Gagal fetch dashboard data:", err);
        setError("Gagal memuat data dari server. Periksa koneksi atau coba lagi nanti.");
      }
    };

    fetchData();
  }, []);

  const barData = {
    labels: kelasLabels,
    datasets: [
      {
        label: "Jumlah Siswa",
        data: kelasCounts,
        backgroundColor: "rgba(56,189,248,0.8)",
        borderRadius: 10,
      },
    ],
  };

  const doughnutData = {
    labels: majorLabels,
    datasets: [
      {
        data: majorCounts,
        backgroundColor: [
          "rgba(56,189,248,0.9)",
          "rgba(168,85,247,0.9)",
          "rgba(34,197,94,0.9)",
          "rgba(249,115,22,0.9)",
          "rgba(239,68,68,0.9)",
        ],
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.2)",
      },
    ],
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-slate-100 mb-12 sm:mb-0">
      <h2 className="text-3xl font-bold text-sky-400 mb-6">Dashboard Admin</h2>

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

      {/* Statistik Cepat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Jumlah Siswa" value={jumlahSiswa} color="text-sky-400" />
        <StatCard title="Jumlah Guru" value={jumlahGuru} color="text-purple-400" />
        <StatCard title="Jumlah Kelas" value={jumlahKelas} color="text-emerald-400" />
        <StatCard title="Jumlah Jurusan" value={jumlahJurusan} color="text-orange-400" />
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
        <ChartCard title="Jumlah Siswa per Kelas" color="text-sky-400">
          {kelasLabels.length > 0 ? (
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
                  y: {
                    ticks: { color: "#94a3b8" },
                    grid: { color: "rgba(255,255,255,0.05)" },
                    beginAtZero: true,
                  },
                },
              }}
              height={280}
            />
          ) : (
            <EmptyMessage />
          )}
        </ChartCard>

        <ChartCard title="Distribusi Siswa per Jurusan" color="text-emerald-400">
          {majorCounts.length > 0 ? (
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#cbd5e1",
                      font: { size: 12 },
                      padding: 16,
                    },
                  },
                },
              }}
              height={260}
            />
          ) : (
            <EmptyMessage />
          )}
        </ChartCard>
      </div>

      <p className="mt-10 text-xs text-slate-500 border-t border-white/10 pt-4 text-center">
        © {new Date().getFullYear()} · Created by{" "}
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

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl hover:scale-[1.02] transition-transform">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, color, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-xl overflow-hidden">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h3>
      <div className="flex justify-center items-center w-full h-[280px]">{children}</div>
    </div>
  );
}

function EmptyMessage() {
  return <p className="text-slate-400 text-center text-sm">Tidak ada data untuk ditampilkan</p>;
}
