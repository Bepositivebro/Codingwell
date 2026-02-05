function togglePasswordVisibility() {
    const input = document.getElementById("passwordInput");
    input.type = input.type === "password" ? "text" : "password";
}

async function analyzePassword() {
    const password = document.getElementById("passwordInput").value;

    if (!password) {
        alert("Please enter a password");
        return;
    }

    const charsetSize = getCharsetSize(password);
    const entropy = password.length * Math.log2(charsetSize || 1);
    const score = Math.min(entropy / 10, 5);

    updateStrength(score);
    updateEntropy(entropy);
    updateCrackTime(entropy);

    try {
        const breached = await checkPasswordBreach(password);
        updateBreach(breached);
    } catch {
        document.getElementById("breachOutput").innerText =
            "⚠️ Breach check unavailable (offline)";
    }

    updateSuggestions(password);
    detectPatterns(password);
    showPasswordDNA(password);
    simulateHacker(score);
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
    const strengthText = document.getElementById("strengthText");
    const strengthBar = document.getElementById("strengthBar");

    let strength = "Very Weak";
    let color = "red";

    if (score > 4) {
        strength = "Strong";
        color = "#65ff4d";
    } else if (score > 2.5) {
        strength = "Moderate";
        color = "#ffcc00";
    }

    strengthText.innerText = `Strength: ${strength}`;
    strengthBar.style.width = `${score * 20}%`;
    strengthBar.style.background = color;
}

function updateEntropy(entropy) {
    document.getElementById("entropyOutput").innerHTML =
        `🔐 Entropy: ${entropy.toFixed(2)} bits`;
}

function updateCrackTime(entropy) {
    const seconds = Math.pow(2, entropy) / 1e9;
    document.getElementById("timeOutput").innerHTML =
        `⏱️ Estimated time to crack: ${formatTime(seconds)}`;
}

function formatTime(seconds) {
    if (seconds < 60) return `${Math.floor(seconds)} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
    if (seconds < 3.15e7 * 100) return `${Math.floor(seconds / 31536000)} years`;
    return "millennia (virtually uncrackable)";
}

async function checkPasswordBreach(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();

    return text.split("\n").some(line => line.startsWith(suffix));
}

function updateBreach(breached) {
    const breachOutput = document.getElementById("breachOutput");
    breachOutput.innerHTML = breached
        ? "⚠️ Found in known data breaches"
        : "✅ No known breaches detected";
}

function updateSuggestions(password) {
    const tips = [];
    if (password.length < 12) tips.push("Use at least 12 characters");
    if (!/[A-Z]/.test(password)) tips.push("Add uppercase letters");
    if (!/[0-9]/.test(password)) tips.push("Include numbers");
    if (!/[^A-Za-z0-9]/.test(password)) tips.push("Use special symbols");

    document.getElementById("suggestions").innerHTML =
        tips.length ? `💡 Suggestions:<br>• ${tips.join("<br>• ")}` : "✅ Strong composition";
}

function detectPatterns(password) {
    const patterns = ["qwerty", "asdf", "1234"];
    const lower = password.toLowerCase();
    document.getElementById("patternWarning").innerHTML =
        patterns.some(p => lower.includes(p))
            ? "⚠️ Predictable keyboard pattern detected"
            : "";
}

function showPasswordDNA(password) {
    const dna = [];
    if (/[a-z]/.test(password)) dna.push("Lowercase");
    if (/[A-Z]/.test(password)) dna.push("Uppercase");
    if (/[0-9]/.test(password)) dna.push("Numbers");
    if (/[^A-Za-z0-9]/.test(password)) dna.push("Symbols");

    document.getElementById("passwordDNA").innerHTML =
        `🧬 Password DNA: ${dna.join(", ")}`;
}

function simulateHacker(score) {
    const canvas = document.getElementById("hackerSim");
    if (!canvas) return; // SAFE GUARD

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lime";
    ctx.font = "14px monospace";
    ctx.fillText(`Simulated crack attempts: ${(6 - score) * 1000}`, 10, 30);
}
