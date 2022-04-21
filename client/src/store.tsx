import { atom } from 'jotai';
import { ethers, Contract } from 'ethers';

export const providerAtom = atom<null | ethers.providers.Web3Provider>(null);
export const blockNumberAtom = atom<number>(0);
export const chainIDAtom = atom<number>(0);
export const selectedAccountAtom = atom<string>('');

export const factoryContractAtom = atom<Contract | null>(null);
export const transactionInProgressAtom = atom<boolean>(false);
