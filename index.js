#!/usr/bin/env node

"use strict";

const readline = require("readline");

function repeatChar(chr, length) {
  return Array.from({ length }, () => chr).join("");
}

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

function connectedBox(boxRows, rowIndex, cellIndex, columnWidth) {
  const padValue = columnWidth + 4;
  const leftOver = (padValue - 1) % 2;
  let result = "";
  // Top
  if (boxRows[rowIndex - 1] && !isBoxEmpty(boxRows[rowIndex - 1][cellIndex])) {
    result += padCenter("|", padValue);
  } else {
    result += padCenter(" ", padValue);
  }

  // Left
  if (
    boxRows[rowIndex][cellIndex - 1] &&
    !isBoxEmpty(boxRows[rowIndex][cellIndex - 1])
  ) {
    result += `\n${repeatChar("-", Math.floor((padValue - 1) / 2))}`;
  } else {
    result += `\n${repeatChar(" ", Math.floor((padValue - 1) / 2))}`;
  }
  result += "+";
  // Right
  if (
    boxRows[rowIndex][cellIndex + 1] &&
    !isBoxEmpty(boxRows[rowIndex][cellIndex + 1])
  ) {
    result += `${repeatChar("-", Math.floor((padValue - 1) / 2) + leftOver)}`;
  } else {
    result += `${repeatChar(" ", Math.floor((padValue - 1) / 2) + leftOver)}`;
  }

  // Bottom
  if (boxRows[rowIndex + 1] && !isBoxEmpty(boxRows[rowIndex + 1][cellIndex])) {
    result += `\n${padCenter("|", padValue)}`;
  } else {
    result += `\n${padCenter(" ", padValue)}`;
  }

  return result;
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
  console.log("Usage: node aboxd [comma-separated string]");
  console.log("Or: node aboxd --stdin");
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

function createChart(str) {
  const boxRows = str.split("\n").map(s => s.split(","));
  const columnWidths = getColumnWidths(boxRows);

  const decoratedBoxes = boxRows.map((row, rowIndex) => {
    return row.map((cell, cellIndex) => {
      if (cell === ".") {
        return connectedBox(
          boxRows,
          rowIndex,
          cellIndex,
          columnWidths[cellIndex]
        );
      } else {
        return boxedString(cell, columnWidths[cellIndex]);
      }
    });
  });
  decoratedBoxes.forEach((boxes, index) => {
    if (decoratedBoxes[index - 1]) {
      boxes.forEach((box, cellIndex) => {
        const upperCell = decoratedBoxes[index - 1][cellIndex];
        if (isBoxEmpty(upperCell) || isBoxEmpty(box)) {
          process.stdout.write("".padStart(columnWidths[cellIndex] + 7));
          return;
        }
        process.stdout.write(padCenter("|", columnWidths[cellIndex] + 4));
        process.stdout.write("   ");
      });
    }
    console.log("");
    printJoinedBoxes(boxes);
  });
}

if (require.main === module) {
  if (process.argv.length < 3) {
    printUsage();
  }

  const str = process.argv[2];

  if (str === "--stdin") {
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
}
