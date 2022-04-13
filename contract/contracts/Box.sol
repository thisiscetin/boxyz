// SPDX-License-Identifier: CC-BY-4.0
pragma solidity 0.8.1;

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 public id;

    Color public color;
    Size public size;
    Parents public parents;

    struct Color {
        uint16 r;
        uint16 g;
        uint16 b;
    }

    struct Size {
        uint16 x;
        uint16 y;
        uint16 z;
    }

    struct Parents {
        address p1;
        address p2;
    }

    constructor(
        uint256 _id,
        Color memory _color,
        Size memory _size,
        Parents memory _parents
    ) {
        id = _id;
        color = _color;
        size = _size;
        parents = _parents;
    }

    function avgColor(Box _other) public view returns (Color memory) {
        uint16 r;
        uint16 g;
        uint16 b;
        (r, g, b) = _other.color();

        return Color((color.r + r) / 2, (color.g + g) / 2, (color.b + b) / 2);
    }

    function avgSize(Box _other) public view returns (Size memory) {
        uint16 x;
        uint16 y;
        uint16 z;
        (x, y, z) = _other.size();

        return Size((size.x + x) / 2, (size.y + y) / 2, (size.z + z) / 2);
    }

    function birthdate() public view returns (uint256) {
        return block.timestamp;
    }
}
