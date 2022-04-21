import styled from 'styled-components/macro';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { blockNumberAtom, chainIDAtom, providerAtom } from '../../store';
import { BoxFactoryAddress } from '../../Constants/address';
import { utils } from 'ethers';

const Container = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const Section = styled.div`
  flex-basis: 100%;
  color: ${(props) => props.theme.secondary};

  a {
    text-decoration: underline;
  }
`;

export default function () {
  const [blockNumber] = useAtom(blockNumberAtom);
  const [chainId] = useAtom(chainIDAtom);
  const [provider] = useAtom(providerAtom);
  const [balance, setBalance] = useState('');

  useEffect(() => {
    async function getBalance() {
      const b = await provider?.getBalance(BoxFactoryAddress);
      setBalance(utils.formatEther(b || 0));
    }

    if (provider) {
      getBalance();
    }
  }, [provider]);

  if (chainId !== 0x8a) {
    return null;
  }

  return (
    <Container>
      <Section>
        <a href="https://plutotest.network" target="_blank">
          Pluto Test Network
        </a>
        &nbsp; block #{blockNumber} | &nbsp; total breed {balance} ETH
      </Section>
    </Container>
  );
}
