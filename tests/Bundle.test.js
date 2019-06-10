const { execFile } = require('child_process');

describe("Bundle", () => {
  const twoCommands = `${__dirname}/context/twoCommands.js`;
  const fullCommands = `${__dirname}/context/fullCommands.js`;

  it("should display help by default", done => {
    execFile("node", [twoCommands], (error, stdout) => {
      expect(stdout).toMatchSnapshot();
      done();
    });
  });

  it("should display help", done => {
    execFile("node", [twoCommands, "--help"], (error, stdout) => {
      expect(stdout).toMatchSnapshot();
      done();
    });
  });

  it("should display command help", done => {
    execFile("node", [twoCommands, "command1", "--help"], (error, stdout) => {
      expect(stdout).toMatchSnapshot();
      done();
    });
  });

  it("should execute command", done => {
    execFile("node", [twoCommands, "command1"], (error, stdout) => {
      expect(stdout).toEqual("command1 output");
      done();
    });
  });

  it("should display descriptions", done => {
    execFile("node", [fullCommands, "command3", "--help"], (error, stdout) => {
      expect(stdout).toMatchSnapshot();
      done();
    });
  });
});
