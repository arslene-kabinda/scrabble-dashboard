import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import axiosInstance from "../../services/axios";
import { FaTimes } from "react-icons/fa";

const AppWallet = () => {
	const [cashing, setCashing] = useState(false);
	const [motif, setMotif] = useState("");
	const [amount, setAmount] = useState(0);
	const [walletData, setWalletData] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const theme = useTheme();

	// values to be sent to the backend
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(false);

	const saveCashout = async (e) => {
		e.preventDefault();
		if (!amount || !motif) return;
		setCashing(true);
		await axiosInstance.post("/app-wallet/coushout-money", { motif, amount });
		setCashing(false);
		setShowAddModal(false);
		fetchHistory();
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	const fetchHistory = async () => {
		setLoading(true);
		const { data: appWallet } = await axiosInstance.get("/app-wallet");
		setWalletData(appWallet.balance);
		const { data } = await axiosInstance.get("/app-wallet/history");
		setTransactions(data);
		setLoading(false);
	};

	return (
		<>
			{showAddModal && (
				<div className="w-screen text-slate-800 fixed top-0 left-0 z-[10000000] h-screen bg-black bg-opacity-50 flex items-center justify-end">
					<div className="w-[450px] p-10 bg-white h-full flex flex-col gap-5">
						<div className="ml-auto">
							<button
								className="text-xl"
								type="button"
								onClick={() => setShowAddModal(false)}
							>
								<FaTimes />
							</button>
						</div>
						<h1>Renseigner un retrait</h1>
						<form onSubmit={saveCashout} className="w-full flex flex-col gap-4">
							<div className="w-full flex flex-col gap-1">
								<label htmlFor="amount">Montant</label>
								<input
									type="number"
									name="amount"
									id="amount"
									value={amount}
                  min={1}
									onChange={(e) => setAmount(Number(e.target.value))}
									max={walletData}
									required
									className="w-full p-2 rounded-md border"
								/>
							</div>
							<div className="w-full flex flex-col gap-1">
								<label htmlFor="motif">Motif</label>
								<textarea
									name="motif"
									id="motif"
									rows={5}
									className="w-full p-2 rounded-md border resize-none"
									required
									value={motif}
									onChange={(e) => setMotif(e.target.value)}
								></textarea>
							</div>
							<div className="ml-auto">
								<button
									disabled={cashing || !motif || !amount}
									className="w-fit text-white bg-slate-900 px-5 py-2 rounded-md opacity-100 disabled:opacity-50"
								>
									{cashing ? "En cours..." : "Confirmer"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			<Box m="1.5rem 2.5rem">
				<Header
					title={`Portefeuille de l'application: ${
						!!walletData && `${Number(walletData).toFixed(2)} $`
					}`}
					subtitle={
						<span style={{ marginBottom: "1rem", display: "inline-block" }}>
							Historique des retraits
						</span>
					}
				/>
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
						<div className="w-full flex items-center justify-center">
							<p>Chargement en cours...</p>
						</div>
					) : (
						<div className="w-full flex flex-col gap-5">
							{!!walletData && walletData > 0 && (
								<div className="ml-auto">
									<button
										type="button"
										className="w-fit px-5 py-2 rounded-md bg-slate-700 text-white"
										onClick={() => setShowAddModal(true)}
									>
										Notifier un retrait
									</button>
								</div>
							)}

							<div className="relative overflow-x-auto">
								<table className="w-full text-sm text-left rtl:text-right">
									<thead className="text-xs uppercase">
										<tr>
											<th scope="col" className="px-6 py-3">
												N°
											</th>
											<th scope="col" className="px-6 py-3">
												Montant
											</th>
											<th scope="col" className="px-6 py-3">
												Motif
											</th>
											<th scope="col" className="px-6 py-3">
												Date
											</th>
										</tr>
									</thead>
									<tbody>
										{transactions.map((transaction, index) => (
											<tr
												key={index.valueOf()}
												className=" border-gray-200"
											>
												<th scope="row" className="px-6 py-4">
													{index + 1}
												</th>
												<td className="px-6 py-4">{transaction.amount}</td>
												<td className="px-6 py-4">
													{transaction.motif ?? "Aucun"}
												</td>
												<td className="px-6 py-4">
													{Intl.DateTimeFormat("fr", {
														dateStyle: "medium",
														timeStyle: "medium",
													}).format(new Date(transaction.createdAt))}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</Box>
			</Box>
		</>
	);
};

export default AppWallet;
