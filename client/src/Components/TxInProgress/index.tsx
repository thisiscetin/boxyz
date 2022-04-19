import styled from 'styled-components/macro';

import Spinner from '../Spinner';

const InProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  background-color: white;
  opacity: 0.7;
  z-index: 1;
  align-items: center;
`;

const CenterBox = styled.div`
  text-align: center;
  color: ${(props) => props.theme.bgdark};
  margin: auto;

  p {
    margin: 0;
  }
`;

export default function () {
  return (
    <InProgress>
      <CenterBox>
        <Spinner />
        <p>Transaction in progress. Please wait.</p>
      </CenterBox>
    </InProgress>
  );
}
