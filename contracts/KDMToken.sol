// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KDMToken is ERC20 {
    address public owner;
    uint256 public startTime;
    uint256 public lastInterestUpdate;
    uint256 public constant MAX_SUPPLY = 100000 * 10**18; 
    uint256 public SOLD = 0;
    uint256 public price = 5 ether;
    
    struct PendingSell {
        uint256 amount;
        uint256 tokens;
        uint256 timestamp;
    }
    
    mapping(address => PendingSell) public pendingSells;
    address[] public pendingSellAddresses;
    uint256 public totalPendingAmount;

    constructor(address _owner) ERC20("KDMTOKEN", "KDM") {
        require(_owner != address(0), "Owner address cannot be zero");
        owner = _owner;
        startTime = block.timestamp;
        lastInterestUpdate = block.timestamp / 1 days;
        _mint(address(this), MAX_SUPPLY);
    }

    function buyToken() external payable {
        updateTokenPrice();
        uint256 tokensToBuy = (msg.value * 10**18)/price;
        require(SOLD + tokensToBuy <= MAX_SUPPLY, "Not enough tokens available");
        _transfer(address(this), msg.sender, tokensToBuy);
        SOLD += tokensToBuy;
        payable(owner).transfer(msg.value); 
    }

    function updateTokenPrice() public {
        uint256 nowDay = block.timestamp / 1 days;
        uint256 last = lastInterestUpdate;

        if (nowDay <= last) return; 

        uint256 daysPassed = nowDay - last;
        uint256 ethBalance = address(this).balance;
        uint256 rate = ethBalance / (2 * 1e9);

        price += rate * daysPassed;
        lastInterestUpdate = nowDay;
    }

    function sellToken(uint256 amountTokens) external {
        require(amountTokens > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amountTokens, "Insufficient token balance");
        
        updateTokenPrice();
       
        uint256 ethToReturn = (amountTokens * price) / 10**18;
        
        _transfer(msg.sender, address(this), amountTokens);
        
        SOLD -= amountTokens;
        
        if (address(this).balance >= ethToReturn) {
            payable(msg.sender).transfer(ethToReturn);
            emit TokensSold(msg.sender, amountTokens, ethToReturn, false);
        } else {
            // Otherwise, create a pending payment
            if (pendingSells[msg.sender].amount == 0) {
                pendingSellAddresses.push(msg.sender);
            }
            
            pendingSells[msg.sender].amount += ethToReturn;
            pendingSells[msg.sender].tokens += amountTokens;
            pendingSells[msg.sender].timestamp = block.timestamp;
            
            totalPendingAmount += ethToReturn;
            emit TokensSold(msg.sender, amountTokens, ethToReturn, true);
        }
    }
    
    event TokensSold(address indexed seller, uint256 tokens, uint256 ethAmount, bool isPending);
    event PendingPaymentSettled(address indexed seller, uint256 amount);
    
    function getPendingSellAddresses() external view returns (address[] memory) {
        return pendingSellAddresses;
    }
    
    function payPendingSell(address seller) external payable {
        require(msg.sender == owner, "Only owner can pay pending sells");
        require(pendingSells[seller].amount > 0, "No pending payment for this address");
        require(msg.value >= pendingSells[seller].amount, "Insufficient ETH sent");
        
        uint256 amount = pendingSells[seller].amount;
        
        payable(seller).transfer(amount);
        
        if (msg.value > amount) {
            payable(owner).transfer(msg.value - amount);
        }
        
        totalPendingAmount -= amount;
        
        delete pendingSells[seller];
        
        for (uint i = 0; i < pendingSellAddresses.length; i++) {
            if (pendingSellAddresses[i] == seller) {
                pendingSellAddresses[i] = pendingSellAddresses[pendingSellAddresses.length - 1];
                pendingSellAddresses.pop();
                break;
            }
        }
        
        emit PendingPaymentSettled(seller, amount);
    }
    
    function payMultiplePendingSells(address[] calldata sellers) external payable {
        require(msg.sender == owner, "Only owner can pay pending sells");
        
        uint256 totalNeeded = 0;
        for (uint i = 0; i < sellers.length; i++) {
            totalNeeded += pendingSells[sellers[i]].amount;
        }
        
        require(msg.value >= totalNeeded, "Insufficient ETH sent");
        
        uint256 totalPaid = 0;
        for (uint i = 0; i < sellers.length; i++) {
            address seller = sellers[i];
            uint256 amount = pendingSells[seller].amount;
            
            if (amount > 0) {
                payable(seller).transfer(amount);
                totalPaid += amount;
                
                totalPendingAmount -= amount;
                
                delete pendingSells[seller];
                
                for (uint j = 0; j < pendingSellAddresses.length; j++) {
                    if (pendingSellAddresses[j] == seller) {
                        pendingSellAddresses[j] = pendingSellAddresses[pendingSellAddresses.length - 1];
                        pendingSellAddresses.pop();
                        break;
                    }
                }
                
                emit PendingPaymentSettled(seller, amount);
            }
        }
        
        if (msg.value > totalPaid) {
            payable(owner).transfer(msg.value - totalPaid);
        }
    }
    
    receive() external payable {}
    
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}