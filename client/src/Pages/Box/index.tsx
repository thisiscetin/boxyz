import styled from 'styled-components/macro';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  wProviderAtom,
  factoryContractAtom,
  wSelectedAccountAtom,
  transactionInProgressAtom,
} from '../../store';
import { useAtom } from 'jotai';
import { Contract, utils } from 'ethers';

import BoxABI from '../../Constants/ABI/Box.json';
import Box from '../../Components/Box';
import Title from '../../Components/Title';
import Button from '../../Components/Button';

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
  padding: 1rem;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.bdark};
  width: 16rem;
  margin-top: 1rem;
`;

const SectionTitle = styled.p`
  font-family: 'RobotoBold';
  font-size: 1.2rem;
  color: ${(props) => props.theme.bgdark};
  margin-bottom: 0.6rem;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.4rem;
  border-radius: 0.4rem;
  border: 0.1rem solid ${(props) => props.theme.bgdark};
`;

const Sign = styled.div`
  font-family: 'PaytoneOne';
  font-size: 2rem;
  padding: 1rem;
  margin: auto 1rem;
`;

const BoxHeader = styled.div`
  font-family: 'RobotoBold';
  padding: 0.4rem;
`;

export default function () {
  const [wProvider] = useAtom(wProviderAtom);
  const { boxId } = useParams();
  const [factoryContract] = useAtom(factoryContractAtom);
  const [boxContract, setBoxContract] = useState<Contract | null>(null);
  const [listingPrice, setListingPrice] = useState<string>('');
  const [listed, setListed] = useState<boolean>(false);
  const [p1, setP1] = useState<number>(0);
  const [p2, setP2] = useState<number>(0);
  const [wSelectedAccount] = useAtom(wSelectedAccountAtom);
  const [owner, setOwner] = useState<string>('');
  const [, setTransactionInProgress] = useAtom(transactionInProgressAtom);

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
    async function getOwner() {
      setOwner(await boxContract?.owner());
    }

    if (boxContract) {
      getOwner();
    }
  }, [boxContract]);

  useEffect(() => {
    async function getParentContracts() {
      const [p1Address, p2Address] = await boxContract?.parents();
      if (p1Address === '0x0000000000000000000000000000000000000000') {
        setP1(0);
      } else {
        const p1Contract = new Contract(p1Address, BoxABI.abi, wProvider?.getSigner());
        setP1(await p1Contract.id());
      }

      if (p2Address === '0x0000000000000000000000000000000000000000') {
        setP2(0);
      } else {
        const p2Contract = new Contract(p2Address, BoxABI.abi, wProvider?.getSigner());
        setP2(await p2Contract.id());
      }
    }

    if (boxContract) {
      getParentContracts();
    }
  }, [wProvider, boxContract]);

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
      setTransactionInProgress(true);
      try {
        await boxContract?.list(utils.parseEther(listingPrice));
      } catch (err: any) {
        const code: number = err?.code;
        if (err && code === 4001) {
          alert(err.message);
        }
      }
      setTransactionInProgress(false);
    }

    if (listingPrice) {
      listBox();
    }
  };

  const unlist = () => {
    async function unlistBox() {
      setTransactionInProgress(true);
      try {
        await boxContract?.unlist();
      } catch (err: any) {
        const code: number = err?.code;
        if (err && code === 4001) {
          alert(err.message);
        }
      }
      setTransactionInProgress(false);
    }

    unlistBox();
  };

  return (
    <Container>
      <Title text="📦 Box" />

      {factoryContract ? (
        <BoxContainer>
          <div>
            <BoxHeader>Self</BoxHeader>
            <Box FactoryContract={factoryContract} id={Number(boxId)} hideBuyButton />
          </div>

          <Sign>=</Sign>

          <div>
            <BoxHeader>Parent 1</BoxHeader>
            <Box FactoryContract={factoryContract} id={Number(p1)} hideBuyButton />
          </div>

          <Sign>+</Sign>

          <div>
            <BoxHeader>Parent 2</BoxHeader>
            <Box FactoryContract={factoryContract} id={Number(p2)} hideBuyButton />
          </div>
        </BoxContainer>
      ) : null}

      {owner === wSelectedAccount ? (
        <ActionBar>
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
      ) : null}
    </Container>
  );
}
