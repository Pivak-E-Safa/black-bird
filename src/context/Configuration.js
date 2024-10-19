import React from 'react';

// Define a default configuration object
const defaultConfiguration = {
  currency: 'PKR',
  currencySymbol: 'PKR',
  deliveryRate: 150,
};

const ConfigurationContext = React.createContext({});

// Update the ConfigurationProvider
export const ConfigurationProvider = (props) => {
  // Simply provide the default configuration
  return (
    <ConfigurationContext.Provider value={defaultConfiguration}>
      {props.children}
    </ConfigurationContext.Provider>
  );
};

export const ConfigurationConsumer = ConfigurationContext.Consumer;
export default ConfigurationContext;
