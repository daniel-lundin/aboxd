const spawn = require("child_process").spawn;

async function runAboxdWithArg(str) {
  return new Promise(resolve => {
    const process = spawn("./bin.js", [str]);

    let output = "";
    process.stdout.on("data", data => {
      output += data.toString();
    });

    process.on("close", () => {
      resolve(output);
    });
  });
}

async function runAboxdWithStdin(str) {
  return new Promise(resolve => {
    const process = spawn("./bin.js");

    let output = "";
    process.stdout.on("data", data => {
      output += data.toString();
    });

    process.on("close", () => {
      resolve(output);
    });

    process.stdin.write(str);
    process.stdin.end();
  });
}

[["arg", runAboxdWithArg], ["stdin", runAboxdWithStdin]].forEach(
  ([type, runner]) => {
    it(`should render single box from ${type}`, async () => {
      const output = await runner("box");
      expect(output).toMatchSnapshot();
    });

    it(`should render two boxes with lines between  from ${type}`, async () => {
      const output = await runner("box1,box2");
      expect(output).toMatchSnapshot();
    });

    it(`should render two lines of boxes from ${type}`, async () => {
      const output = await runner("box1,box2\nbox3,");
      expect(output).toMatchSnapshot();
    });

    it(`should render three lines of boxes from ${type}`, async () => {
      const output = await runner("box1,box2\nbox3,\nbox4,box5");
      expect(output).toMatchSnapshot();
    });

    it(`should fill in empty slots if a dot is present from ${type}`, async () => {
      const output = await runner("box1,box2\nbox3,.\nbox4,box5");
      expect(output).toMatchSnapshot();
    });

    it(`should tighten up for rows from ${type}`, async () => {
      const output = await runner("box1,box2\n,.\nbox4,box5");
      expect(output).toMatchSnapshot();
    });

    it(`pad lines with fewer cells from ${type}`, async () => {
      const output = await runner("box1,box2\nbox3");
      expect(output).toMatchSnapshot();
    });

    it(`should leave gaps in empty cells from ${type}`, async () => {
      const output = await runner("box1,,box2\nbox3,box4,box5\n,bottom");
      expect(output).toMatchSnapshot();
    });
  }
);
