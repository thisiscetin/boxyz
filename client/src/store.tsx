import { atom } from 'jotai';
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export const wProviderAtom = atom<null | ethers.providers.Web3Provider>(null);
export const rpcProviderAtom = atom<null | JsonRpcProvider>(null);
export const blockNumberAtom = atom<number>(0);
export const wChainIDAtom = atom<number>(0);
