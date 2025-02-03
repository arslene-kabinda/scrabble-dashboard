import React, { useEffect, useState } from "react";
import { getTransactions, validateTransaction } from "../services/transactions";
import { IoMdSync } from "react-icons/io";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { FaTimes } from "react-icons/fa";

const Spinner = () => {
	return (
		<div role="status">
			<svg
				aria-hidden="true"
				className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
			<span className="sr-only">Loading...</span>
		</div>
	);
};

const Transaction = ({ transaction, onValidation }) => {
	const [loading, setLoading] = useState(false);
	const [displayedName, setDisplayedName] = useState("");
	const [ref, setRef] = useState("");
	const [showValidateModal, setShowValidateModal] = useState(false);

	const validate = async (e) => {
		e.preventDefault();
		if (!ref || !displayedName) return;
		if (loading) return;
		setLoading(true);
		const validated = await validateTransaction(transaction.uid, {
			displayedName,
			ref,
		});
		if (validated) onValidation(transaction.uid);
		setLoading(false);
	};

	useEffect(() => {
		const unsub = onSnapshot(
			doc(db, "Transactions", transaction.uid),
			(doc) => {
				const data = doc.data();
				if (
					data.status === "finished" ||
					data.status === "canceled" ||
					data.validatedAt
				) {
					onValidation(data.uid);
				}
			}
		);
		return () => unsub();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transaction.uid]);

	return (
		<>
			{showValidateModal && (
				<div className="fixed text-slate-700 flex items-end justify-end top-0 left-0 z-[100000] bg-black bg-opacity-40 w-screen h-screen">
					<div className="w-[400px] h-screen bg-white p-5 flex flex-col gap-3">
						<button
							className="p-3 w-fit h-fit ml-auto text-white bg-slate-700 rounded-full"
							type="button"
							onClick={() => setShowValidateModal(false)}
						>
							<FaTimes />
						</button>
						<h3 className="text-2xl font-bold">Valider le retrait</h3>
						<h3 className="font-bold">
							{transaction.user?.displayName ?? "Anonyme"}
						</h3>
						<p className="text-2xl">{transaction.amount}$</p>
						<p>{transaction.phone}</p>
						<form onSubmit={validate} className="flex flex-col w-full gap-2">
							<input
								value={displayedName}
								onChange={(e) => setDisplayedName(e.target.value)}
								type="text"
								placeholder="Nom apparu lors de la transaction"
								className="w-full p-2 border outline-none focus:outline-none rounded-md"
								required
							/>
							<input
								value={ref}
								onChange={(e) => setRef(e.target.value)}
								type="text"
								placeholder="Référence de la transaction"
								className="w-full p-2 border outline-none focus:outline-none rounded-md"
								required
							/>
							<button className="w-full p-2 rounded-md bg-cyan-700 text-white flex items-center justify-center">
								{loading ? (
									<span>
										<Spinner />
									</span>
								) : (
									<span className="text-sm">Valider</span>
								)}
							</button>
						</form>
					</div>
				</div>
			)}
			<div className="w-full border gap-2 rounded-md p-2 flex flex-col">
				<h3 className="font-bold">
					{transaction.user?.displayName ?? "Anonyme"}
				</h3>
				<p className="text-2xl">{transaction.amount}$</p>
				<p>{Intl.DateTimeFormat("fr", {dateStyle: 'long', timeStyle: 'medium'}).format(new Date(transaction.createdAt))}</p>
				<p>{transaction.phone}</p>
				<button
					onClick={() => setShowValidateModal(true)}
					className="ml-auto w-fit px-5 py-2 rounded-md border border-white text-white text-sm"
				>
					Valider
				</button>
			</div>
		</>
	);
};

function RecentTransaction() {
	const [loading, setLoading] = useState(false);
	const [transactions, setTransactions] = useState([]);

	const onValidation = (uid) => {
		setTransactions((prev) => prev.filter((t) => t.uid !== uid));
	};

	const loadTransactions = async () => {
		if (loading) return;
		setLoading(true);
		const data = await getTransactions();
		if (data) setTransactions(data);
		setLoading(false);
	};

	useEffect(() => {
		loadTransactions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading)
		return (
			<div className="flex p-5 items-center justify-center">
				<Spinner />
			</div>
		);

	if (!transactions.length)
		return (
			<div className="flex h-screen  items-center justify-center flex-col gap-3">
				<p>Aucune transaction en attente</p>
				<button
					onClick={loadTransactions}
					className="flex items-center gap-2 text-white p-2 bg-cyan-500 rounded-md"
				>
					<span className="text-xl">
						<IoMdSync />
					</span>
					<span>Recharger</span>
				</button>
			</div>
		);

	return (
		<div className="flex flex-col max-h-[1200px] overflow-y-scroll gap-5 w-full py-5">
			<div className="flex items-center justify-between w-full gap-3">
				<h1 className="font-bold text-xl">Transactions en attente</h1>
				<button onClick={loadTransactions} className="text-xl text-white-700">
					<IoMdSync />
				</button>
			</div>
			<div className="grid grid-cols-1 gap-3">
				{[...transactions]
					.sort(
						(b, a) =>
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					)
					.map((transaction, index) => (
						<Transaction
							key={index.valueOf()}
							transaction={transaction}
							onValidation={onValidation}
						/>
					))}
			</div>
		</div>
	);
}

export default RecentTransaction;
