// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;

    constructor () {
        manager = msg.sender;
    }

    function getPlayers() public view returns (address[] memory) {
        return (players);
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return (uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))));
    }

    modifier restricted() { //only the manager can call;
        require(msg.sender == manager);
        _;
    }

    function pickWinner() public restricted {
        payable(players[random() % players.length]).transfer(address(this).balance); //the index is random modulo players, and we transfer this balance of ether to the picked player's address
        players = new address[](0);
    }
}