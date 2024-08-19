import React, { useEffect } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import {
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { DataGrid } from "@mui/x-data-grid";
// import BreakdownChart from "components/BreakdownChart";
// import OverviewChart from "components/OverviewChart";
import { useGetDashboardQuery } from "../../state/api";
// import StatBox from "components/StatBox";
import * as mockData from "../../data/mockData";
import LineChart from "../../components/LineChart";
// import GeographyChart from "components/GeographyChart";
// import BarChart from "components/BarChart";
// import ProgressCircle from "components/ProgressCircle";
import RecentTransaction from "../../components/RecentTransaction";
import { useTransactions } from "../../store/transactions";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardQuery();
  const { loading, transactions, loadTransactions } = useTransactions()

  useEffect(() => {
    loadTransactions()
  }, [])

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },

    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.8,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.8,
      renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "wallet",
      headerName: "Wallet",
      flex: 0.4,
    },
    {
      field: "point",
      headerName: "Point",
      flex: 0.5,
    },
    {
      field: "score",
      headerName: "Score",
      flex: 0.5,
    },
   
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Bienvenue dans votre tableau de bord" />
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          overflow="auto"
           borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Transactions Récentes
            </Typography>
          </Box>
          {mockData.mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={theme.palette.secondary[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={theme.palette.secondary[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Recettes générées
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={theme.palette.secondary[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color:theme.palette.secondary[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
       

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
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
              backgroundColor: theme.palette.background.alt,
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
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data && data.transactions) || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
             Transaction en attente
          </Typography>
          <RecentTransaction/>
          
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
