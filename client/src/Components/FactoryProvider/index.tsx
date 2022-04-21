import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { providerAtom, factoryContractAtom } from '../../store';
import { Contract } from 'ethers';

import { BoxFactoryAddress } from '../../Constants/address';
import BoxFactory from '../../Constants/ABI/BoxFactory.json';

function FactoryProvider() {
  const [provider] = useAtom(providerAtom);
  const [, setFactoryContract] = useAtom(factoryContractAtom);

  useEffect(() => {
    if (provider) {
      setFactoryContract(new Contract(BoxFactoryAddress, BoxFactory.abi, provider.getSigner()));
    }
  }, [provider, setFactoryContract]);

  return <></>;
}

export default FactoryProvider;
