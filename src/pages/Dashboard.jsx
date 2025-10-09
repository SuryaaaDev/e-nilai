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
import API from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [jumlahKelas, setJumlahKelas] = useState(0);
  const [jumlahNilai, setJumlahNilai] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [avgScores, setAvgScores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siswaRes, kelasRes, nilaiRes] = await Promise.all([
          API.get("/students"),
          API.get("/classes"),
          API.get("/scores"),
        ]);

        setJumlahSiswa(siswaRes.data.length);
        setJumlahKelas(kelasRes.data.length);
        setJumlahNilai(nilaiRes.data.length);

        const grouped = {};
        nilaiRes.data.forEach((n) => {
          if (!grouped[n.subject]) grouped[n.subject] = [];
          grouped[n.subject].push(n.score);
        });

        const subjArr = Object.keys(grouped);
        const avgArr = subjArr.map((subj) => {
          const arr = grouped[subj];
          return arr.reduce((a, b) => a + b, 0) / arr.length;
        });

        setSubjects(subjArr);
        setAvgScores(avgArr);
        setError(null);
      } catch (err) {
        console.error("Gagal fetch dashboard data:", err);
        setError(
          "Gagal memuat data dari server. Periksa koneksi atau coba lagi nanti."
        );
      }
    };

    fetchData();
  }, []);

  const barData = {
    labels: subjects,
    datasets: [
      {
        label: "Rata-rata Nilai",
        data: avgScores,
        backgroundColor: [
          "rgba(14,165,233,0.8)",
          "rgba(139,92,246,0.8)",
          "rgba(34,197,94,0.8)",
          "rgba(249,115,22,0.8)",
          "rgba(239,68,68,0.8)",
        ],
        borderRadius: 10,
      },
    ],
  };

  const doughnutData = {
    labels: ["Siswa", "Kelas", "Nilai"],
    datasets: [
      {
        label: "Dataset",
        data: [jumlahSiswa, jumlahKelas, jumlahNilai],
        backgroundColor: [
          "rgba(56,189,248,0.9)",
          "rgba(168,85,247,0.9)",
          "rgba(34,197,94,0.9)",
        ],
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-slate-100 mb-12 sm:mb-0">
      <h2 className="text-3xl font-bold text-sky-400 mb-6">Dashboard</h2>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl hover:scale-[1.02] transition-transform">
          <h3 className="text-sm font-medium text-slate-400">Jumlah Siswa</h3>
          <p className="text-4xl font-bold text-sky-400 mt-2">{jumlahSiswa}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl hover:scale-[1.02] transition-transform">
          <h3 className="text-sm font-medium text-slate-400">Jumlah Kelas</h3>
          <p className="text-4xl font-bold text-purple-400 mt-2">
            {jumlahKelas}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl hover:scale-[1.02] transition-transform">
          <h3 className="text-sm font-medium text-slate-400">Data Nilai</h3>
          <p className="text-4xl font-bold text-emerald-400 mt-2">
            {jumlahNilai}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-xl overflow-hidden">
          <h3 className="text-lg font-semibold text-sky-400 mb-4">
            Rata-rata Nilai per Mata Pelajaran
          </h3>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[280px]">
              {subjects.length > 0 ? (
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        titleColor: "#fff",
                        bodyColor: "#ddd",
                        backgroundColor: "rgba(30,41,59,0.9)",
                        borderColor: "rgba(148,163,184,0.3)",
                        borderWidth: 1,
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: "#94a3b8" },
                        grid: { color: "rgba(255,255,255,0.05)" },
                      },
                      y: {
                        ticks: { color: "#94a3b8" },
                        grid: { color: "rgba(255,255,255,0.05)" },
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                  height={280}
                />
              ) : (
                <p className="text-slate-400 text-center text-sm">
                  Tidak ada data untuk ditampilkan
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-xl overflow-hidden">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">
            Ringkasan Data
          </h3>
          <div className="flex justify-center items-center">
            {jumlahSiswa + jumlahKelas + jumlahNilai > 0 ? (
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
              <p className="text-slate-400 text-center text-sm">
                Data belum tersedia
              </p>
            )}
          </div>
        </div>
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
