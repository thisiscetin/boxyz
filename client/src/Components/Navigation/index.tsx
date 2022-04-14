import styled from 'styled-components/macro';
import Logo from '../Logo';
import { Link } from 'react-router-dom';
import React from 'react';

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

const HideOnMobile = styled('div')`
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.p`
  font-family: 'PaytoneOne';
  font-size: 1rem;
  margin-bottom: 0.2rem;
  transition: 0.2s;
  cursor: pointer;
  :hover {
    text-shadow: 0.2rem 0.2rem 0.2rem ${(props) => props.theme.bgdark};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

type LinkTextProps = {
  icon: string;
  text: string;
};

const LinkText = ({ icon, text }: LinkTextProps) => (
  <>
    <span>{icon}</span>
    <br />
    <span>{text}</span>
  </>
);

export default function () {
  return (
    <Container>
      <HideOnMobile>
        <Section pos={'left'}>
          <Link to="/">
            <Logo />
          </Link>
        </Section>
      </HideOnMobile>

      <Section pos={'center'}>
        <NavItem>
          <Link to="/">
            <LinkText icon={'📦'} text={'BOXES'} />
          </Link>
        </NavItem>
      </Section>

      <Section pos={'center'}>
        <NavItem>
          <Link to="/marketplace">
            <LinkText icon={'🏪'} text={'MARKETPLACE'} />
          </Link>
        </NavItem>
      </Section>

      <Section pos={'center'}>
        <NavItem>
          <Link to="/breed">
            <LinkText icon={'⛏️'} text={'BREED'} />
          </Link>
        </NavItem>
      </Section>

      <Section pos={'center'}>
        <NavItem>
          <Link to="/inventory">
            <LinkText icon={'🔗'} text={'INVENTORY'} />
          </Link>
        </NavItem>
      </Section>
    </Container>
  );
}
