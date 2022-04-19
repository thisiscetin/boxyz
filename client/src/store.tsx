import { atom } from 'jotai';
import { ethers, Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export const wProviderAtom = atom<null | ethers.providers.Web3Provider>(null);
export const rpcProviderAtom = atom<null | JsonRpcProvider>(null);
export const blockNumberAtom = atom<number>(0);
export const wChainIDAtom = atom<number>(0);
export const wSelectedAccountAtom = atom<string>('');

export const factoryContractAtom = atom<Contract | null>(null);
export const transactionInProgressAtom = atom<boolean>(false);
