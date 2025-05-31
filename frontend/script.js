// KDMToken Frontend - Fully Fixed JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        console.error("Ethers.js library not loaded!");
        alert("Failed to load the ethers.js library. Please check your internet connection and refresh the page.");
        return;
    }
    
    console.log("KDMToken frontend initialized");
    initApp();
});

function initApp() {
    // Hardcoded contract address - replace with your own
    const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    
    // Contract ABI
    const contractABI = [
        {
            "inputs": [{"internalType": "address", "name": "_owner", "type": "address"}],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {"internalType": "address", "name": "spender", "type": "address"},
                {"internalType": "uint256", "name": "allowance", "type": "uint256"},
                {"internalType": "uint256", "name": "needed", "type": "uint256"}
            ],
            "name": "ERC20InsufficientAllowance",
            "type": "error"
        },
        {
            "inputs": [
                {"internalType": "address", "name": "sender", "type": "address"},
                {"internalType": "uint256", "name": "balance", "type": "uint256"},
                {"internalType": "uint256", "name": "needed", "type": "uint256"}
            ],
            "name": "ERC20InsufficientBalance",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
                {"indexed": true, "internalType": "address", "name": "spender", "type": "address"},
                {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
                {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
                {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "DURATION",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "MAX_SUPPLY",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "SOLD",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "address", "name": "owner", "type": "address"},
                {"internalType": "address", "name": "spender", "type": "address"}
            ],
            "name": "allowance",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "address", "name": "spender", "type": "address"},
                {"internalType": "uint256", "name": "value", "type": "uint256"}
            ],
            "name": "approve",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "buyToken",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "lastInterestUpdate",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [{"internalType": "address", "name": "", "type": "address"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "price",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "amountTokens", "type": "uint256"}],
            "name": "sellToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "startTime",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "address", "name": "to", "type": "address"},
                {"internalType": "uint256", "name": "value", "type": "uint256"}
            ],
            "name": "transfer",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "updateTokenPrice",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    // Global variables
    let provider, signer, contract;
    let userAddress;
    let connectedNetwork;
    
    // Direct RPC connection to Hardhat node for special functions
    const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // Utility functions
    function formatEther(wei) {
        return ethers.utils.formatEther(wei);
    }

    function parseEther(eth) {
        return ethers.utils.parseEther(eth.toString());
    }

    function formatTokens(amount) {
        return (Number(amount) / 1e18).toFixed(4);
    }

    function shortenAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    // Initialize web3 connection
    async function initWeb3() {
        try {
            console.log("Initializing web3 connection...");
            
            // Check if MetaMask is installed
            if (!window.ethereum) {
                console.error("MetaMask not detected!");
                alert("Please install MetaMask to use this application");
                return false;
            }
            
            // Request account access
            console.log("Requesting account access...");
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            if (accounts.length === 0) {
                console.error("No accounts found");
                alert("No accounts found. Please unlock your MetaMask wallet and try again.");
                return false;
            }
            
            userAddress = accounts[0];
            console.log("Connected to account:", userAddress);
            
            // Set up provider and signer
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            
            // Update UI
            document.getElementById('wallet-address').textContent = shortenAddress(userAddress);
            document.getElementById('connect-wallet').textContent = 'Connected';
            
            // Get network information
            connectedNetwork = await provider.getNetwork();
            console.log("Connected to network:", connectedNetwork.name, "(" + connectedNetwork.chainId + ")");
            
            // Initialize contract with hardcoded address
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            document.getElementById('contract-address').textContent = contractAddress;
            
            // Load data
            await loadContractData();
            await loadUserData();
            
            // Set up event listeners
            setupEventListeners();
            
            // Listen for account and network changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());
            
            return true;
        } catch (error) {
            console.error('Error initializing web3:', error);
            alert('Error connecting to MetaMask: ' + error.message);
            document.getElementById('wallet-address').textContent = 'Connection failed';
            return false;
        }
    }

    function handleAccountsChanged(accounts) {
        console.log("Accounts changed:", accounts);
        
        if (accounts.length === 0) {
            // MetaMask is locked or user has no accounts
            document.getElementById('wallet-address').textContent = 'Not connected';
            document.getElementById('connect-wallet').textContent = 'Connect Wallet';
            userAddress = null;
        } else if (accounts[0] !== userAddress) {
            // User has switched accounts
            userAddress = accounts[0];
            document.getElementById('wallet-address').textContent = shortenAddress(userAddress);
            loadUserData();
        }
    }

    async function loadContractData() {
        try {
            console.log("Loading contract data...");
            
            // Get contract data
            const [price, maxSupply, sold] = await Promise.all([
                contract.price(),
                contract.MAX_SUPPLY(),
                contract.SOLD()
            ]);
            
            // Update UI
            document.getElementById('token-price').textContent = `${formatEther(price)} ETH`;
            document.getElementById('max-supply').textContent = `${formatTokens(maxSupply)} KDM`;
            document.getElementById('sold-tokens').textContent = `${formatTokens(sold)} KDM`;
            
            console.log("Contract data loaded successfully");
        } catch (error) {
            console.error('Error loading contract data:', error);
            document.getElementById('token-price').textContent = 'Error loading';
            document.getElementById('max-supply').textContent = 'Error loading';
            document.getElementById('sold-tokens').textContent = 'Error loading';
        }
    }

    async function loadUserData() {
        try {
            if (!userAddress) {
                console.log("No user address, skipping data load");
                return;
            }
            
            console.log("Loading user data for:", userAddress);
            
            // Get user balances
            const [ethBalance, tokenBalance] = await Promise.all([
                provider.getBalance(userAddress),
                contract.balanceOf(userAddress)
            ]);
            
            // Update UI
            document.getElementById('eth-balance').textContent = `${formatEther(ethBalance)} ETH`;
            document.getElementById('token-balance').textContent = `${formatTokens(tokenBalance)} KDM`;
            
            console.log("User data loaded successfully");
        } catch (error) {
            console.error('Error loading user data:', error);
            document.getElementById('eth-balance').textContent = 'Error loading';
            document.getElementById('token-balance').textContent = 'Error loading';
        }
    }

    function setupEventListeners() {
        console.log("Setting up event listeners...");
        
        // Buy tokens estimate
        document.getElementById('buy-eth-amount').addEventListener('input', async function(e) {
            try {
                const ethAmount = e.target.value || '0';
                if (isNaN(ethAmount) || ethAmount <= 0) {
                    document.getElementById('buy-token-estimate').textContent = '0';
                    return;
                }
                
                const price = await contract.price();
                const tokenEstimate = parseEther(ethAmount).mul(ethers.BigNumber.from(10).pow(18)).div(price);
                document.getElementById('buy-token-estimate').textContent = formatTokens(tokenEstimate);
            } catch (error) {
                console.error('Error calculating token estimate:', error);
                document.getElementById('buy-token-estimate').textContent = 'Error calculating';
            }
        });
        
        // Sell tokens estimate
        document.getElementById('sell-token-amount').addEventListener('input', async function(e) {
            try {
                const tokenAmount = e.target.value || '0';
                if (isNaN(tokenAmount) || tokenAmount <= 0) {
                    document.getElementById('sell-eth-estimate').textContent = '0';
                    return;
                }
                
                const price = await contract.price();
                const ethEstimate = parseEther(tokenAmount).mul(price).div(parseEther("1"));
                document.getElementById('sell-eth-estimate').textContent = `${formatEther(ethEstimate)} ETH`;
            } catch (error) {
                console.error('Error calculating ETH estimate:', error);
                document.getElementById('sell-eth-estimate').textContent = 'Error calculating';
            }
        });
        
        // Buy tokens button
        document.getElementById('buy-tokens').addEventListener('click', async function() {
            const buyStatus = document.getElementById('buy-status');
            buyStatus.textContent = 'Processing...';
            buyStatus.className = 'status';
            
            try {
                if (!userAddress) {
                    throw new Error('Please connect your wallet first');
                }
                
                const ethAmount = document.getElementById('buy-eth-amount').value;
                if (isNaN(ethAmount) || ethAmount <= 0) {
                    throw new Error('Please enter a valid ETH amount');
                }
                
                console.log("Buying tokens with", ethAmount, "ETH");
                const tx = await contract.buyToken({
                    value: parseEther(ethAmount)
                });
                buyStatus.textContent = 'Transaction sent! Waiting for confirmation...';
                console.log("Buy transaction sent:", tx.hash);
                
                // Wait for transaction confirmation
                const receipt = await tx.wait();
                console.log("Buy transaction confirmed:", receipt);
                
                // Update UI
                buyStatus.textContent = 'Purchase successful!';
                buyStatus.className = 'status success';
                await loadContractData();
                await loadUserData();
                
                // Add to transaction list
                addTransaction('Buy', ethAmount + ' ETH', document.getElementById('buy-token-estimate').textContent + ' KDM', tx.hash);
                
                // Clear input
                document.getElementById('buy-eth-amount').value = '';
                document.getElementById('buy-token-estimate').textContent = '0';
            } catch (error) {
                console.error('Error buying tokens:', error);
                buyStatus.textContent = 'Error: ' + (error.message || 'Transaction failed');
                buyStatus.className = 'status error';
            }
        });
        
        // Sell tokens button
        document.getElementById('sell-tokens').addEventListener('click', async function() {
            const sellStatus = document.getElementById('sell-status');
            sellStatus.textContent = 'Processing...';
            sellStatus.className = 'status';
            
            try {
                if (!userAddress) {
                    throw new Error('Please connect your wallet first');
                }
                
                const tokenAmount = document.getElementById('sell-token-amount').value;
                if (isNaN(tokenAmount) || tokenAmount <= 0) {
                    throw new Error('Please enter a valid token amount');
                }
                
                console.log("Selling", tokenAmount, "KDM tokens");
                const tx = await contract.sellToken(
                    parseEther(tokenAmount)
                );
                sellStatus.textContent = 'Transaction sent! Waiting for confirmation...';
                console.log("Sell transaction sent:", tx.hash);
                
                // Wait for transaction confirmation
                const receipt = await tx.wait();
                console.log("Sell transaction confirmed:", receipt);
                
                // Update UI
                sellStatus.textContent = 'Sale successful!';
                sellStatus.className = 'status success';
                await loadContractData();
                await loadUserData();
                
                // Add to transaction list
                addTransaction('Sell', tokenAmount + ' KDM', document.getElementById('sell-eth-estimate').textContent + ' ETH', tx.hash);
                
                // Clear input
                document.getElementById('sell-token-amount').value = '';
                document.getElementById('sell-eth-estimate').textContent = '0';
            } catch (error) {
                console.error('Error selling tokens:', error);
                sellStatus.textContent = 'Error: ' + (error.message || 'Transaction failed');
                sellStatus.className = 'status error';
            }
        });

        // Add Demo Funds button - FIXED VERSION
        const demoButton = document.getElementById('add-demo-funds');
        if (demoButton) {
            demoButton.addEventListener('click', async function() {
                const demoStatus = document.getElementById('demo-status');
                demoStatus.textContent = 'Adding demo funds...';
                demoStatus.className = 'status';
                
                try {
                    if (!userAddress) {
                        throw new Error('Please connect your wallet first');
                    }
                    
                    // Check if we're on a local development network
                    const network = await provider.getNetwork();
                    const isLocalNetwork = network.chainId === 1337 || network.chainId === 31337;
                    
                    if (isLocalNetwork) {
                        console.log("Adding demo funds on local network...");
                        
                        // THE KEY FIX - Use correct format for hardhat_setBalance
                        const oneM = ethers.utils.parseEther("1000000"); // 1 million ETH
                        const hexBal = ethers.utils.hexStripZeros(oneM.toHexString());
                        
                        // Use direct RPC provider
                        await rpcProvider.send("hardhat_setBalance", [userAddress, hexBal]);
                        
                        // Mine a block to ensure the balance update takes effect
                        await rpcProvider.send("hardhat_mine", ["0x1"]);
                        
                        demoStatus.textContent = '1,000,000 ETH added to your wallet!';
                        demoStatus.className = 'status success';
                        
                        // Update balance display
                        await loadUserData();
                        
                        // Add transaction to list
                        addTransaction('Demo', '0 ETH', '1,000,000 ETH', 'demo-tx-' + Date.now());
                    } else {
                        // For non-local networks where we can't manipulate balances
                        console.log("Demo funds not available on network:", network.name);
                        demoStatus.textContent = 'Demo funds only work on local networks';
                        demoStatus.className = 'status error';
                    }
                } catch (error) {
                    console.error('Error adding demo funds:', error);
                    demoStatus.textContent = 'Error: ' + (error.message || 'Failed to add demo funds');
                    demoStatus.className = 'status error';
                }
            });
            
            // Add pulse animation
            demoButton.classList.add('pulse');
        }
    }

    function addTransaction(type, sent, received, hash) {
        const transactionsContainer = document.getElementById('transactions');
        
        // Remove "no transactions" message if present
        const noTransactionsMsg = transactionsContainer.querySelector('.no-transactions');
        if (noTransactionsMsg) {
            noTransactionsMsg.remove();
        }
        
        const txElement = document.createElement('div');
        txElement.className = 'transaction-item';
        
        const hashShort = hash.startsWith('demo') ? 'Demo Transaction' : shortenAddress(hash);
        
        // Get network and set appropriate explorer
        let explorerUrl = `https://etherscan.io/tx/${hash}`; // Default to Ethereum Mainnet
        
        // Check if we have network information
        if (connectedNetwork) {
            if (connectedNetwork.chainId === 11155111) {
                explorerUrl = `https://sepolia.etherscan.io/tx/${hash}`; // Sepolia Testnet
            } else if (connectedNetwork.chainId === 5) {
                explorerUrl = `https://goerli.etherscan.io/tx/${hash}`; // Goerli Testnet
            } else if (connectedNetwork.chainId === 1337 || connectedNetwork.chainId === 31337) {
                explorerUrl = '#'; // Local network - no explorer
            }
        }
        
        txElement.innerHTML = `
            <div>
                <strong>${type}</strong>
                <span>${new Date().toLocaleTimeString()}</span>
            </div>
            <div>
                ${sent} → ${received}
            </div>
            <div>
                ${!hash.startsWith('demo') && explorerUrl !== '#' 
                    ? `<a href="${explorerUrl}" target="_blank">${hashShort}</a>` 
                    : hashShort
                }
            </div>
        `;
        
        transactionsContainer.prepend(txElement);
    }

    // Initialize on page load
    const connectButton = document.getElementById('connect-wallet');
    if (connectButton) {
        connectButton.addEventListener('click', function() {
            console.log("Connect wallet button clicked");
            initWeb3();
        });
    }

    // Check if MetaMask is already connected (for persistence)
    if (window.ethereum && window.ethereum.isConnected()) {
        console.log("MetaMask is already connected, attempting auto-connect");
        window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
                if (accounts && accounts.length > 0) {
                    console.log("Found existing connected account, initializing");
                    initWeb3();
                }
            })
            .catch(err => {
                console.error("Error checking for connected accounts:", err);
            });
    }
    async function showPendingPayments() {
  if (!contract || !userAddress) return;
  
  try {
    // Check if user is owner
    const ownerAddress = await contract.owner();
    if (userAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
      // Hide owner-only sections if not owner
      document.getElementById('pendingPaymentsSection').style.display = 'none';
      return;
    }
    
    // Show owner-only sections
    document.getElementById('pendingPaymentsSection').style.display = 'block';
    
    // Get pending addresses
    const pendingAddresses = await contract.getPendingSellAddresses();
    const pendingPaymentsTable = document.getElementById('pendingPaymentsTable');
    
    // Clear existing table rows
    pendingPaymentsTable.innerHTML = `
      <tr>
        <th>User Address</th>
        <th>Tokens Sold</th>
        <th>ETH Owed</th>
        <th>Time</th>
        <th>Action</th>
      </tr>
    `;
    
    // Get total pending amount
    const totalPending = await contract.totalPendingAmount();
    document.getElementById('totalPendingAmount').textContent = ethers.utils.formatEther(totalPending);
    
    // Add each pending payment to the table
    for (const address of pendingAddresses) {
      const pendingSell = await contract.pendingSells(address);
      const row = document.createElement('tr');
      
      // Format date
      const date = new Date(pendingSell.timestamp * 1000);
      const formattedDate = date.toLocaleString();
      
      row.innerHTML = `
        <td>${address.slice(0,6)}...${address.slice(-4)}</td>
        <td>${ethers.utils.formatUnits(pendingSell.tokens, 18)}</td>
        <td>${ethers.utils.formatEther(pendingSell.amount)} ETH</td>
        <td>${formattedDate}</td>
        <td>
          <button onclick="payPendingSell('${address}')">Pay</button>
        </td>
      `;
      
      pendingPaymentsTable.appendChild(row);
    }
    
  } catch (error) {
    console.error("Error showing pending payments:", error);
  }
}

