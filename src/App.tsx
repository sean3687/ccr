import "./App.css";

import { GuardProvider } from '@authing/guard-react18';
import "@authing/guard-react18/dist/esm/guard.min.css";

import RouterComponent from "./router";


function App() {

	return (
		<GuardProvider appId="64d2828ba546b479d79ca47a">
			<RouterComponent></RouterComponent>
		</GuardProvider>
		)

}

export default App;
