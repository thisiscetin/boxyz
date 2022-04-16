import styled from 'styled-components/macro';

import { useAtom } from 'jotai';
import { blockNumberAtom } from '../../store';

const Container = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const Section = styled.div`
  flex-basis: 100%;
  color: ${(props) => props.theme.secondary};

  a {
    text-decoration: underline;
  }
`;

export default function () {
  const [blockNumber] = useAtom(blockNumberAtom);

  return (
    <Container>
      <Section>
        connected to&nbsp;
        <a href="https://plutotest.network" target="_blank">
          Pluto Test Network
        </a>
        &nbsp; #{blockNumber}
      </Section>
    </Container>
  );
}
