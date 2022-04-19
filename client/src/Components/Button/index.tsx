import styled from 'styled-components/macro';

const Button = styled.button`
  margin-top: 1rem;
  margin-right: 0.6rem;
  font-family: 'RobotoBold';
  font-size: 1rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.red};
  transition: 0.2s;
  cursor: pointer;
  color: ${(props) => props.theme.primary};
  max-width: 12rem;

  :hover {
    background-color: ${(props) => props.theme.bglight};
  }

  :disabled {
    background-color: ${(props) => props.theme.secondary};
  }
`;

export default Button;
