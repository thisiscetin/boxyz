import styled from 'styled-components/macro';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { rangeRight, map } from 'lodash';
import { factoryContractAtom } from '../../store';

import Title from '../../Components/Title';
import Box from '../../Components/Box';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.2rem 0;
`;

export default function () {
  const [mintCount, setMintCount] = useState(0);
  const [factoryContract] = useAtom(factoryContractAtom);

  useEffect(() => {
    async function getMintCount() {
      const count = Number(await factoryContract?.counter());
      setMintCount(count);
    }

    if (factoryContract) {
      getMintCount();
    }
  }, [factoryContract]);

  return (
    <>
      <Title text={'📦 Boxes'} />

      <p>Last 15 boxes minted.</p>

      <Container>
        <br />
        {factoryContract
          ? map(rangeRight(mintCount).slice(0, 15), (id: number) => (
              <Box FactoryContract={factoryContract} id={id} key={id} />
            ))
          : null}
      </Container>
    </>
  );
}
