import { useState } from "react";

export default function AuthModal({ open, mode, onClose, onSuccess, onSwitchMode }: { open: boolean, mode: 'login' | 'register', onClose: () => void, onSuccess: (user: any) => void, onSwitchMode: (mode: 'login' | 'register') => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearFields = () => {
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleClose = () => {
    clearFields();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = {
        username,
        password
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'An error occurred');
        return;
      }

      const data = await res.json();
      clearFields();
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    clearFields();
    onSwitchMode(newMode);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
          disabled={loading}
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          disabled={loading}
        />

        {error && <div className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</div>}

        <div className="flex gap-2 justify-end mb-3">
          <button 
            onClick={handleClose} 
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading || !username.trim() || !password.trim()}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 border-t pt-3">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => handleSwitchMode(mode === 'login' ? 'register' : 'login')} 
            className="text-blue-600 hover:underline font-medium"
            disabled={loading}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
