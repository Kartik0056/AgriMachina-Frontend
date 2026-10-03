import React from 'react';
import EidulaAIChatbot from './EidulaAIChatbot';

/**
 * Backward-compatible wrapper that directs to EidulaAIChatbot
 */
const KisanAIChatbot = (props) => {
  return <EidulaAIChatbot {...props} />;
};

export default KisanAIChatbot;
