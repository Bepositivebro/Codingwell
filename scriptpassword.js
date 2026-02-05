function togglePasswordVisibility() {
    const input = document.getElementById("passwordInput");
    input.type = input.type === "password" ? "text" : "password";
}

async function analyzePassword() {
    const password = document.getElementById("passwordInput").value;

    if (!password) {
        alert("Enter a password first!");
        return;
    }

    const charsetSize = getCharsetSize(password);
    const entropy = password.length * Math.log2(charsetSize || 1);
    const score = Math.min(entropy / 10, 5);

    updateStrength(score);
    updateEntropy(entropy);
    updateCrackTime(entropy);
    updateSuggestions(password);
    detectPatterns(password);
    showPasswordDNA(password);
    simulateHacker(score);

    try {
        const breached = await checkPasswordBreach(password);
        document.getElementById("breachOutput").innerText =
            breached ? "⚠️ Found in data breaches!" : "✅ No known breaches found";
    } catch {
        document.getElementById("breachOutput").innerText =
            "⚠️ Breach check unavailable";
    }
}

function getCharsetSize(pwd) {
    let size = 0;
    if (/[a-z]/.test(pwd)) size += 26;
    if (/[A-Z]/.test(pwd)) size += 26;
    if (/[0-9]/.test(pwd)) size += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) size += 32;
    return size;
}

function updateStrength(score) {
    const bar = document.getElementById("strengthBar");
    const text = document.getElementById("strengthText");

    let label = "Very Weak";
    let color = "red";

    if (score > 4) {
        label = "Strong";
        color = "#00ff66";
    } else if (score > 2.5) {
        label = "Moderate";
        color = "#ffcc00";
    }

    text.innerText = `Strength: ${label}`;
    bar.style.width = `${score * 20}%`;
    bar.style.background = color;
}

function updateEntropy(entropy) {
    document.getElementById("entropyOutput").innerText =
        `🔐 Entropy: ${entropy.toFixed(2)} bits`;
}

function updateCrackTime(entropy) {
    const seconds = Math.pow(2, entropy) / 1e9;
    document.getElementById("timeOutput").innerText =
        `⏱️ Crack time: ${formatTime(seconds)}`;
}

function formatTime(sec) {
    if (sec < 60) return `${Math.floor(sec)} seconds`;
    if (sec < 3600) return `${Math.floor(sec / 60)} minutes`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} hours`;
    if (sec < 31536000) return `${Math.floor(sec / 86400)} days`;
    return "years / centuries";
}

async function checkPasswordBreach(password) {
    const enc = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-1", enc);
    const hex = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

    const prefix = hex.slice(0, 5);
    const suffix = hex.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();

    return text.includes(suffix);
}

function updateSuggestions(password) {
    const tips = [];
    if (password.length < 12) tips.push("Use 12+ characters");
    if (!/[A-Z]/.test(password)) tips.push("Add uppercase letters");
    if (!/[0-9]/.test(password)) tips.push("Include numbers");
    if (!/[^A-Za-z0-9]/.test(password)) tips.push("Add symbols");

    document.getElementById("suggestions").innerHTML =
        tips.length ? `💡 ${tips.join(" | ")}` : "✅ Good password structure";
}

function detectPatterns(password) {
    const risky = ["1234", "qwerty", "asdf"];
    const found = risky.some(p => password.toLowerCase().includes(p));

    document.getElementById("patternWarning").innerText =
        found ? "⚠️ Predictable pattern detected" : "";
}

function showPasswordDNA(password) {
    const dna = [];
    if (/[a-z]/.test(password)) dna.push("lowercase");
    if (/[A-Z]/.test(password)) dna.push("uppercase");
    if (/[0-9]/.test(password)) dna.push("numbers");
    if (/[^A-Za-z0-9]/.test(password)) dna.push("symbols");

    document.getElementById("passwordDNA").innerText =
        `🧬 Password DNA: ${dna.join(", ")}`;
}

function simulateHacker(score) {
    const canvas = document.getElementById("hackerSim");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff99";
    ctx.font = "14px monospace";

    const attempts = Math.floor((6 - score) * 1000);
    ctx.fillText(`Simulating ${attempts} brute-force attempts…`, 10, 35);
}
