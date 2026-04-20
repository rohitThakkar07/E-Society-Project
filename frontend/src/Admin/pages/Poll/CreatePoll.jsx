import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiXCircle } from "react-icons/fi";
import { createPoll } from "../../../store/slices/pollSlice";

const CreatePoll = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.poll) ?? {};

  const [question,  setQuestion]  = useState("");
  const [options,   setOptions]   = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");
  const [error,     setError]     = useState("");

  const addOption    = () => { if (options.length < 6) setOptions([...options, ""]); };
  const removeOption = (i) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
  const updateOption = (i, val) => { const o = [...options]; o[i] = val; setOptions(o); };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (!question.trim()) return setError("Question is required.");
  const validOpts = options.filter(o => o.trim());
  if (validOpts.length < 2) return setError("At least 2 options are required.");
  if (!expiresAt) return setError("Expiry date is required.");

  const res = await dispatch(createPoll({
    question: question.trim(),
    options: validOpts,
    expiresAt: new Date(expiresAt).toISOString(), // ← fix: convert to ISO
  }));
  if (res.type.endsWith("fulfilled")) navigate("/admin/poll/list");
};

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate  = tomorrow.toISOString().split("T")[0];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Poll</h1>
          <p className="text-sm text-gray-500">Set up a new community vote for society residents.</p>
        </div>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase px-4 py-3 rounded-xl">{error}</div>}

          <div className="admin-form-group">
            <label className="admin-label">Poll Question *</label>
            <textarea 
              rows={2} 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Should we upgrade the swimming pool facilities?" 
              className="admin-input resize-none" 
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">
              Options * <span className="text-gray-400 normal-case font-medium ml-1">(min 2, max 6)</span>
            </label>
            <div className="space-y-3 mt-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <input 
                    value={opt} 
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="admin-input" 
                  />
                  {options.length > 2 && (
                    <button type="button" onClick={() => removeOption(i)}
                      className="text-red-400 hover:text-red-600 transition p-1">
                      <FiXCircle size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button type="button" onClick={addOption}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">
                <FiPlus size={14} /> Add option
              </button>
            )}
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Expiry Date *</label>
            <input 
              type="date" 
              value={expiresAt} 
              onChange={(e) => setExpiresAt(e.target.value)} 
              min={minDate}
              className="admin-input" 
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="admin-btn-primary"
            >
              {loading ? "Creating..." : "Create Poll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;