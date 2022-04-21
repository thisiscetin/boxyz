import styled from 'styled-components/macro';
import { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { Contract, utils } from 'ethers';
import { Canvas, useFrame } from '@react-three/fiber';
import { map } from 'lodash';
import { Link } from 'react-router-dom';
import { providerAtom, selectedAccountAtom, transactionInProgressAtom } from '../../store';

import Spinner from '../Spinner';
import Button from '../Button';

import BoxA from '../../Constants/ABI/Box.json';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem 0;
  margin: 0.2rem;
  width: 18rem;
  background-color: ${(props) => props.theme.white};
  color: ${(props) => props.theme.bgdark};
  border-radius: 0.4rem;

  a {
    color: ${(props) => props.theme.bgdark};

    :hover {
      color: ${(props) => props.theme.bgdark};
    }
  }
`;

type BoxProps = {
  FactoryContract: Contract;
  id: number;
  hideBuyButton?: boolean;
};

type ThreeDBoxProps = {
  color: number[];
  size: number[];
};

const ThreeDBox = ({ color, size }: ThreeDBoxProps) => {
  const ref = useRef();

  useFrame(() => {
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
  margin: 0rem;
  text-decoration: underline;
  transition: 0.2s;
  color: ${(props) => props.theme.bgdark};

  :hover {
    color: ${(props) => props.theme.bglight};
  }
`;

const Volume = styled.p`
  margin: 0.8rem 0.3rem;
  font-family: 'RobotoBold';
  font-size: 0.9rem;
`;

const Row = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0.3rem;
  font-size: 0.9rem;
`;

const Price = styled.span`
  font-family: 'PaytoneOne';
  font-size: 1.1rem;
  color: ${(props) => props.theme.red};
`;

export default function ({ FactoryContract, id, hideBuyButton }: BoxProps) {
  const [wProvider] = useAtom(providerAtom);
  const [box, setBox] = useState<string>('');
  const [boxContract, setBoxContract] = useState<Contract | null>(null);
  const [wSelectedAccount] = useAtom(selectedAccountAtom);

  const [color, setColor] = useState([0, 0, 0]);
  const [size, setSize] = useState([0, 0, 0]);
  const [owner, setOwner] = useState<string>('');
  const [breedCount, setBreedCount] = useState(0);
  const [listed, setListed] = useState(false);
  const [price, setPrice] = useState(0);

  const [hideBuy, setHideBuy] = useState(true);
  const [, setTransactionInProgress] = useAtom(transactionInProgressAtom);

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
    setHideBuy(hideBuyButton || wSelectedAccount.toLowerCase() === owner.toLowerCase() || !listed);
  }, [wSelectedAccount, listed, owner, hideBuyButton]);

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
    async function getListed() {
      const ls = await boxContract?.listed();
      setListed(ls);
    }
    async function getPrice() {
      const pr = await boxContract?.price();
      setPrice(Number(utils.formatEther(pr)));
    }

    if (boxContract) {
      getColor();
      getSize();
      getOwner();
      getListed();
      getPrice();
    }
  }, [boxContract]);

  const buy = () => {
    async function buyBox() {
      setTransactionInProgress(true);
      try {
        await boxContract?.buy({ value: utils.parseEther(price?.toString()) });
      } catch (err: any) {
        const code: number = err?.code;
        if (code === 4001) {
          alert(err.message);
        } else if (code === -32603) {
          alert(err.data.message);
        }
      }
      setTransactionInProgress(false);
    }
    buyBox();
  };

  return (
    <Container>
      {owner !== '' ? (
        <ThreeDContainer>
          <Link to={`/boxes/${id}`}>
            <Row>
              {listed ? <Price>{price} ETH</Price> : 'not listed'}
              <BoxNumber>#{id}</BoxNumber>
            </Row>

            <BoxContainer>
              <Canvas style={{ backgroundColor: 'white' }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <ThreeDBox color={color} size={size} />
              </Canvas>
            </BoxContainer>
          </Link>

          <Volume>
            volume:&nbsp;
            {Math.round((size[0] * size[1] * size[2]) / 1000000)}
            &nbsp;xyz
          </Volume>
          {id !== 0 ? (
            <>
              <Row>
                <span>breed count</span>
                {breedCount == 3 ? (
                  <span style={{ color: 'red' }}>{breedCount}/3</span>
                ) : (
                  <span>{breedCount}/3</span>
                )}
              </Row>

              <Row>
                <span>address</span>
                <span>{box.substring(0, 14)}...</span>
              </Row>

              <Row>
                <span>owner</span>
                <span>{owner.substring(0, 14)}...</span>
              </Row>

              {!hideBuy ? <Button onClick={buy}>buy</Button> : null}
            </>
          ) : (
            <Row>
              <span>Genesis box.</span>
            </Row>
          )}
        </ThreeDContainer>
      ) : (
        <Spinner />
      )}
    </Container>
  );
}
