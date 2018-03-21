#!/usr/bin/env node

"use strict";

const s = `hej,pa,dig\nhoho`;

function boxedString(str) {
  const vertLength = str.length + 2;
  const vertLine = Array.from({ length: vertLength })
    .map(_ => "-")
    .join("");

  return `+${vertLine}+\n| ${str} |\n+${vertLine}+`;
}

function printJoinedBoxes(boxes) {
  const rows = boxes.reduce((acc, box, index) => {
    const lines = box.split("\n");
    if (index === 0) {
      return [lines[0], lines[1], lines[2]];
    }
    return [
      acc[0] + "   " + lines[0],
      acc[1] + "---" + lines[1],
      acc[2] + "   " + lines[2]
    ];
  }, []);

  rows.forEach(row => console.log(row));
}

function printUsage() {
  console.log("Usage: node boxd comma,string");
  process.exit(1);
}

if (require.main === module) {
  if (process.argv.length < 3) {
    printUsage();
  }

  const str = process.argv[2];
  const boxes = str.split(",").map(s => boxedString(s));

  printJoinedBoxes(boxes);
}
