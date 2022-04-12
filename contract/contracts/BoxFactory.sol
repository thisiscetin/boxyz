// SPDX-License-Identifier: CC-BY-4.0
pragma solidity ^0.8.1;

import "./Box.sol";

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract BoxFactory is Ownable {
    Box[] private _boxes;
    mapping(uint256 => uint256) private _breedCounts;

    uint256 public breedCost = 0.3 ether;
    uint8 public breedCap = 5;

    event BoxCreated(Box indexed box, address indexed owner);

    function boxCount() public view returns (uint256) {
        return _boxes.length;
    }

    function createBox(
        uint16 _x,
        uint16 _y,
        uint16 _z,
        uint8 _r,
        uint8 _g,
        uint8 _b
    ) public onlyOwner {
        Box box = new Box(
            boxCount(),
            address(0),
            address(0),
            _x,
            _y,
            _z,
            _r,
            _g,
            _b
        );
        box.transferOwnership(msg.sender);
        _boxes.push(box);

        emit BoxCreated(box, owner());
    }

    function breed(uint256 parent1Id, uint256 parent2Id) public payable {
        require(parent1Id < boxCount(), "Parent 1 does not exist");
        require(parent2Id < boxCount(), "Parent 2 does not exist");
        require(parent1Id != parent2Id, "Parent 1 and 2 cannot be the same");
        require(
            msg.value == breedCost,
            "You must send exactly the breeding cost"
        );
        require(
            _boxes[parent1Id].owner() == msg.sender,
            "You are not the owner of parent 1"
        );
        require(
            _boxes[parent2Id].owner() == msg.sender,
            "You are not the owner of parent 2"
        );
        require(
            _breedCounts[parent1Id] < breedCap,
            "Parent 1 has reached its breeding cap"
        );
        require(
            _breedCounts[parent2Id] < breedCap,
            "Parent 2 has reached its breeding cap"
        );

        Box box1 = _boxes[parent1Id];
        Box box2 = _boxes[parent2Id];

        Box box = new Box(
            boxCount(),
            address(box1),
            address(box2),
            1,
            1,
            1,
            1,
            1,
            1
        );
        _boxes.push(box);

        emit BoxCreated(box, msg.sender);
    }
}