// Function to pay a single pending sell
async function payPendingSell(sellerAddress) {
  if (!contract || !userAddress) return;
  
  try {
    const ownerAddress = await contract.owner();
    if (userAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
      alert("Only the owner can pay pending sells");
      return;
    }
    
    const pendingSell = await contract.pendingSells(sellerAddress);
    const amount = pendingSell.amount;
    
    const tx = await contract.payPendingSell(sellerAddress, {
      value: amount
    });
    
    alert(`Sending ${ethers.utils.formatEther(amount)} ETH to ${sellerAddress}`);
    await tx.wait();
    alert("Payment sent successfully!");
    
    // Refresh the page
    await showPendingPayments();
    
  } catch (error) {
    console.error("Error paying pending sell:", error);
    alert("Error: " + error.message);
  }
}

// Function to pay all pending sells at once
async function payAllPendingSells() {
  if (!contract || !userAddress) return;
  
  try {
    const ownerAddress = await contract.owner();
    if (userAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
      alert("Only the owner can pay pending sells");
      return;
    }
    
    const pendingAddresses = await contract.getPendingSellAddresses();
    if (pendingAddresses.length === 0) {
      alert("No pending payments to process");
      return;
    }
    
    const totalPending = await contract.totalPendingAmount();
    
    const tx = await contract.payMultiplePendingSells(pendingAddresses, {
      value: totalPending
    });
    
    alert(`Sending ${ethers.utils.formatEther(totalPending)} ETH to pay all pending sells`);
    await tx.wait();
    alert("All payments sent successfully!");
    
    // Refresh the page
    await showPendingPayments();
    
  } catch (error) {
    console.error("Error paying all pending sells:", error);
    alert("Error: " + error.message);
  }
}

// Call this function when page loads
window.addEventListener('load', async () => {
  // Other initialization code...
  
  // If connected, check pending payments for owner
  if (contract) {
    await showPendingPayments();
  }
});
}