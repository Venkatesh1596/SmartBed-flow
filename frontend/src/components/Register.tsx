import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // In a full implementation, this would POST to a backend /register or /request-access endpoint
    // For this MVP's secure model, we will mock the request access flow.
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* LEFT SIDE: Branding */}
      <div className="md:w-1/2 bg-blue-900 text-white flex flex-col justify-center items-center p-12">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-black tracking-tight text-white">SMARTBED FLOW</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-blue-50">Smarter Bed Turnover. Faster Patient Flow.</h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Coordinate discharge readiness, cleaning, bed availability and operational workload from one unified control platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Modern Register Card */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
          
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Requested</h2>
              <p className="text-slate-500 mb-8">
                Your request for access has been submitted to the facility administrator. You will be able to log in once approved.
              </p>
              <Link to="/login" className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Request Access</h2>
                <p className="text-slate-500 mt-1">Submit your details to request platform access.</p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700 text-sm font-semibold">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Requested Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-lg shadow-sm shadow-blue-200 transition-all"
                >
                  Submit Request
                </button>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1 hover:underline">Sign In</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
