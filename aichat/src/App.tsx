// src/App.tsx
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Sidebar } from "./layouts/components/Sidebar";
import NewChatPage from "./pages/NewChatPage";

const AppLayout = () => {
	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1">
				<Routes>
					<Route path="/" element={<Navigate to="/chat" replace />} />
					<Route path="/chat" element={<NewChatPage />} />
				</Routes>
			</main>
		</div>
	);
};

const App = () => {
	return (
		<Router>
			<AppLayout />
		</Router>
	);
};

export default App;
