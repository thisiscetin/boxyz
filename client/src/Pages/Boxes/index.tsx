import styled from 'styled-components/macro';

import Title from '../../Components/Title';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0.2rem 0;
`;

type BoxesProps = {
  value?: {
    account?: string;
  };
};

export default function ({ value: account }: BoxesProps) {
  return (
    <Container>
      <Title text={'Boxes'} />
      <p>{account}</p>
    </Container>
  );
}
