import { useState, useEffect, useCallback } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const [strength, setStrength] = useState("Weak");
  const [strengthPercent, setStrengthPercent] = useState(25);
  const [showToast, setShowToast] = useState(false);

  // dhyan rakhna hai Password Generator
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numberAllowed) chars += "0123456789";
    if (charAllowed) chars += "!@#$%^&*()_+-=[]{}";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(randomIndex);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  //  Auto-generate password hai theek hai n 
  useEffect(() => {
    passwordGenerator();
  }, [passwordGenerator]);

  //  Strength Calculation h ye dhyan rkhna
  useEffect(() => {
    let score = 0;

    if (length >= 8) score += 25;
    if (length >= 12) score += 25;
    if (numberAllowed) score += 25;
    if (charAllowed) score += 25;

    setStrengthPercent(score);

    if (score <= 25) setStrength("Weak");
    else if (score <= 75) setStrength("Medium");
    else setStrength("Strong");
  }, [length, numberAllowed, charAllowed]);

  // 📋 Copy Password
  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-white text-2xl font-bold text-center mb-4">
          🔐 Password Generator
        </h1>

        {/* Password Field */}
        <div className="flex rounded overflow-hidden mb-3">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full px-3 py-2 outline-none text-black"
          />
          <button
            onClick={copyPassword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 cursor-pointer"
          >
            Copy
          </button>
        </div>

        {/* Toast */}
        {showToast && (
          <p className="text-green-400 text-center mb-2">
            ✅ Password Copied!
          </p>
        )}

        {/* Length Slider */}
        <div className="mb-4">
          <label className="text-white">
            Length: <span className="text-orange-400">{length}</span>
          </label>
          <input
            type="range"
            min={6}
            max={20}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Options */}
        <div className="flex justify-between text-white text-sm mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
            className="cursor-pointer"
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
            />
            Numbers
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
            className="cursor-pointer"
              type="checkbox"
              checked={charAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
            />
            Symbols
          </label>
        </div>

        {/* 🔥 Strength Progress Bar */}
        <div>
          <div className="w-full h-2 bg-gray-600 rounded">
            <div
              className={`h-2 rounded transition-all duration-300 cursor-pointer ${
                strength === "Weak"
                  ? "bg-red-500"
                  : strength === "Medium"
                  ? "bg-yellow-400"
                  : "bg-green-500"
              }`}
              style={{ width: `${strengthPercent}%` }}
            />
          </div>

          <p className="text-center text-white mt-2">
            Strength:{" "}
            <span
              className={`font-bold ${
                strength === "Weak"
                  ? "text-red-400"
                  : strength === "Medium"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {strength}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
