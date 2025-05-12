// ← Replace with your deployed contract address:
const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

// ABI including buyToken, sellToken, transfer, tokensSold, balanceOf, withdraw
const contractABI = [
  { "inputs": [], "name": "buyToken",   "outputs": [], "stateMutability": "payable",   "type": "function" },
  { "inputs":[{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],
    "name":"sellToken","outputs":[],"stateMutability":"nonpayable","type":"function" },
  { "inputs":[{"internalType":"address","name":"recipient","type":"address"},
              {"internalType":"uint256","name":"amount","type":"uint256"}],
    "name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"nonpayable","type":"function" },
  { "inputs": [], "name": "tokensSold", "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function" },
  { "inputs":[{"internalType":"address","name":"account","type":"address"}],
    "name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function" },
  { "inputs": [], "name": "withdraw",    "outputs": [], "stateMutability": "nonpayable","type":"function" }
];

let provider, signer, contract;
// raw RPC provider for Hardhat-only methods
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

window.addEventListener("load", () => {
  if (!window.ethereum) {
    alert("⚠️ MetaMask not detected");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);

  document.getElementById("connect").onclick  = connectWallet;
  document.getElementById("buy").onclick      = buyTokens;
  document.getElementById("sell").onclick     = sellTokens;
  document.getElementById("transfer").onclick = transferTokens;
  document.getElementById("balance").onclick  = showBalance;
  document.getElementById("sold").onclick     = showSold;
  document.getElementById("withdraw").onclick = withdrawFunds;
  document.getElementById("faucet").onclick   = faucet;
});

async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
  signer   = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);
  const me = await signer.getAddress();
  alert("✅ Connected: " + me);
}

async function ensureConnected() {
  if (!contract) await connectWallet();
}

// — Buy tokens by ETH amount (2 decimals) —
async function buyTokens() {
  await ensureConnected();
  const raw = document.getElementById("buyAmount").value;
  const amt = parseFloat(raw).toFixed(2);
  if (isNaN(amt) || Number(amt) <= 0) {
    return alert("Enter a valid ETH amount");
  }

  try {
    const tx = await contract.buyToken({
      value: ethers.utils.parseEther(amt)
    });
    await tx.wait();
    alert(`🎉 Bought tokens with ${amt} ETH`);
  } catch (e) {
    console.error(e);
    alert("❌ Buy failed: " + (e.error?.message || e.message));
  }
}

// — Sell tokens back at current price —
async function sellTokens() {
  await ensureConnected();
  const raw = document.getElementById("sellAmount").value;
  if (isNaN(raw) || Number(raw) <= 0) {
    return alert("Enter a valid G10 amount");
  }
  const amt = ethers.utils.parseUnits(raw, 18);

  try {
    const tx = await contract.sellToken(amt);
    await tx.wait();
    alert(`💱 Sold ${raw} G10`);
  } catch (e) {
    console.error(e);
    alert("❌ Sell failed: " + (e.error?.message || e.message));
  }
}

// — Transfer tokens to another address —
async function transferTokens() {
  await ensureConnected();
  const to   = document.getElementById("transferAddr").value;
  const raw  = document.getElementById("transferAmt").value;
  if (!ethers.utils.isAddress(to)) {
    return alert("Enter a valid recipient address");
  }
  if (isNaN(raw) || Number(raw) <= 0) {
    return alert("Enter a valid G10 amount");
  }
  const amt = ethers.utils.parseUnits(raw, 18);

  try {
    const tx = await contract.transfer(to, amt);
    await tx.wait();
    alert(`🚚 Transferred ${raw} G10 to ${to}`);
  } catch (e) {
    console.error(e);
    alert("❌ Transfer failed: " + (e.error?.message || e.message));
  }
}

// — Display human‐readable token balance —
async function showBalance() {
  await ensureConnected();
  const addr   = await signer.getAddress();
  const balWei = await contract.balanceOf(addr);
  const bal    = ethers.utils.formatUnits(balWei, 18);
  alert(`📦 My token balance: ${bal} G10`);
}

// — Display human‐readable tokens sold —
async function showSold() {
  await ensureConnected();
  const soldWei = await contract.tokensSold();
  const sold    = ethers.utils.formatUnits(soldWei, 18);
  alert(`📊 Tokens sold: ${sold} G10`);
}

// — Owner withdraws all ETH —
async function withdrawFunds() {
  await ensureConnected();
  try {
    const tx = await contract.withdraw();
    await tx.wait();
    alert("🔐 Owner withdrew ETH");
  } catch (e) {
    console.error(e);
    alert("❌ Withdraw failed: " + (e.error?.message || e.message));
  }
}

// — Faucet: top up to 1,000,000 ETH on Hardhat local —
async function faucet() {
  await ensureConnected();
  const addr   = await signer.getAddress();
  const oneM   = ethers.utils.parseEther("1000000");
  const hexBal = ethers.utils.hexStripZeros(oneM.toHexString());
  try {
    await rpcProvider.send("hardhat_setBalance", [addr, hexBal]);
    await rpcProvider.send("hardhat_mine",       ["0x1"]);
    alert("💧 Faucet: balance set to 1,000,000 ETH. Please reconnect.");
  } catch (e) {
    console.error(e);
    alert("❌ Faucet failed: " + e.message);
  }
}
