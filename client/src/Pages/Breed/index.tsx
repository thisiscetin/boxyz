import { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import BoxFactory from '../../Constants/ABI/BoxFactory.json';
import { useAtom } from 'jotai';
import styled from 'styled-components/macro';

import { wChainIDAtom, wProviderAtom } from '../../store';
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

export default function () {
  const [wProvider] = useAtom(wProviderAtom);
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (wProvider) {
      setContract(new Contract(cAddress, BoxFactory.abi, wProvider.getSigner()));
    }
  }, [wProvider]);

  if (!contract) {
    return (
      <Container>
        <p>Loading contract.</p>
      </Container>
    );
  }

  const create = async () => {
    try {
      const { hash } = await contract.create();
      console.log(hash);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Title text="⛏️ Breed"></Title>

      <Button onClick={create}>Create Box</Button>
    </Container>
  );
}
