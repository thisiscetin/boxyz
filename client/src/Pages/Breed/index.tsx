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

export default function () {
  const [wProvider] = useAtom(wProviderAtom);
  const [contract, setContract] = useState<Contract | null>(null);
  const [chainID] = useAtom(wChainIDAtom);

  useEffect(() => {
    if (wProvider) {
      setContract(new Contract(cAddress, BoxFactory.abi, wProvider));
    }
  }, [wProvider]);

  if (!contract) {
    return (
      <Container>
        <p>Loading contract.</p>
      </Container>
    );
  }

  if (chainID !== 0x8a) {
    return (
      <Container>
        <p>Please switch Metamask extension to Pluto Test Network. Current chain ID: {chainID}.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title text="⛏️ Breed"></Title>
      {chainID}
    </Container>
  );
}
