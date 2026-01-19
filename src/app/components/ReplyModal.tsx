import { useState } from "react";

type CommentOperation = "add" | "subtract" | "divide" | "multiply";

export default function ReplyModal({ open, onClose, onSubmit }: { open: boolean, onClose: () => void, onSubmit: (value: number, operation: CommentOperation) => void }) {
  const [value, setValue] = useState("");
  const [operation, setOperation] = useState<CommentOperation>("add");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setLoading(true);
      try {
        await onSubmit(numValue, operation);
        setValue("");
        setOperation("add");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setValue("");
    setOperation("add");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Reply with Operation</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as CommentOperation)}
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="add">Add (+)</option>
            <option value="subtract">Subtract (-)</option>
            <option value="multiply">Multiply (×)</option>
            <option value="divide">Divide (÷)</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a number..."
            disabled={loading}
            step="any"
          />
        </div>

        <div className="flex gap-2 justify-end">
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
            disabled={loading || !value.trim() || isNaN(parseFloat(value))}
          >
            {loading ? 'Posting...' : 'Reply'}
          </button>
        </div>
      </div>
    </div>
  );
}
