pragma solidity ^0.5.16;

contract MonsterCookie {
        string name;

        constructor(string memory initName) public {
        name = initName;
        }
        function getName() public view returns (string memory){
        return (name);
        }
        function setName(string memory newMessage) public {
        name = newMessage;
        }
}
