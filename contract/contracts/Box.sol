// SPDX-License-Identifier: CC-BY-4.0
pragma solidity 0.8.1;

import "openzeppelin-solidity/contracts/access/Ownable.sol";


contract Box is Ownable {
    uint256 public id;
    address public parent1;
    address public parent2;

    uint16 public x;
    uint16 public y;
    uint16 public z;

    uint16 public r;
    uint16 public g;
    uint16 public b;

    constructor(
        uint256 _id,
        address _parent1,
        address _parent2,
        uint16 _x,
        uint16 _y,
        uint16 _z,
        uint16 _r,
        uint16 _g,
        uint16 _b
    ) public {
        id = _id;
        parent1 = _parent1;
        parent2 = _parent2;
        x = _x;
        y = _y;
        z = _z;
        r = _r;
        g = _g;
        b = _b;
    }

    function parents() public view returns (address parent1_, address parent2_) {
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
            uint16 r_,
            uint16 g_,
            uint16 b_
        )
    {
        return (r, g, b);
    }

    function birthdate() public view returns (uint256) {
        return block.timestamp;
    }

    function avgDimension(Box _second)
        public
        view
        returns (
            uint16 x_,
            uint16 y_,
            uint16 z_
        )
    {
        x_ = (x + _second.x()) / 2;
        y_ = (y + _second.y()) / 2;
        z_ = (z + _second.z()) / 2;

        return (x_, y_, z_);
    }

    function avgColor(Box _second)
        public
        view
        returns (
            uint16 r_,
            uint16 g_,
            uint16 b_
        )
    {
        r_ = (r + _second.r()) / 2;
        g_ = (g + _second.g()) / 2;
        b_ = (b + _second.b()) / 2;

        return (r_, g_, b_);
    }
}
