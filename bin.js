#!/usr/bin/env node

const pkg = require("./package.json");
const readline = require("readline");
const createChart = require("./index.js");

function printUsage() {
  console.log(`aboxd ${pkg.version}`);
  console.log("");
  console.log("Usage: node aboxd [comma-separated string]");
  console.log("Or: node aboxd (to read from stdin)");
  process.exit(1);
}

const str = process.argv[2];

if (["-h", "-v"].some(option => option === str)) {
  printUsage();
}

if (!str || str === "-") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const lines = [];
  rl.on("line", function(line) {
    lines.push(line);
  });

  rl.on("close", function() {
    createChart(lines.join("\n"));
  });
} else {
  createChart(str);
}
