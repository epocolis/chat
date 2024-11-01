import { useState } from "react";
import { RootLayoutProps } from "../types/layout";
import { Sidebar } from "./components/Sidebar";

export default function RootLayout({ children }: RootLayoutProps) {
	const [recentChats] = useState([
		{
			id: 1,
			title: "Building an AI Assistant React App",
			time: "5 minutes ago",
		},
		{ id: 2, title: "Optimizing Cloud Job Scheduling", time: "26 minutes ago" },
		{ id: 3, title: "Managing State in Large React Apps", time: "4 hours ago" },
	]);

	return (
		<div className="flex h-screen bg-white">
			<Sidebar recentChats={recentChats} />
			<div className="flex-1 flex flex-col">
				<div className="flex-1 flex flex-col">
					<div className="flex-1">{children}</div>
				</div>
			</div>
		</div>
	);
}
