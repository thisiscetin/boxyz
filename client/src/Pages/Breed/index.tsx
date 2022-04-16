import { useEffect, useState } from 'react';
import { Contract, utils } from 'ethers';
import BoxFactory from '../../Constants/ABI/BoxFactory.json';
import { useAtom } from 'jotai';
import { map } from 'lodash';
import styled from 'styled-components/macro';

import { wProviderAtom, wSelectedAccountAtom } from '../../store';
import Title from '../../Components/Title';

const cAddress = '0x58c43BF186587DdAc17200A498F4c48E1C382E4e';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem 0;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primary};
  width: 10rem;
  padding: 0.6rem;
  margin: 0.6rem 0;
`;

const Input = styled.input`
  width: 10rem;
  padding: 0.4rem;
`;

export default function () {
  const [wProvider] = useAtom(wProviderAtom);
  const [contract, setContract] = useState<Contract | null>(null);
  const [wSelectedAccount] = useAtom(wSelectedAccountAtom);
  const [ownedBoxes, setOwnedBoxes] = useState<number[]>([]);

  const [p1, setP1] = useState<number>(0);
  const [p2, setP2] = useState<number>(0);

  useEffect(() => {
    if (wProvider) {
      setContract(new Contract(cAddress, BoxFactory.abi, wProvider.getSigner()));
    }
  }, [wProvider]);

  useEffect(() => {
    if (contract) {
      contract.ownedBoxes(wSelectedAccount).then((boxes: number[]) => {
        setOwnedBoxes(map(boxes, (b) => Number(b)).filter((b) => b != 0));
      });
    }
  }, [contract, wSelectedAccount]);

  if (!contract) {
    return (
      <Container>
        <p>Loading contract.</p>
      </Container>
    );
  }

  const breed = () => {
    async function b() {
      await contract?.breed(p1, p2, { value: utils.parseEther('0.3') });
    }
    console.log(contract);
    b();
  };

  return (
    <Container>
      <Title text="⛏️ Breed"></Title>

      <p>Breadable boxes of account {wSelectedAccount}</p>

      {ownedBoxes.map((boxId) => (
        <span key={boxId}>{boxId}</span>
      ))}

      <p>Parent 1</p>
      <Input type="number" value={p1} onChange={(e) => setP1(parseInt(e.target.value))} />

      <p>Parent 2</p>
      <Input type="number" value={p2} onChange={(e) => setP2(parseInt(e.target.value))} />

      <br />

      <Button onClick={breed}>Breed</Button>
    </Container>
  );
}
