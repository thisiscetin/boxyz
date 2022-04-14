import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0.2rem 0;
`;

export default function () {
  return (
    <Container>
      <p>Inventory</p>
    </Container>
  );
}
