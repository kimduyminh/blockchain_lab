// ← your deployed contract address:
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// Minimal ABI for the methods we call:
const contractABI = [
  { "inputs": [], "name": "buyToken",   "outputs": [], "stateMutability": "payable",   "type": "function" },
  { "inputs": [], "name": "tokensSold", "outputs":[{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"view","type":"function" },
  { "inputs": [], "name": "withdraw",   "outputs": [], "stateMutability": "nonpayable", "type":"function" },
  { "inputs":[{"internalType":"address","name":"account","type":"address"}], "name":"balanceOf", "outputs":[{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"view","type":"function" }
];

let provider, signer, contract;
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

window.addEventListener("load", () => {
  if (!window.ethereum) return alert("⚠️ MetaMask not detected");
  provider = new ethers.providers.Web3Provider(window.ethereum);

  document.getElementById("connect").onclick  = connectWallet;
  document.getElementById("buy").onclick      = buyToken;
  document.getElementById("balance").onclick  = getMyTokenBalance;
  document.getElementById("sold").onclick     = getTokensSold;
  document.getElementById("withdraw").onclick = withdrawFunds;
  document.getElementById("faucet").onclick   = faucet;
});

async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);
  const me = await signer.getAddress();
  alert("✅ Connected: " + me);
}

async function ensureConnected() {
  if (!contract) await connectWallet();
}

async function buyToken() {
  await ensureConnected();

  // 1) read the input, force two decimals
  const raw = document.getElementById("buyAmount").value;
  const amt = parseFloat(raw).toFixed(2);
  if (isNaN(amt) || Number(amt) <= 0) {
    return alert("Enter a valid ETH amount (e.g. 0.50, 1.00)");
  }

  try {
    const value = ethers.utils.parseEther(amt);
    const tx = await contract.buyToken({ value });
    await tx.wait();
    alert(`🎉 Bought tokens with ${amt} ETH`);
  } catch (err) {
    console.error(err);
    alert("❌ Buy failed: " + (err.error?.message || err.message));
  }
}

async function getMyTokenBalance() {
  await ensureConnected();
  try {
    const addr = await signer.getAddress();
    const bal = await contract.balanceOf(addr);
    alert("📦 My token balance: " + ethers.utils.formatUnits(bal, 18));
  } catch (err) {
    console.error(err);
    alert("❌ Read balance failed");
  }
}

async function getTokensSold() {
  await ensureConnected();
  try {
    const sold = await contract.tokensSold();
    alert("📊 Tokens sold: " + ethers.utils.formatUnits(sold, 18));
  } catch (err) {
    console.error(err);
    alert("❌ Read tokensSold failed");
  }
}

async function withdrawFunds() {
  await ensureConnected();
  try {
    const tx = await contract.withdraw();
    await tx.wait();
    alert("🔐 Owner withdrew funds");
  } catch (err) {
    console.error(err);
    alert("❌ Withdraw failed: " + (err.error?.message || err.message));
  }
}

// ───── Faucet ─────────────────────────────────────────────────────────────────
async function faucet() {
  await ensureConnected();
  const addr = await signer.getAddress();
  const oneMil = ethers.utils.parseEther("1000000");
  const hexBal = ethers.utils.hexStripZeros(oneMil.toHexString());

  try {
    await rpcProvider.send("hardhat_setBalance", [ addr, hexBal ]);
    await rpcProvider.send("hardhat_mine",       ["0x1"] );
    alert("💧 Your balance is now 1 000 000 ETH (Hardhat local). Please re-connect or refresh.");
  } catch (err) {
    console.error(err);
    alert("❌ Faucet failed: " + err.message);
  }
}
