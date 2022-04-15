import { ReactChildren, ReactChild, useState } from 'react';

type Web3ConnectorProps = {
  children: ReactChildren | ReactChild;
};

export default function ({ children }: Web3ConnectorProps) {
  const [loading, setLoading] = useState(true);

  return <>{children}</>;
}
