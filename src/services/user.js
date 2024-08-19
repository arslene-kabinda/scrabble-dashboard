export const getUsers = async () => {
	console.log(process.env.REACT_APP_API_URL)
	try {
		const { data } = await axiosInstance.get(
			"/users"
		);
		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
};
