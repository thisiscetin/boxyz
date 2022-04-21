import styled from 'styled-components/macro';

const Title = styled.div`
  font-family: 'RobotoBold';
  font-size: 1.5rem;
  color: ${(props) => props.theme.primary};
`;

interface TitleProps {
  text: string;
}

export default function ({ text }: TitleProps) {
  return <Title>{text}</Title>;
}
