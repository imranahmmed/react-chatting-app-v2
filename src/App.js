import { ToastContainer } from 'react-toastify';
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/Home";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import RootLayout from './layouts/RootLayout';
import Message from './pages/Message';
import Notification from './pages/Notification';
import Setting from './pages/Setting';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path="/" element={<Login />}></Route>
			<Route path="/signup" element={<Registration />}></Route>
			<Route path="/pokpok" element={<RootLayout />}>
				<Route path="home" element={<Home />}></Route>
				<Route path="message" element={<Message />}></Route>
				<Route path="notification" element={<Notification />}></Route>
				<Route path="setting" element={<Setting />}></Route>
			</Route>
		</Route>
	)
);
function App() {
	return (
		<>
			<ToastContainer />
			<RouterProvider router={router} />
		</>
	);
}

export default App;
