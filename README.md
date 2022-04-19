# 📦 boxyz 

I know it sounds strange, but maybe these boxes can breed and have children. They can be sold as well.

## What is boxyz?

boxyz is a blockchain breeding and trading platform where you can own boxes in different colors and sizes, breed them, and mint new boxes. Boxes are cute, colorful NFTs.

## Where it is deployed?

It is deployed to [Pluto test network](https://plutotest.network/). It is deployable to any EVM compatible blockchain.

## What does it look like?

If you navigate to [boxyz](https://boxyz.com), you can see some boxes are minted and breeded already. You can get free test ETH from [Pluto test network](https://plutotest.network/), buy two boxes, breed and trade them.


## ![#69D2E7](https://via.placeholder.com/15/69D2E7/000000?text=+) boxyz properties

All properties of a box are stored on contract and rendering boxes do not need an additional dependency like an IPFS gateway. In addition to that,

- Every box has a distinct volume and color.
- Every box can breed up to three times and create (mint) new boxes.
- A box has a high chance of inheriting these traits from its parents and a small chance of mutating.

### ![#F38630](https://via.placeholder.com/15/F38630/000000?text=+) box volume

When two boxes are selected for breeding, the box produced will have a 90% chance to have an average volume of two parents. And the remaining 10% is the probability of mutation that could cause the box to be of any arbitrary volume.

Let, 
- Parent Box A has dimensions of: `[x:4, y:6, z:7]`, 168 volume
- Parent Box B has dimensions of: `[x:2, y:9, z:1]`, 18 volume

The child box C will have dimensions and volume of;
- 90% probability: `[x:(4+2)/2, y:(6+9)/2, z:(7+1)/2]`, 90 volume
- 10% probability: `[x:rand(1,10), y:rand(1,10), z:rand(1,10)]`, random volume

### ![#A7DBD8](https://via.placeholder.com/15/A7DBD8/000000?text=+) box color

When two boxes are selected for breeding, the box produced will have a 90% chance to have an average color of two parents. And the remaining 10% is the probability of mutation that could cause the box to be of any arbitrary color.

Let, 
- Parent Box A has color of: `rgb(50, 100, 200)`
- Parent Box B has color of: `rgb(20, 80, 120)`

The child box C will have color;
- 90% probability: `[R:(50+20)/2, G:(100+80)/2, B:(200+120)/2]`, RGB(35, 90, 160)
- 10% probability: `[R:rand(0,255), G:rand(0,255), B:rand(0,255)]`, random color
