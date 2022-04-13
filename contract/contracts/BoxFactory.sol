// SPDX-License-Identifier: CC-BY-4.0
pragma solidity 0.8.1;

import "./Box.sol";

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract BoxFactory is Ownable {
    Box[] private _boxes;
    mapping(uint256 => uint8) private _breedCounts;

    uint256 private nonce = 0;

    function counter() public view returns (uint256) {
        return _boxes.length;
    }

    function get(uint256 _index) public view returns (Box) {
        require(_index < _boxes.length, "index out of bounds");
        return _boxes[_index];
    }

    function getBreedCount(uint256 _index) public view returns (uint8) {
        return _breedCounts[_index];
    }

    function create() public onlyOwner {
        uint256 _index = _boxes.length;
        Box box = new Box(_index, randomColor(), randomSize(), Box.Parents(address(0), address(0)));
        box.transferOwnership(msg.sender);

        _boxes.push(box);
        _breedCounts[_index] = 0;
    }

    function ownedBoxes(address owner) public view returns (uint256[] memory) {
        uint256[] memory indexes = new uint256[](counter());
        uint256 i = 0;
        for (uint256 j = 0; j < counter(); j++) {
            Box box = get(j);
            if (box.owner() == owner) {
                indexes[i] = j;
                i++;
            }
        }
        return indexes;
    }

    function breed(uint256 p1, uint256 p2) public payable {
        require(p1 < _boxes.length, "p1 index out of bounds");
        require(p2 < _boxes.length, "p2 index out of bounds");
        require(p1 != p2, "cannot breed with self");
        require(_breedCounts[p1] < 3, "box1 has reached breed limit");
        require(_breedCounts[p2] < 3, "box2 has reached breed limit");
        require(msg.value == 0.3 ether, "invalid price");

        Box box1 = _boxes[p1];
        Box box2 = _boxes[p2];
        require(box1.owner() == box2.owner(), "boxes are not from same owner");

        uint256 _index = _boxes.length;
        Box box = new Box(
            _index,
            random(0, 100) < 10 ? randomColor() : box1.avgColor(box2),
            random(0, 100) < 10 ? randomSize() : box1.avgSize(box2),
            Box.Parents(address(box1), address(box2))
        );
        box.transferOwnership(msg.sender);

        _boxes.push(box);
        _breedCounts[_index] = 0;
        _breedCounts[p1]++;
        _breedCounts[p2]++;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;

        require(balance > 0, "no funds to withdraw");
        payable(msg.sender).transfer(balance);
    }

    function randomSize() internal returns (Box.Size memory) {
        return Box.Size(random(100, 900), random(100, 900), random(100, 900));
    }

    function randomColor() internal returns (Box.Color memory) {
        return Box.Color(random(0, 256), random(0, 256), random(0, 256));
    }

    function random(uint256 offset, uint256 modulo) internal returns (uint16) {
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))
        ) % modulo;

        randomnumber = randomnumber + offset;
        nonce++;
        return uint16(randomnumber);
    }
}
