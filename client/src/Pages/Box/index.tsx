import styled from 'styled-components/macro';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { wProviderAtom, wSelectedAccountAtom } from '../../store';
import { useAtom } from 'jotai';
import { Contract, utils } from 'ethers';

import BoxFactory from '../../Constants/ABI/BoxFactory.json';
import BoxABI from '../../Constants/ABI/Box.json';
import Box from '../../Components/Box';
import Title from '../../Components/Title';

const cAddress = '0x58c43BF186587DdAc17200A498F4c48E1C382E4e';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem 0;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0.8rem;
`;

const ActionBar = styled.div`
  border: 0.1rem solid ${(props) => props.theme.bgdark};
  border-radius: 0.4rem;
  margin: 0.2rem 1rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.bglight};
  width: 18rem;
`;

const SectionTitle = styled.p`
  font-family: 'RobotoBold';
  font-size: 1.2rem;
  margin-bottom: 0.6rem;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.4rem;
  border-radius: 0.4rem;
  border: none;
`;

const Button = styled.button`
  padding: 0.4rem;
  min-width: 6rem;
  margin: 0.4rem 0;
  border-radius: 0.4rem;
  border: none;
  background-color: ${(props) => props.theme.primary};
  margin-right: 0.4rem;
  cursor: pointer;

  :hover {
    background-color: ${(props) => props.theme.secondary};
  }
`;

export default function () {
  const [wProvider] = useAtom(wProviderAtom);
  const { boxId } = useParams();
  const [factoryContract, setFactoryContract] = useState<Contract | null>(null);
  const [boxContract, setBoxContract] = useState<Contract | null>(null);
  const [listingPrice, setListingPrice] = useState<string>('');

  const [listed, setListed] = useState<boolean>(false);

  useEffect(() => {
    if (wProvider) {
      setFactoryContract(new Contract(cAddress, BoxFactory.abi, wProvider.getSigner()));
    }
  }, [wProvider]);

  useEffect(() => {
    async function getBoxContract() {
      const boxAddress = await factoryContract?.get(boxId);
      setBoxContract(new Contract(boxAddress, BoxABI.abi, wProvider?.getSigner()));
    }

    if (wProvider && factoryContract) {
      getBoxContract();
    }
  }, [wProvider, factoryContract, boxId]);

  useEffect(() => {
    async function getListed() {
      setListed(await boxContract?.listed());
    }

    if (wProvider && boxContract) {
      getListed();
    }
  }, [boxContract, wProvider]);

  const list = () => {
    async function listBox() {
      await boxContract?.list(utils.parseEther(listingPrice));
    }

    if (listingPrice) {
      listBox();
    }
  };

  const unlist = () => {
    async function unlistBox() {
      await boxContract?.unlist();
    }

    unlistBox();
  };

  return (
    <Container>
      <Title text="📦 Box" />

      <BoxContainer>
        {factoryContract ? <Box FactoryContract={factoryContract} id={Number(boxId)} /> : null}
        <ActionBar>
          <br />
          <SectionTitle>Put on sale</SectionTitle>

          <Input
            placeholder="price in ETH"
            value={listingPrice}
            type="number"
            onChange={(e) => setListingPrice(e.target.value)}
          />
          <Button onClick={list} disabled={listed}>
            List
          </Button>
          <Button onClick={unlist} disabled={!listed}>
            Unlist
          </Button>
        </ActionBar>
      </BoxContainer>
    </Container>
  );
}
