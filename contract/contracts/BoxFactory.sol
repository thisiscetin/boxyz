// SPDX-License-Identifier: CC-BY-4.0
pragma solidity 0.8.1;

import "./Box.sol";

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract BoxFactory is Ownable {
    Box[] private _boxes;
    mapping(uint256 => uint8) private _breedCounts;

    function counter() public returns (uint256) {
        return _boxes.length;
    }

    function get(uint256 _index) public returns (Box) {
        require(_index < _boxes.length, "index out of bounds");
        return _boxes[_index];
    }

    function getBreedCount(uint256 _index) public view returns (uint8) {
        return _breedCounts[_index];
    }
}
