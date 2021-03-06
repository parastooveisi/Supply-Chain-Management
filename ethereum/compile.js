//we have to read the content of the file instead of require the .sol file

const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build"); //reference to build folder

fs.removeSync(buildPath);

const trackerPath = path.resolve(__dirname, "contracts", "AssetTracker.sol"); //path

const source = fs.readFileSync(trackerPath, "utf8"); //read

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath); //check for folder existence. if it does not exist, it will create it.

fs.outputJsonSync(
  //write to a json file
  path.resolve(buildPath, "AssetTracker.json"), //(path to file, name of the file)
  output[":AssetTracker"]
);

// solc.compile(source, 1) --> solc.compile(source code, number of different contracts we are attempting to compile)
