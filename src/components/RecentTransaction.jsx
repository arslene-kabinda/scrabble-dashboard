import React, { useEffect, useState } from "react";
import { getTransactions, validateTransaction } from "../services/transactions";
import { displayPhoneNumber } from "../utils/functions";
import { FaCopy } from "react-icons/fa";
import { useCopyToClipboard } from "usehooks-ts";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoMdSync } from "react-icons/io";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

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
	const [copied, setCopied] = useState(false);
	const [, copy] = useCopyToClipboard();
	const [loading, setLoading] = useState(false);
	const [displayedName, setDisplayedName] = useState("");
	const [ref, setRef] = useState("");

	const handleCopy = (text) => {
		copy(text).then(() => {
			setCopied(true);
		});
	};

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
		if (!copied) return;
		const time = setTimeout(() => {
			setCopied(false);
		}, [3000]);
		return () => clearTimeout(time);
	}, [copied]);

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
		<div className="border border-black rounded-md p-3 flex flex-col gap-5">
			<h2 className="text-xl">{transaction.amount} $</h2>
			<div className="flex items-center gap-3 justify-between">
				<span>{transaction.phone}</span>
				<button
					onClick={() => {
						handleCopy(`0${displayPhoneNumber(transaction.phone)}`);
					}}
				>
					{copied ? <IoIosCheckmarkCircleOutline /> : <FaCopy />}
				</button>
			</div>
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
			<div className="flex h-screen w-screen items-center justify-center">
				<Spinner />
			</div>
		);

	if (!transactions.length)
		return (
			<div className="flex h-screen w-screen items-center justify-center flex-col gap-3">
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
		<div className="w-screen flex flex-col gap-5 p-5">
			<div className="flex items-center justify-between w-full gap-3">
				<h1 className="text-2xl font-bold">Transactions en attente</h1>
				<button onClick={loadTransactions} className="text-xl text-gray-700">
					<IoMdSync />
				</button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{transactions.map((transaction, index) => (
					<Transaction
						onValidation={onValidation}
						transaction={transaction}
						key={index.valueOf()}
					/>
				))}
			</div>
		</div>
	);
}

export default RecentTransaction;