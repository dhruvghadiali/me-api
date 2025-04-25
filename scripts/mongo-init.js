const { exec } = require("child_process");
const os = require("os");

const isWin = os.platform() === "win32";

// Adjust paths only if needed; assume mongod and mongosh are in PATH
const mongod = isWin ? "mongod.exe" : "mongod";
const mongosh = isWin ? "mongosh.exe" : "mongosh";

// Paths
const dbPath = isWin ? "C:\\data\\db" : "/data/db";
const replSetName = "rs0";

// Start mongod
const mongodCommand = `${mongod} --dbpath "${dbPath}" --replSet ${replSetName}`;
console.log("Starting mongod with replica set...");
const mongodProcess = exec(mongodCommand);

// Wait and then initialize
setTimeout(() => {
  const initCommand = `${mongosh} --eval "rs.initiate()"`;
  console.log("Initializing replica set...");
  exec(initCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Replica set initiation failed:", error.message);
      return;
    }
    console.log("Replica set initiated:\n", stdout);
  });
}, 5000);

// Update mongod.cfg files for replSet
