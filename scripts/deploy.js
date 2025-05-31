// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // 1. Get the contract factory
  const Factory = await hre.ethers.getContractFactory("KDMToken");
  
  // 2. Hardcoded owner address - EDIT THIS TO YOUR DESIRED OWNER ADDRESS
  const specificOwnerAddress = "0xf84D2bE5f622aC8C0e306EC437E9642c510F570E";
  
  // 3. Deploy contract with the specified owner
  console.log(`Deploying KDMToken with owner: ${specificOwnerAddress}...`);
  const contract = await Factory.deploy(specificOwnerAddress);
  
  // 4. Wait for deployment to be mined
  await contract.waitForDeployment();
  
  // 5. Log the contract address and owner (correctly referencing the hardcoded address)
  console.log("✅ KDMToken deployed to:", contract.target);
  console.log("Owner set to:", specificOwnerAddress);
  
  // 6. Verify the owner is set correctly on-chain
  const contractOwner = await contract.owner();
  console.log("On-chain owner verification:", contractOwner);
  console.log("Owner address matches hardcoded value:", contractOwner === specificOwnerAddress);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});