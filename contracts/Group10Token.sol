// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Group10Token is ERC20 {
    address public owner;
    uint256 public startTime;
    uint256 public constant DURATION = 30 days;

    uint256 public constant MAX_SUPPLY = 1000000 * 10**18;
    uint256 public constant SALE_CAP = MAX_SUPPLY / 2;

    uint256 public tokensSold = 0;

    constructor() ERC20("Group10Token", "G10") {
        owner = msg.sender;
        startTime = block.timestamp;
        _mint(address(this), MAX_SUPPLY);
    }

    function buyToken() external payable {
        require(block.timestamp <= startTime + DURATION, "Sale ended");
        require(tokensSold < SALE_CAP, "Sale cap reached");
        require(msg.value > 0, "Send ETH to buy tokens");

        uint256 tokenPrice;
        uint256 threshold = SALE_CAP / 2;

        if (tokensSold < threshold) {
            tokenPrice = 5 ether;
        } else {
            tokenPrice = 10 ether;
        }

        uint256 tokensToBuy = (msg.value * 10**18) / tokenPrice;
        require(tokensSold + tokensToBuy <= SALE_CAP, "Exceeds sale cap");

        tokensSold += tokensToBuy;
        _transfer(address(this), msg.sender, tokensToBuy);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
