import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import axiosInstance from "../../services/axios";

const Transactions = () => {
    const theme = useTheme();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance("/transactions?nbr=1000&all=1");
            setTransactions(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (e) {
            console.error("Erreur lors du chargement des transactions", e);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { field: "displayName", headerName: "Nom", flex: 1, headerClassName: "bold-header" },
        { field: "amount", headerName: "Balance", flex: 1, headerClassName: "bold-header" },
        { 
            field: "createdAt", 
            headerName: "Date", 
            flex: 1,
            headerClassName: "bold-header", 
            renderCell: (params) => 
                Intl.DateTimeFormat("fr", { dateStyle: "long", timeStyle: "medium" }).format(new Date(params.value)),
        },
        { field: "type", headerName: "Types", flex: 1, headerClassName: "bold-header" },
        { field: "status", headerName: "Statut", flex: 1, headerClassName: "bold-header" },
    ];

    const rows = transactions.map((t, index) => ({
        id: index,
        displayName: t.user?.displayName ?? "N/A",
        amount: t.amount ?? 0,
        createdAt: t.createdAt,
        type: t.type ?? "Inconnu",
        status: t.status,
    }));

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="TRANSACTIONS" />
            <Box height="80vh" sx={{
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { borderBottom: "none" },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.background.alt,
                    color: theme.palette.secondary[100],
                    borderBottom: "none",
                    fontWeight: "bold",
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
                "& .bold-header": {
                    fontWeight: "bold",
                }
            }}>
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    loading={loading} 
                    pageSize={10} 
                    autoPageSize 
                    disableSelectionOnClick 
                />
            </Box>
        </Box>
    );
};

export default Transactions;
