import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

//import thirdweb provider
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

// include the chain you want to connect to
// rinkeby is 4, mainnet is 1
const supportedChainIds = [4];

// include the wallet type, we are using Metamask which is an "injected wallet"
const connectors = {
  "injected": {},
}


// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>

    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <App />
    </ThirdwebWeb3Provider>

  </React.StrictMode>,
  document.getElementById("root")
);
