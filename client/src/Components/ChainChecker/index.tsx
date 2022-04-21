import styled from 'styled-components/macro';
import { useAtom } from 'jotai';
import { chainIDAtom, selectedAccountAtom } from '../../store';

interface ChainCheckerProps {
  children: React.ReactNode;
}

const PlutoLink = styled.a`
  color: ${(props) => props.theme.orange};
  text-decoration: underline;
`;

const TextBox = styled.div`
  margin: auto;
  margin-top: 2rem;
  text-align: center;
  width: 80%;
`;

function ChainChecker({ children }: ChainCheckerProps) {
  const [chainId] = useAtom(chainIDAtom);
  const [selectedAccount] = useAtom(selectedAccountAtom);

  if (chainId === 0x8a && selectedAccount !== '') {
    return <>{children}</>;
  }
  return (
    <TextBox>
      <p>
        Please switch Metamask extension to Pluto Test Network and connect your account. Current
        Chain ID: {chainId}.
      </p>

      <p>
        You can find how to add Pluto Test Network to your Metamask and get free test ether from
      </p>
      <PlutoLink href="https://plutotest.network/" target="_blank">
        https://plutotest.network/
      </PlutoLink>
    </TextBox>
  );
}

export default ChainChecker;
