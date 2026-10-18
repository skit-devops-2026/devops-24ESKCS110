const fs = require("fs");

const requiredFiles = [
    "react-frontend/package.json",
    "react-frontend/package-lock.json",
    "react-frontend/index.html",
    "react-frontend/src/main.jsx",
    "react-frontend/src/App.jsx",
    "react-frontend/src/styles.css",
    "Dockerfile",
    "docker-compose.yml",
    "nginx.conf"
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