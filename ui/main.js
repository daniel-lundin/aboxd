import { createChart } from "aboxd";

const input = document.getElementById("input");
const output = document.getElementById("output");

output.innerText = createChart(input.value || "");

input.addEventListener("keyup", evt => {
  output.innerText = createChart(input.value || "");
});

window.chart = chart;
