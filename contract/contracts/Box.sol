// SPDX-License-Identifier: CC-BY-4.0
pragma solidity ^0.8.1;

contract Box {
    address public owner;
    address private parent1;
    address private parent2;

    uint16 private x;
    uint16 private y;
    uint16 private z;

    uint8 private r;
    uint8 private g;
    uint8 private b;

    constructor(
        address _parent1,
        address _parent2,
        address _owner,
        uint16 _x,
        uint16 _y,
        uint16 _z,
        uint8 _r,
        uint8 _g,
        uint8 _b
    ) {
        parent1 = _parent1;
        parent2 = _parent2;
        owner = _owner;
        x = _x;
        y = _y;
        z = _z;
        r = _r;
        g = _g;
        b = _b;
    }

    function parents()
        public
        view
        returns (address parent1_, address parent2_)
    {
        return (parent1, parent2);
    }

    function dimensions()
        public
        view
        returns (
            uint16 x_,
            uint16 y_,
            uint16 z_
        )
    {
        return (x, y, z);
    }

    function color()
        public
        view
        returns (
            uint8 r_,
            uint8 g_,
            uint8 b_
        )
    {
        return (r, g, b);
    }

    function birthdate() public view returns (uint256) {
        return block.timestamp;
    }
}
