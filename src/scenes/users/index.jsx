import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	TextField,
	useTheme,
	Avatar,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../services/axios";
import Header from "../../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
	const theme = useTheme();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [openDialog, setOpenDialog] = useState(false); // État pour ouvrir le Dialog
	const [selectedUserId, setSelectedUserId] = useState(null); // ID de l'utilisateur à supprimer

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async (query = "") => {
		setLoading(true);
		try {
			const { data } = await axiosInstance(`/users/search?q=${query}`);
			setUsers(data);
		} catch (e) {
			console.error("Erreur lors du chargement des utilisateurs", e);
		} finally {
			setLoading(false);
		}
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleSearchSubmit = () => {
		fetchUsers(searchQuery);
	};

	// Ouvrir la boîte de dialogue de confirmation
	const handleOpenDialog = (uid) => {
		setSelectedUserId(uid);
		setOpenDialog(true);
	};

	// Fermer la boîte de dialogue
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedUserId(null);
	};

	// Fonction pour supprimer un utilisateur avec toast
	const handleDeleteUser = async () => {
		try {
			// On supprime l'utilisateur du côté serveur
			await axiosInstance.delete(`/users/${selectedUserId}`);

			// Une fois que la suppression est confirmée, on met à jour l'état local
			setUsers((prevUsers) =>
				prevUsers.filter((user) => user.uid !== selectedUserId)
			);

			toast.success("Utilisateur supprimé avec succès !");
			handleCloseDialog(); // Fermer la boîte de dialogue après la suppression
		} catch (error) {
			console.error("Erreur lors de la suppression de l'utilisateur", error);
			toast.error("Erreur lors de la suppression de l'utilisateur.");
		}
	};

	const columns = [
		{
			field: "displayName",
			headerName: "Nom",
			flex: 1,
			minWidth: 150,
			renderCell: (params) => (
				<Box display="flex" alignItems="center" gap={1}>
					<Avatar
						src={params.row.profilePicture}
						alt={params.row.displayName}
						sx={{ width: 32, height: 32 }}
					/>
					{params.value}
				</Box>
			),
		},
		{
			field: "walletAmount",
			headerName: "Portefeuille",
			flex: 1,
			minWidth: 120,
		},
		{ field: "score", headerName: "Score", flex: 1, minWidth: 100 },
		{
			field: "bestScore",
			headerName: "Meilleur score",
			flex: 1,
			minWidth: 120,
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 1,
			minWidth: 120,
			renderCell: (params) => (
				<Button
					variant="contained"
					color="secondary"
					onClick={() => handleOpenDialog(params.row.id)}
				>
					Supprimer
				</Button>
			),
		},
	];

	const rows = [...users]
		.sort((a, b) => (b.wallet?.amount ?? 0) - (a.wallet?.amount ?? 0))
		.map((user, index) => ({
			id: user.uid || index,
			displayName: user?.displayName ?? "Nom indisponible",
			profilePicture: user?.profilePicture ?? "",
			walletAmount: user?.wallet?.amount ?? 0,
			score: user?.score ?? 0,
			bestScore: user?.bestScore?.points ?? 0,
		}));

	return (
		<Box m="1.5rem 2.5rem">
			<Header
				title="Users"
				subtitle={`Liste des utilisateurs: ${users.length}`}
			/>
			<Box display="flex" alignItems="center" gap={2} mt={2}>
				<TextField
					label="Rechercher un utilisateur"
					variant="outlined"
					value={searchQuery}
					onChange={handleSearchChange}
					sx={{ flex: 1 }}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSearchSubmit}
				>
					Rechercher
				</Button>
			</Box>
			<Button
				variant="contained"
				color="primary"
				onClick={() => fetchUsers("")}
				sx={{ mt: 2 }}
			>
				Rafraîchir
			</Button>
			<Box
				mt="20px"
				height="75vh"
				sx={{
					"& .MuiDataGrid-root": { border: "none" },
					"& .MuiDataGrid-cell": { borderBottom: "none" },
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
				<DataGrid
					rows={rows}
					columns={columns}
					loading={loading}
					disableSelectionOnClick
					autoPageSize
				/>
			</Box>

			{/* Boîte de dialogue pour confirmation de suppression */}
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>Confirmer la suppression</DialogTitle>
				<DialogContent>
					<p>
						Êtes-vous sûr(e) de vouloir supprimer cet utilisateur ? Cette action
						est irréversible.
					</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						Annuler
					</Button>
					<Button onClick={handleDeleteUser} color="secondary">
						Supprimer
					</Button>
				</DialogActions>
			</Dialog>

			{/* Notifications */}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
			/>
		</Box>
	);
};

export default Users;
