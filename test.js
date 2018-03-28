const spawn = require("child_process").spawn;

async function runAboxd(str) {
  return new Promise((resolve, reject) => {
    try {
      const process = spawn("./index.js", [str]);

      let output = "";
      process.stdout.on("data", data => {
        output += data.toString();
      });

      process.on("close", () => {
        resolve(output);
      });
    } catch (err) {
      reject(err);
    }
  });
}

it("should render single box", async () => {
  const output = await runAboxd("box");
  expect(output).toMatchSnapshot();
});

it("should render two boxes with lines between ", async () => {
  const output = await runAboxd("box1,box2");
  expect(output).toMatchSnapshot();
});

it("should render two lines of boxes", async () => {
  const output = await runAboxd("box1,box2\nbox3,");
  expect(output).toMatchSnapshot();
});

it("should render three lines of boxes", async () => {
  const output = await runAboxd("box1,box2\nbox3,\nbox4,box5");
  expect(output).toMatchSnapshot();
});

it("should fill in empty slots if a dot is present", async () => {
  const output = await runAboxd("box1,box2\nbox3,.\nbox4,box5");
  expect(output).toMatchSnapshot();
});

it("should tighten up for rows", async () => {
  const output = await runAboxd("box1,box2\n,.\nbox4,box5");
  expect(output).toMatchSnapshot();
});

it("pad lines with fewer cells", async () => {
  const output = await runAboxd("box1,box2\nbox3");
  expect(output).toMatchSnapshot();
});

it("should leave gaps in empty cells", async () => {
  const output = await runAboxd("box1,,box2\nbox3,box4,box5\n,bottom");
  expect(output).toMatchSnapshot();
});
