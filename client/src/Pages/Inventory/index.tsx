import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Contract } from 'ethers';
import { map } from 'lodash';

import { wProviderAtom, wSelectedAccountAtom } from '../../store';
import BoxFactory from '../../Constants/ABI/BoxFactory.json';
import Title from '../../Components/Title';
import Box from '../../Components/Box';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.2rem 0;
`;

const cAddress = '0x58c43BF186587DdAc17200A498F4c48E1C382E4e';

export default function () {
  const [wProvider] = useAtom(wProviderAtom);

  const [selectedAccount] = useAtom(wSelectedAccountAtom);
  const [factoryContract, setFactoryContract] = useState<Contract | null>(null);
  const [ownedBoxes, setOwnedBoxes] = useState<number[]>([]);

  useEffect(() => {
    if (wProvider) {
      setFactoryContract(new Contract(cAddress, BoxFactory.abi, wProvider.getSigner()));
    }
  }, [wProvider]);

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

      <p>Boxes for account: {selectedAccount}</p>

      <Container>
        <br />
        {factoryContract
          ? map(ownedBoxes, (id: number) => (
              <Box FactoryContract={factoryContract} id={id} key={id} />
            ))
          : null}
      </Container>
    </>
  );
}
