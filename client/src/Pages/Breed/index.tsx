import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import { useAtom } from 'jotai';
import { map } from 'lodash';
import styled from 'styled-components/macro';

import { factoryContractAtom, wSelectedAccountAtom } from '../../store';
import Title from '../../Components/Title';
import Box from '../../Components/Box';
import Button from '../../Components/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem 0;
`;

const Boxes = styled.div`
  display: flex;
  flex-direction: row;
`;

const Select = styled.select`
  font-family: 'PaytoneOne';
  height: 3rem;
  padding: 0.6rem;
  border-radius: 1rem;
`;

const BoxSelection = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 1rem;
`;

export default function () {
  const [factoryContract] = useAtom(factoryContractAtom);
  const [wSelectedAccount] = useAtom(wSelectedAccountAtom);
  const [ownedBoxes, setOwnedBoxes] = useState<number[]>([]);

  const [p1, setP1] = useState<number>(0);
  const [p2, setP2] = useState<number>(0);

  useEffect(() => {
    if (factoryContract) {
      factoryContract.ownedBoxes(wSelectedAccount).then((boxes: number[]) => {
        setOwnedBoxes(map(boxes, (b) => Number(b)).filter((b) => b != 0));
      });
    }
  }, [factoryContract, wSelectedAccount]);

  useEffect(() => {
    if (ownedBoxes.length > 1) {
      setP1(ownedBoxes[0]);
      setP2(ownedBoxes[1]);
    }
  }, [ownedBoxes]);

  if (!factoryContract) {
    return (
      <Container>
        <p>Loading contract.</p>
      </Container>
    );
  }

  const breed = () => {
    async function b() {
      await factoryContract?.breed(p1, p2, { value: utils.parseEther('0.3') });
    }
    b();
  };

  if (ownedBoxes.length < 1) {
    return (
      <Container>
        <Title text="⛏️ Breed"></Title>
        <p>You need at least 2 boxes minted on your account, consider buying boxes.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title text="⛏️ Breed"></Title>
      <p>Your boxes.</p>

      <Boxes>
        <BoxSelection>
          <Select onChange={(e) => setP1(Number(e.target.value))} defaultValue={p1}>
            {ownedBoxes
              .filter((b) => b != p2)
              .map((b) => (
                <option value={b} key={b}>
                  {b}
                </option>
              ))}
          </Select>

          <Box id={p1} FactoryContract={factoryContract} hideBuyButton />
        </BoxSelection>

        <BoxSelection>
          <Select onChange={(e) => setP2(Number(e.target.value))} defaultValue={p2}>
            {ownedBoxes
              .filter((b) => b != p1)
              .map((b) => (
                <option value={b} key={b}>
                  {b}
                </option>
              ))}
          </Select>
          <Box id={p2} FactoryContract={factoryContract} hideBuyButton />
        </BoxSelection>
      </Boxes>

      <Button onClick={breed}>Breed for 0.3 ETH</Button>
    </Container>
  );
}
