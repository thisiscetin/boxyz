import styled from 'styled-components/macro';
import Logo from '../Logo';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0.2rem 0;
  border-bottom: 0.1rem solid ${(props) => props.theme.bgdark};
`;

const Section = styled('div')<{ pos: string }>`
  flex-basis: 25%;
  flex-direction: column;
  text-align: ${({ pos }) => pos};
`;

const NavItem = styled.p`
  font-family: 'PaytoneOne';
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  transition: 0.2s;
  cursor: pointer;
  :hover {
    text-shadow: 0.2rem 0.2rem 0.2rem ${(props) => props.theme.bgdark};
  }
`;

export default function () {
  return (
    <Container>
      <Section pos={'left'}>
        <Link to="/">
          <Logo />
        </Link>
      </Section>

      <Section pos={'center'}>
        <NavItem>
          <Link to="/">📦 &nbsp;BOXES</Link>
        </NavItem>
      </Section>

      <Section pos={'center'}>
        <NavItem>
          <Link to="/marketplace">🏪 &nbsp;MARKETPLACE</Link>
        </NavItem>
      </Section>

      <Section pos={'center'}>
        <NavItem>
          <Link to="/breed">⛏️ &nbsp;BREED</Link>
        </NavItem>
      </Section>

      <Section pos={'center'}>
        <NavItem>
          <Link to="/inventory">🔗 &nbsp;INVENTORY</Link>
        </NavItem>
      </Section>
    </Container>
  );
}
