import { useState, useEffect, useCallback } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const [strength, setStrength] = useState("Weak");
  const [strengthPercent, setStrengthPercent] = useState(25);
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🌙 Theme State
  const [darkMode, setDarkMode] = useState(true);

  // 🔐 Password Generator
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

  // 🔄 Auto-generate password
  useEffect(() => {
    passwordGenerator();
  }, [passwordGenerator]);

  // 📊 Strength Calculation
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
    if (strength === "Weak") return;

    navigator.clipboard.writeText(password);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-xl shadow-xl space-y-5 transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            🔐 Password Generator
          </h1>

          {/* 🌙 Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="text-xl"
            title="Toggle Theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Password Field */}
        <div className="flex rounded-lg overflow-hidden">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="w-full px-4 py-2 text-black outline-none"
          />

          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4"
          >
            {showPassword ? "🙈" : "👁"}
          </button>

          <button
            onClick={copyPassword}
            disabled={strength === "Weak"}
            className={`px-5 text-white ${
              strength === "Weak"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Copy
          </button>
        </div>

        {/* Toast */}
        {showToast && (
          <p className="text-green-500 text-center text-sm">
            ✅ Password Copied!
          </p>
        )}

        {/* Weak Warning */}
        {strength === "Weak" && (
          <p className="text-red-400 text-center text-xs">
            ⚠️ Increase length or add numbers/symbols
          </p>
        )}

        {/* Length Slider */}
        <div className="space-y-2">
          <label
            className={`text-sm ${
              darkMode ? "text-white" : "text-gray-700"
            }`}
          >
            Length:{" "}
            <span className="text-orange-500 font-semibold">{length}</span>
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
        <div
          className={`flex justify-between text-sm ${
            darkMode ? "text-white" : "text-gray-700"
          }`}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
            />
            Numbers
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={charAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
            />
            Symbols
          </label>
        </div>

        {/* Strength Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-300 rounded">
            <div
              className={`h-2 rounded transition-all duration-300 ${
                strength === "Weak"
                  ? "bg-red-500"
                  : strength === "Medium"
                  ? "bg-yellow-400"
                  : "bg-green-500"
              }`}
              style={{ width: `${strengthPercent}%` }}
            />
          </div>

          <p
            className={`text-center text-sm ${
              darkMode ? "text-white" : "text-gray-700"
            }`}
          >
            Strength:{" "}
            <span
              className={`font-bold ${
                strength === "Weak"
                  ? "text-red-500"
                  : strength === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
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
