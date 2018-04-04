import { createChart } from "aboxd";

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

  createChart(str);
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
