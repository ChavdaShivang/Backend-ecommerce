import "./App.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Pay from "./components/Pay"
import Success from "./components/Success"

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/pay" element={<Pay />}></Route>
					<Route path="/success" element={<Success />}></Route>
				</Routes>
			</Router>
		</>
	);
}


export default App;
