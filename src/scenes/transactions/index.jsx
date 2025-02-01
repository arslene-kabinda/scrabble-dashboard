import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import axiosInstance from "../../services/axios";

const Transactions = () => {
	const theme = useTheme();

	// values to be sent to the backend
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchTransactions();
	}, []);
	const fetchTransactions = async () => {
		setLoading(true);
		try {
			const { data } = await axiosInstance("/transactions?nbr=1000&all=1");
			setTransactions(data);
		} catch (e) {
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="TRANSACTIONS" />
			<Box
				height="80vh"
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
						<div className="grid grid-cols-5 header">
							<span className="column">Nom</span>
							<span className="column">Balance</span>
							<span className="column">Date</span>
							<span className="column">Types</span>
							<span className="column">Satus</span>
						</div>
						<div>
							{[...transactions]
								.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
								.map((u) => {
									return (
										<div className="row grid grid-cols-5" key={u.uid}>
											<span className="column">{u.user?.displayName}</span>
											<span className="column">{u.amount ?? 0}</span>
											<span className="column">
												{Intl.DateTimeFormat("fr", {
													dateStyle: "long",
													timeStyle: "medium",
												}).format(new Date(u.createdAt))}
											</span>
											<span className="column">{u.type ?? 0}</span>
											<span className="column">{u.status}</span>
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

export default Transactions;
