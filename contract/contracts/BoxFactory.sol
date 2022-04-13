// SPDX-License-Identifier: CC-BY-4.0
pragma solidity 0.8.1;

import "./Box.sol";

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract BoxFactory is Ownable {
    Box[] private _boxes;
    mapping(uint256 => uint256) private _breedCounts;

    uint256 public breedCost = 0.3 ether;
    uint16 public breedCap = 3;

    uint256 private nonce = 0;

    event BoxCreated(Box indexed box, address indexed owner);

    function boxCount() public returns (uint256) {
        return _boxes.length;
    }

    function createBox(
        uint16 _x,
        uint16 _y,
        uint16 _z,
        uint16 _r,
        uint16 _g,
        uint16 _b
    ) public onlyOwner {
        Box box = new Box(boxCount(), address(0), address(0), _x, _y, _z, _r, _g, _b);
        box.transferOwnership(msg.sender);
        _boxes.push(box);

        emit BoxCreated(box, owner());
    }

    function getBox(uint256 _index) public returns (Box) {
        return _boxes[_index];
    }

    function getBreedCount(uint256 _index) public returns (uint256) {
        return _breedCounts[_index];
    }

    function getBoxesOf(address owner) public returns (Box[] memory boxes_) {
        uint256 count = 0;
        for (uint256 i = 0; i < _boxes.length; i++) {
            if (_boxes[i].owner() == owner) {
                count++;
            }
        }

        boxes_ = new Box[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < _boxes.length; i++) {
            if (_boxes[i].owner() == owner) {
                boxes_[j] = _boxes[i];
                j++;
            }
        }
        return boxes_;
    }

    function setBreedCap(uint16 _cap) public onlyOwner {
        breedCap = _cap;
    }

    function breed(uint256 parent1Id, uint256 parent2Id) public payable {
        require(parent1Id < boxCount(), "p1 does not exist");
        require(parent2Id < boxCount(), "p2 does not exist");
        require(parent1Id != parent2Id, "p1 and p2 are same");
        require(msg.value == breedCost, "value below breeding cost");
        require(_boxes[parent1Id].owner() == msg.sender, "sender is not owner of p1");
        require(_boxes[parent2Id].owner() == msg.sender, "sender is not owner of p2");
        require(_breedCounts[parent1Id] < breedCap, "p1 has reached its breeding cap");
        require(_breedCounts[parent2Id] < breedCap, "p2 has reached its breeding cap");

        Box box1 = _boxes[parent1Id];
        Box box2 = _boxes[parent2Id];
        uint16 x;
        uint16 y;
        uint16 z;
        uint16 r;
        uint16 g;
        uint16 b;

        (x, y, z) = box1.avgDimension(box2);
        (r, g, b) = box1.avgColor(box2);

        Box box = new Box(
            boxCount(),
            address(box1),
            address(box2),
            roll() < 10 ? randomSize() : x,
            roll() < 10 ? randomSize() : y,
            roll() < 10 ? randomSize() : z,
            roll() < 10 ? randomColorF() : r,
            roll() < 10 ? randomColorF() : g,
            roll() < 10 ? randomColorF() : b
        );

        _boxes.push(box);
        _breedCounts[parent1Id]++;
        _breedCounts[parent2Id]++;

        emit BoxCreated(box, msg.sender);
    }

    function randomSize() internal returns (uint16) {
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))
        ) % 900;
        randomnumber = randomnumber + 100;
        nonce++;
        return uint16(randomnumber);
    }

    function randomColorF() internal returns (uint16) {
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))
        ) % 255;
        nonce++;
        return uint16(randomnumber);
    }

    function roll() internal returns (uint16) {
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))
        ) % 100;
        nonce++;
        return uint16(randomnumber);
    }
}
