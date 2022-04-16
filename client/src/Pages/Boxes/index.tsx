import styled from 'styled-components/macro';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Contract } from 'ethers';
import { rangeRight, map } from 'lodash';
import BoxFactory from '../../Constants/ABI/BoxFactory.json';

import Title from '../../Components/Title';
import Box from '../../Components/Box';
import { wProviderAtom } from '../../store';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.2rem 0;
`;

const cAddress = '0x58c43BF186587DdAc17200A498F4c48E1C382E4e';

export default function () {
  const [wProvider] = useAtom(wProviderAtom);
  const [contract, setContract] = useState<Contract | null>(null);
  const [breedCount, setBreedCount] = useState(0);

  useEffect(() => {
    if (wProvider) {
      setContract(new Contract(cAddress, BoxFactory.abi, wProvider.getSigner()));
    }
  }, [wProvider]);

  useEffect(() => {
    async function getBreedCount() {
      const count = Number(await contract?.counter());
      setBreedCount(count);
    }

    if (contract) {
      getBreedCount();
    }
  }, [contract]);

  return (
    <>
      <Title text={'📦 Boxes'} />

      <Container>
        <br />
        {contract
          ? map(rangeRight(breedCount), (id: number) => (
              <Box FactoryContract={contract} id={id} key={id} />
            ))
          : null}
      </Container>
    </>
  );
}