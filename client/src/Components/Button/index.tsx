import styled from 'styled-components/macro';

const Button = styled.button`
  margin-top: 1rem;
  font-family: 'RobotoBold';
  font-size: 1rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.4rem;
  background-color: red;
  transition: 0.2s;
  cursor: pointer;
  color: white;
  max-width: 12rem;

  :hover {
    background-color: ${(props) => props.theme.bglight};
  }
`;

export default Button;
