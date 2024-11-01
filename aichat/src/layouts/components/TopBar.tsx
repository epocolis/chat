// src/layouts/components/TopBar.tsx
interface TopBarProps {
	userName: string;
	planType: string;
}

export function TopBar({ userName, planType }: TopBarProps) {
	return (
		<div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
			<div className="flex items-center gap-2">
				<span className="text-orange-500">✹</span>
				<h2 className="text-xl text-gray-700">Good afternoon {userName}</h2>
			</div>
			<div className="flex items-center gap-4">
				<span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
					{planType}
				</span>
			</div>
		</div>
	);
}
