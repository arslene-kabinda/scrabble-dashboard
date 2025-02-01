import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import axiosInstance from "../../services/axios";

const Users = () => {
	const theme = useTheme();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const { data } = await axiosInstance("/users");
			setUsers(data);
		} catch (e) {
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box m="1.5rem 2.5rem">
			<Header
				title="Users"
				subtitle={`Liste des utilisateurs: ${users.length}`}
			/>
			<Box
				mt="40px"
				height="75vh"
				sx={{
					"& .MuiDataGrid-root": {
						border: "none",
					},
					"& .MuiDataGrid-cell": {
						borderBottom: "none",
					},
					"& .MuiDataGrid-columnHeaders": {
						backgroundColor: theme.palette.background.alt,
						color: theme.palette.secondary[100],
						borderBottom: "none",
					},
					"& .MuiDataGrid-virtualScroller": {
						backgroundColor: theme.palette.primary.light,
					},
					"& .MuiDataGrid-footerContainer": {
						backgroundColor: theme.palette.background.alt,
						color: theme.palette.secondary[100],
						borderTop: "none",
					},
					"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
						color: `${theme.palette.secondary[200]} !important`,
					},
				}}
			>
				{loading ? (
					<div>Loading....</div>
				) : (
					<div>
						<div className="header grid grid-cols-5">
							{/* <div>ID</div> */}
							<div className="column">N°</div>
							<div className="column">Nom</div>
							<div className="column">Portfeuille</div>
							<div className="column">Score</div>
							<div className="column">Meilleur score</div>
						</div>
						<div>
							{[...users]
								.sort(
									(a, b) => (b.wallet?.amount ?? 0) - (a.wallet?.amount ?? 0)
								)
								.map((u, i) => {
									return (
										<div className="row grid grid-cols-5" key={u.uid}>
											<div className="column">{i + 1}</div>
											<span className="column">
												{u?.displayName ?? "Nom indisponible"}
											</span>

											<span className="column">{u.wallet?.amount ?? 0}</span>
											<span className="column">{u.score ?? 0}</span>
											<span className="column">{u.bestScore?.points ?? 0}</span>
										</div>
									);
								})}
						</div>
					</div>
				)}
			</Box>
		</Box>
	);
};

export default Users;
