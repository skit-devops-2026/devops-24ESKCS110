const fs = require("fs");

const requiredFiles = [
    "frontend/index-does-not-exist.html",
    "frontend/login.html",
    "frontend/register.html",
    "frontend/dashboard.html",
    "frontend/notes.html",
    "frontend/snippets.html"
];

let failed = false;

console.log("Running DevVault tests...\n");

for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
        console.log(`PASS: ${file} exists`);
    } else {
        console.log(`FAIL: ${file} is missing`);
        failed = true;
    }
}

if (failed) {
    console.log("\nTests failed.");
    process.exit(1);
} else {
    console.log("\nAll tests passed.");
    process.exit(0);
}