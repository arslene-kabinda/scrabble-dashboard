import React from "react";

export default function UserGame({ details }) {
	return (
		<div className="w-full relative flex items-center justify-center">
			<div className="flex gap items-center">
				<div className="flex flex-col gap items-center relative">
					{details.winner && (
						<div className="absolute text-xl top-0 right-0">
							<span>🎊</span>
						</div>
					)}
					{details.user?.profilePicture ? (
						<img
							className="w-14 h-14 object-center object-cover rounded-full"
							alt="User avatar"
							src={details.user?.profilePicture}
							width={50}
							height={50}
						/>
					) : (
						<div className="w-14 h-14 rounded-full bg-gray-500"></div>
					)}
					<p className="text-center">{details.user?.displayName}</p>
				</div>
			</div>
		</div>
	);
}
