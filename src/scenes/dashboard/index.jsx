import React, { useEffect, useState } from "react";
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
import { useGetDashboardQuery } from "../../state/api";
import * as mockData from "../../data/mockData";
import LineChart from "../../components/LineChart";
import RecentTransaction from "../../components/RecentTransaction";
import axiosInstance from "../../services/axios";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardQuery();
  const [transactions, setTransactions] =  useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers();
    fetchRecentTransaction();
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance('/users/randoms?nbr=18')
      setUsers(data)
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }
 const fetchRecentTransaction =async () => {
  setLoading(true)
  try {
    const { data } = await axiosInstance.get('/transactions?nbr=10')
    setTransactions(data)
    
  } catch (e) {

  } finally {
    setLoading(false)
  }
}
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
          gridColumn="span 5"
          gridRow="span 2"
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
          {
          loading ? <div>Loading....</div> : (
            <div className="container">
              <div className="row col-3 header">
                 <div className="column">Nom</div>
                  <div className="column">Balance</div>
                  <div className="column">Status</div>
              
              </div>
              <div>
                {
                  transactions.map((u) => {
                    return (
                      <div className="row col-3" key={u.uid}>
                        <span className="column">
                          {u.user.displayName}
                        </span>
                       
                        <span className="column">
                          {u.amount ?? 0}
                        </span>
                        <span className="column">
                          { u.status}
                        </span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        }
        </Box>
        <Box
          gridColumn="span 7"
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
            <Typography  variant="h5" fontWeight="600" className="title">
                Liste des utilisateurs            
          </Typography>

          {
          loading ? <div>Loading....</div> : (
            <div>
              
              <div className="row col-4">
                
                  {/* <div>ID</div> */}
                  <div className="column">Nom</div>
                  <div className="column">Portfeuille</div>
                  <div className="column">Score</div>
                  <div className="column">Meilleur score</div>
              
              </div>
              <div>
                {
                  users.map((u) => {
                    return (
                      <div className="row col-4" key={u.uid}>
                        {/* <td>
                          { u.uid }
                        </td> */}
                        <span className="column">
                          {u.displayName}
                        </span>
                        
                        <span className="column">
                          {u.wallet?.amount ?? 0}
                        </span>
                        <span className="column">
                          { u.score ?? 0}
                        </span>
                        <span className="column">
                          { u.bestScore?.points ?? 0}
                        </span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        }


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
