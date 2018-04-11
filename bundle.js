(function () {
  'use strict';

  const VERTICAL = "│";
  const HORIZONTAL = "─";
  const TOP_LEFT = "┌";
  const TOP_RIGHT = "┐";
  const BOTTOM_LEFT = "└";
  const BOTTOM_RIGHT = "┘";

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
    const vertLine = repeatStr(HORIZONTAL, vertLength);
    if (str.length === 0 || str === ".") {
      const whitespace = " ".padEnd(vertLength + 2);
      return repeatStr(whitespace, rowHeight, "\n");
    }

    const paddedString = padCenter(str, columnWidth);
    return `${TOP_LEFT}${vertLine}${TOP_RIGHT}\n${VERTICAL} ${paddedString} ${VERTICAL}\n${BOTTOM_LEFT}${vertLine}${BOTTOM_RIGHT}`;
  }

  function smallConnectedBox(boxRows, rowIndex, cellIndex, columnWidth) {
    const padValue = columnWidth + 4;
    if (boxRows[rowIndex - 1] && !isBoxEmpty(boxRows[rowIndex - 1][cellIndex])) {
      return padCenter(VERTICAL, padValue);
    } else {
      return padCenter(" ", padValue);
    }
  }

  function jointPoint(hasTop, hasBottom, hasLeft, hasRight) {
    if (hasTop && hasBottom && hasLeft && hasRight) {
      return "┼";
    }
    if (hasTop && hasBottom && hasLeft) {
      return "┤";
    }
    if (hasTop && hasBottom && hasRight) {
      return "├";
    }
    if (hasBottom && hasRight && hasLeft) {
      return "┬";
    }
    if (hasTop && hasRight && hasLeft) {
      return "┴";
    }
    if (hasRight && hasBottom) {
      return TOP_LEFT;
    }
    if (hasLeft && hasBottom) {
      return TOP_RIGHT;
    }
    if (hasTop && hasRight) {
      return BOTTOM_LEFT;
    }
    if (hasLeft && hasTop) {
      return BOTTOM_RIGHT;
    }
    if (hasLeft && hasRight) {
      return HORIZONTAL;
    }
    if (hasTop && hasBottom) {
      return VERTICAL;
    }

    return "x";
  }

  function connectedBox(boxRows, rowIndex, cellIndex, columnWidth, rowHeight) {
    if (rowHeight === 1) {
      return smallConnectedBox(boxRows, rowIndex, cellIndex, columnWidth);
    }

    const padValue = columnWidth + 4;
    const leftOver = (padValue - 1) % 2;
    let result = "";

    const hasTop =
      boxRows[rowIndex - 1] && !isBoxEmpty(boxRows[rowIndex - 1][cellIndex]);
    const hasLeft =
      boxRows[rowIndex][cellIndex - 1] &&
      !isBoxEmpty(boxRows[rowIndex][cellIndex - 1]);
    const hasRight =
      boxRows[rowIndex][cellIndex + 1] &&
      !isBoxEmpty(boxRows[rowIndex][cellIndex + 1]);
    const hasBottom =
      boxRows[rowIndex + 1] && !isBoxEmpty(boxRows[rowIndex + 1][cellIndex]);

    if (hasTop) {
      result += padCenter(VERTICAL, padValue);
    } else {
      result += padCenter(" ", padValue);
    }

    if (hasLeft) {
      result += `\n${repeatStr(HORIZONTAL, Math.floor((padValue - 1) / 2))}`;
    } else {
      result += `\n${repeatStr(" ", Math.floor((padValue - 1) / 2))}`;
    }
    result += jointPoint(hasTop, hasBottom, hasLeft, hasRight);

    if (hasRight) {
      result += `${repeatStr(
      HORIZONTAL,
      Math.floor((padValue - 1) / 2) + leftOver
    )}`;
    } else {
      result += `${repeatStr(" ", Math.floor((padValue - 1) / 2) + leftOver)}`;
    }

    if (hasBottom) {
      result += `\n${padCenter(VERTICAL, padValue)}`;
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
        isBoxEmpty(box) || isBoxEmpty(boxes[index - 1])
          ? "   "
          : repeatStr(HORIZONTAL, 3);
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
          const isLast = cellIndex === boxes.length - 1;
          const upperCell = decoratedBoxes[index - 1][cellIndex];
          if (isBoxEmpty(upperCell) || isBoxEmpty(box)) {
            process.stdout.write(
              "".padStart(columnWidths[cellIndex] + (isLast ? 4 : 7))
            );
            return;
          }
          process.stdout.write(padCenter(VERTICAL, columnWidths[cellIndex] + 4));
          if (!isLast) {
            process.stdout.write("   ");
          }
        });
      }
      process.stdout.write("\n");
      printJoinedBoxes(boxes, rowHeights[index]);
    });
  }

  var aboxd = { createChart };
  var aboxd_1 = aboxd.createChart;

  function chart(str) {
    // Before anyone sees this:
    // I should probably contact the library author
    // to make it return a string instead of writing
    // to process.stdout and console.log
    const oldLog = console.log;
    let output = "";

    window.process = {
      stdout: {
        write(val) {
          output += val;
        }
      }
    };
    console.log = val => {
      output += val + "\n";
    };

    aboxd_1(str);
    console.log = oldLog;

    return output;
  }

  const input = document.getElementById("input");
  const output = document.getElementById("output");

  output.innerText = chart(input.value || "");

  input.addEventListener("keyup", evt => {
    output.innerText = chart(input.value || "");
  });

  window.chart = chart;

}());
