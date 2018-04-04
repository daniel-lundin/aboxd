"use strict";

function repeatStr(chr, length, delimiter = "") {
  return Array.from({ length }, () => chr).join(delimiter);
}

function emptyStrings(length) {
  return Array.from({ length }, () => "");
}

function padCenter(str, length) {
  const leftOver = length - str.length;
  const startPad = Math.floor(leftOver / 2);
  const endPad = startPad + leftOver % 2;
  return str
    .padStart(str.length + startPad)
    .padEnd(str.length + endPad + startPad);
}

function boxedString(str, columnWidth, rowHeight) {
  const vertLength = columnWidth + 2;
  const vertLine = Array.from({ length: vertLength })
    .map(() => "-")
    .join("");
  if (str.length === 0 || str === ".") {
    const whitespace = " ".padEnd(vertLength + 2);
    return repeatStr(whitespace, rowHeight, "\n");
  }

  const paddedString = padCenter(str, columnWidth);
  return `+${vertLine}+\n| ${paddedString} |\n+${vertLine}+`;
}

function smallConnectedBox(boxRows, rowIndex, cellIndex, columnWidth) {
  const padValue = columnWidth + 4;
  if (boxRows[rowIndex - 1] && !isBoxEmpty(boxRows[rowIndex - 1][cellIndex])) {
    return padCenter("|", padValue);
  } else {
    return padCenter(" ", padValue);
  }
}

function connectedBox(boxRows, rowIndex, cellIndex, columnWidth, rowHeight) {
  if (rowHeight === 1) {
    return smallConnectedBox(boxRows, rowIndex, cellIndex, columnWidth);
  }

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
    result += `\n${repeatStr("-", Math.floor((padValue - 1) / 2))}`;
  } else {
    result += `\n${repeatStr(" ", Math.floor((padValue - 1) / 2))}`;
  }
  result += "+";
  // Right
  if (
    boxRows[rowIndex][cellIndex + 1] &&
    !isBoxEmpty(boxRows[rowIndex][cellIndex + 1])
  ) {
    result += `${repeatStr("-", Math.floor((padValue - 1) / 2) + leftOver)}`;
  } else {
    result += `${repeatStr(" ", Math.floor((padValue - 1) / 2) + leftOver)}`;
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

function printJoinedBoxes(boxes, rowHeight) {
  if (rowHeight === 1) {
    return process.stdout.write(boxes.join("   "));
  }
  const rows = boxes.reduce((acc, box, index) => {
    const lines = box.split("\n");
    if (index === 0) {
      return [lines[0], lines[1], lines[2]];
    }
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

function getColumnWidths(boxes) {
  return boxes
    .reduce((acc, curr) =>
      curr.map(
        (cell, index) => (cell.length > acc[index].length ? cell : acc[index])
      )
    )
    .map(s => s.length);
}

function getRowHeights(boxes) {
  return boxes.map(row => {
    const rowEmpty =
      row.filter(cell => cell.length !== 0 && cell !== ".").length === 0;
    return rowEmpty ? 1 : 3;
  });
}

function getMaxColumnCount(boxRows) {
  return boxRows.reduce((max, row) => Math.max(max, row.length), 0);
}

function normalizeInput(str) {
  const rows = str.split("\n").map(s => s.split(","));
  const maxColumnCount = getMaxColumnCount(rows);
  return rows.map(
    row =>
      row.length < maxColumnCount
        ? row.concat(emptyStrings(maxColumnCount - row.length))
        : row
  );
}
function createChart(str) {
  const boxRows = normalizeInput(str);
  const columnWidths = getColumnWidths(boxRows);
  const rowHeights = getRowHeights(boxRows);

  const decoratedBoxes = boxRows.map((row, rowIndex) => {
    return row.map((cell, cellIndex) => {
      if (cell === ".") {
        return connectedBox(
          boxRows,
          rowIndex,
          cellIndex,
          columnWidths[cellIndex],
          rowHeights[rowIndex]
        );
      } else {
        return boxedString(cell, columnWidths[cellIndex], rowHeights[rowIndex]);
      }
    });
  });

  decoratedBoxes.forEach((boxes, index) => {
    if (decoratedBoxes[index - 1] && rowHeights[index - 1] !== 1) {
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
    process.stdout.write("\n");
    printJoinedBoxes(boxes, rowHeights[index]);
  });
}

module.exports = { createChart };
