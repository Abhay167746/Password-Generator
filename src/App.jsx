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
    navigator.clipboard.writeText(password);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-xl space-y-5">

        {/* Title */}
        <h1 className="text-white text-2xl font-bold text-center">
          🔐 Password Generator
        </h1>

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
            className="bg-gray-600 hover:bg-gray-700 text-white px-4"
            title="Show / Hide Password"
          >
            {showPassword ? "🙈" : "👁"}
          </button>

          <button
            onClick={copyPassword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5"
          >
            Copy
          </button>
        </div>

        {/* Toast */}
        {showToast && (
          <p className="text-green-400 text-center text-sm">
            ✅ Password Copied!
          </p>
        )}

        {/* Length Slider */}
        <div className="space-y-2">
          <label className="text-white text-sm">
            Length:{" "}
            <span className="text-orange-400 font-semibold">{length}</span>
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
        <div className="flex justify-between text-white text-sm">
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

        {/* Strength Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-600 rounded">
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

          <p className="text-center text-white text-sm">
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
