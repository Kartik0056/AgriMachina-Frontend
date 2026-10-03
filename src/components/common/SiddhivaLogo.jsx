import React from 'react';
import EidulaLogo from './EidulaLogo';

/**
 * Backward-compatible wrapper that directs to the official EidulaLogo
 */
const SiddhivaLogo = (props) => {
  return <EidulaLogo {...props} />;
};

export default SiddhivaLogo;
