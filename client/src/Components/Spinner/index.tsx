import styled from 'styled-components/macro';

const StyledSpinner = styled.svg`
  animation: rotate 2s linear infinite;
  margin: auto;
  padding: 6rem;
  width: 3rem;
  height: 3rem;
  transition: 0.2s;

  & .path {
    stroke: ${(props) => props.theme.bgdark};
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

const Spinner = () => (
  <StyledSpinner viewBox="0 0 50 50">
    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
  </StyledSpinner>
);

export default Spinner;
