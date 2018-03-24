#!/usr/bin/env node

"use strict";

function padCenter(str, length) {
  const leftOver = length - str.length;
  const startPad = Math.floor(leftOver / 2);
  const endPad = startPad + leftOver % 2;
  return str
    .padStart(str.length + startPad)
    .padEnd(str.length + endPad + startPad);
}

function boxedString(str, columnWidth) {
  const vertLength = columnWidth + 2;
  const vertLine = Array.from({ length: vertLength })
    .map(() => "-")
    .join("");
  if (str.length === 0) {
    const whitespace = "".padEnd(vertLength + 2);
    return `${whitespace}\n${whitespace}\n${whitespace}`;
  }

  const paddedString = padCenter(str, columnWidth);
  return `+${vertLine}+\n| ${paddedString} |\n+${vertLine}+`;
}

function isBoxEmpty(box) {
  return Array.from(box).filter(s => s !== " " && s !== "\n").length === 0;
}

function printJoinedBoxes(boxes) {
  const rows = boxes.reduce((acc, box, index) => {
    const lines = box.split("\n");
    if (index === 0) {
      return [lines[0], lines[1], lines[2]];
    }
    // console.log(boxes[index - 1]);
    const line =
      isBoxEmpty(box) || isBoxEmpty(boxes[index - 1]) ? "   " : "---";
    return [
      acc[0] + "   " + lines[0],
      acc[1] + line + lines[1],
      acc[2] + "   " + lines[2]
    ];
  }, []);

  rows.forEach(row => console.log(row));
}

function printUsage() {
  console.log("Usage: node boxd comma,string");
  process.exit(1);
}

function getColumnWidths(boxes) {
  return boxes
    .reduce((acc, curr) =>
      curr.map(
        (cell, index) => (cell.length > acc[index].length ? cell : acc[index])
      )
    )
    .map(s => s.length);
}
if (require.main === module) {
  if (process.argv.length < 3) {
    printUsage();
  }

  const str = process.argv[2];
  const boxRows = str.split("\n").map(s => s.split(","));
  const columnWidths = getColumnWidths(boxRows);

  const decoratedBoxes = boxRows.map(row => {
    return row.map((cell, i) => boxedString(cell, columnWidths[i]));
  });
  decoratedBoxes.forEach(printJoinedBoxes);
}
