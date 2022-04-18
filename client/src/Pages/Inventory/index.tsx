import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { map } from 'lodash';

import { factoryContractAtom, wSelectedAccountAtom } from '../../store';
import Title from '../../Components/Title';
import Box from '../../Components/Box';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.2rem 0;
`;

export default function () {
  const [selectedAccount] = useAtom(wSelectedAccountAtom);
  const [factoryContract] = useAtom(factoryContractAtom);
  const [ownedBoxes, setOwnedBoxes] = useState<number[]>([]);

  useEffect(() => {
    async function getOwnedBoxes() {
      const bs = await factoryContract?.ownedBoxes(selectedAccount);
      setOwnedBoxes(map(bs, (b) => Number(b)).filter((b) => b != 0));
    }

    if (factoryContract) {
      getOwnedBoxes();
    }
  }, [factoryContract, selectedAccount]);

  return (
    <>
      <Title text="🔗 Inventory" />

      <p>Boxes you own.</p>

      <Container>
        <br />
        {factoryContract
          ? map(ownedBoxes, (id: number) => (
              <Box FactoryContract={factoryContract} hideBuyButton id={id} key={id} />
            ))
          : null}
      </Container>
    </>
  );
}
