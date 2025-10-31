import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { email, password });

      const { token, role, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: role,
        })
      );

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/login");
      }
    } catch {
      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        { id, message: "Email atau password salah!" },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center text-slate-100 relative overflow-hidden px-4">
      <div className="relative z-10 bg-white/5 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">Login E-Nilai</h1>
        <p className="text-slate-400 mb-6 text-sm">
          Masukkan email dan password Anda
        </p>

        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Email
            </label>
            <div className="flex items-center w-full px-2 py-1 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition">
              <Mail className="w-5 h-5 ml-3 text-slate-400" />
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-slate-100 px-3 py-2 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Password
            </label>
            <div className="flex items-center w-full px-2 py-1 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition">
              <Lock className="w-5 h-5 ml-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="flex-1 bg-transparent text-slate-100 px-3 py-2 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-sky-500/30"
          >
            Masuk
          </button>
        </form>

        <p className="mt-10 text-xs text-slate-500 border-t border-white/10 pt-4">
          © {new Date().getFullYear()} · Created by{" "}
          <a
            href="https://www.instagram.com/vortechdev_"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 font-semibold hover:underline"
          >
            @VortechDev
          </a>
        </p>
      </div>

      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-red-500/40 text-red-300 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 animate-slide-in cursor-pointer border border-red-400/30"
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          >
            <span>{toast.message}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide-in {
          0% { transform: translateX(100%) translateY(0); opacity: 0; }
          100% { transform: translateX(0) translateY(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
