import axiosInstance from "./axios";

export const getTransactions = async () => {
	console.log(process.env.REACT_APP_API_URL)
	try {
		const { data } = await axiosInstance.get(
			"/transactions/awaiting-validation"
		);
		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const validateTransaction = async (uid, dto) => {
	try {
		await axiosInstance.post(`/transactions/${uid}/validate`, {
			...dto,
		});
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
