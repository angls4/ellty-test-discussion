interface UserHeaderProps {
  user: any;
  onLogout: () => void;
  onStartCalculation: () => void;
  onLogin: () => void;
}

export default function UserHeader({
  user,
  onLogout,
  onStartCalculation,
  onLogin,
}: UserHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Comment Thread</h1>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium">{user.username}</span>
            <button
              onClick={onStartCalculation}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Start New Calculation
            </button>
            <button
              onClick={onLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onLogin}
            className="text-sm text-blue-600 hover:underline"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
