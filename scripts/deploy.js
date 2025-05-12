// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // 1. Get the factory for your contract
  const Factory = await hre.ethers.getContractFactory("Group10Token");

  // 2. Deploy it
  const contract = await Factory.deploy();

  // 3. Wait for the deployment to be mined
  //    (in ethers v6 this replaces contract.deployed())
  await contract.waitForDeployment();

  // 4. Print the address
  console.log("✅ Group10Token deployed to:", contract.target);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
