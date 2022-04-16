import styled from 'styled-components/macro';
import { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { Contract } from 'ethers';
import moment from 'moment';

import BoxA from '../../Constants/ABI/Box.json';
import { wProviderAtom } from '../../store';
import { Canvas, useFrame } from '@react-three/fiber';
import { map } from 'lodash';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem 0;
  margin: 0.2rem;
  width: 18rem;
  background-color: #ffffff;
  color: ${(props) => props.theme.bgdark};
  border-radius: 0.4rem;
`;

type BoxProps = {
  FactoryContract: Contract;
  id: number;
};

type ThreeDBoxProps = {
  color: number[];
  size: number[];
};

const ThreeDBox = ({ color, size }: ThreeDBoxProps) => {
  const ref = useRef();

  useFrame((state, delta) => {
    //@ts-expect-error: xx
    ref.current.rotation.x += 0.005;
    //@ts-expect-error: xx
    ref.current.rotation.y += 0.005;
    //@ts-expect-error: xx
    ref.current.rotation.z += 0.005;
  });

  return (
    <mesh ref={ref} scale={0.4}>
      <boxGeometry args={map(size, (dim: number) => dim / 100)} />
      <meshStandardMaterial color={`rgb(${color[0]}, ${color[1]}, ${color[2]})`} />
    </mesh>
  );
};

const ThreeDContainer = styled.div`
  padding: 0.6rem;
`;

const BoxContainer = styled.div`
  border: 0.1rem solid ${(props) => props.theme.bgdark};
  width: 16rem;
  height: 16rem;
  margin: auto;
`;

const BoxNumber = styled.p`
  font-family: 'PaytoneOne';
  font-size: 1.4rem;
  margin: 0.3rem;
`;

const Volume = styled.p`
  margin: 0.8rem 0.3rem;
  font-family: 'RobotoBold';
  font-size: 0.9rem;
`;

const Row = styled.p`
  display: flex;
  justify-content: space-between;
  margin: 0.3rem;
  font-size: 0.9rem;
  color: ${(props) => props.theme.bglight};
`;

const Address = styled.a`
  display: flex;
  justify-content: space-between;
  margin: 0.3rem;
  font-size: 0.9rem;
  color: ${(props) => props.theme.bglight};
`;

export default function ({ FactoryContract, id }: BoxProps) {
  const [wProvider] = useAtom(wProviderAtom);
  const [box, setBox] = useState<string>('');
  const [boxContract, setBoxContract] = useState<Contract | null>(null);

  const [color, setColor] = useState([0, 0, 0]);
  const [size, setSize] = useState([0, 0, 0]);
  const [owner, setOwner] = useState<string>('');
  const [breedCount, setBreedCount] = useState(0);

  useEffect(() => {
    async function getBox() {
      setBox(await FactoryContract.get(id));
    }
    getBox();
  }, [FactoryContract, id]);

  useEffect(() => {
    if (wProvider && box) {
      setBoxContract(new Contract(box, BoxA.abi, wProvider.getSigner()));
    }
  }, [box, wProvider]);

  useEffect(() => {
    async function getBreedCount() {
      const count = await FactoryContract.getBreedCount(id);
      setBreedCount(count);
    }

    if (FactoryContract && id) {
      getBreedCount();
    }
  }, [FactoryContract, id]);

  useEffect(() => {
    async function getColor() {
      const [r, g, b] = await boxContract?.color();
      setColor([r, g, b]);
    }
    async function getSize() {
      const [x, y, z] = await boxContract?.size();
      setSize([x, y, z]);
    }
    async function getOwner() {
      const o = await boxContract?.owner();
      setOwner(o);
    }

    if (boxContract) {
      getColor();
      getSize();
      getOwner();
    }

    console.log(boxContract);
  }, [boxContract]);

  return (
    <Container>
      {owner ? (
        <ThreeDContainer>
          <BoxNumber>#{id}</BoxNumber>

          <BoxContainer>
            <Canvas style={{ backgroundColor: 'white' }}>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <ThreeDBox color={color} size={size} />
            </Canvas>
          </BoxContainer>

          <Volume>
            volume:&nbsp;
            {Math.round((size[0] * size[1] * size[2]) / 1000000)}
            &nbsp;xyz
          </Volume>

          <Row>
            <span>breed count</span>
            <span>{breedCount}/3</span>
          </Row>

          <Address href={`https://explorer.plutotest.network/address/${box}`} target="_blank">
            <span>address</span>
            <span>{box.substring(0, 14)}...</span>
          </Address>

          <Address href={`https://explorer.plutotest.network/address/${owner}`} target="_blank">
            <span>owner</span>
            <span>{owner.substring(0, 14)}...</span>
          </Address>
        </ThreeDContainer>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
}
