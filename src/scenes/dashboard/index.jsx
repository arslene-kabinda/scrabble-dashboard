import React, { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LineChart from "../../components/LineChart";
import RecentTransaction from "../../components/RecentTransaction";
import axiosInstance from "../../services/axios";
import PieChart from "../../components/PieChart";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // States
  const [transactions, setTransactions] = useState([]);
  const [showCashoutModal, setShowCashoutModal] = useState(false)
  const [users, setUsers] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [walletAmount, setWalletAmount] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState({ users: false, transactions: false, wallet: false });
  const [error, setError] = useState({ users: null, transactions: null, wallet: null });

  useEffect(() => {
    fetchData("/users/randoms?nbr=15", setUsers, "users");
    fetchData("/transactions?nbr=5&all=all", setTransactions, "transactions");
    fetchWalletData();
    fetchWalletAmount();
  }, []);

  // Generic fetch function for users and transactions
  const fetchData = async (url, setState, key) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setError((prev) => ({ ...prev, [key]: null }));

    try {
      const { data } = await axiosInstance.get(url);
      setState(data);
    } catch (err) {
      setError((prev) => ({ ...prev, [key]: "Erreur lors de la récupération des données." }));
      console.error(`Erreur pour ${key}:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Fetch wallet data and format for LineChart
  const fetchWalletData = async () => {
    setLoading((prev) => ({ ...prev, wallet: true }));
    setError((prev) => ({ ...prev, wallet: null }));

    try {
      const { data } = await axiosInstance.get("/app-wallet");
      setWalletData(data.balance);

      const formattedData = [
        {
          id: "Balance",
          color: "hsl(220, 70%, 50%)",
          data: data.createdAt && data.balance ? [
            {
              x: new Date(data.createdAt).toLocaleDateString(),
              y: data.balance,
            },
          ] : [],
        },
      ];
      
      setChartData(formattedData);
    } catch (err) {
      setError((prev) => ({ ...prev, wallet: "Erreur lors de la récupération des données du portefeuille." }));
      console.error("Erreur pour wallet:", err);
    } finally {
      setLoading((prev) => ({ ...prev, wallet: false }));
    }
  };
 const fetchWalletAmount = async () => {
  setLoading((prev) => ({ ...prev, wallet: true }));
  setError((prev) => ({ ...prev, wallet: null }));

  try {
    const { data } = await axiosInstance.get("/app-wallet/funds");

    // Stocker la valeur directement
    setWalletAmount(typeof data === "number" ? data : 0);
  } catch (err) {
    setError((prev) => ({ ...prev, wallet: "Erreur lors de la récupération du montant du portefeuille." }));
    console.error("Erreur lors de la récupération du walletAmount:", err);
  } finally {
    setLoading((prev) => ({ ...prev, wallet: false }));
  }
};

  

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Bienvenue dans votre tableau de bord" />
      </FlexBetween>

      {/* GRID LAYOUT */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="minmax(160px, auto)"
        gap="20px"
      >
        {/* Transactions récentes */}
        <Box
          gridColumn="span 4"
          borderRadius="0.55rem"
          backgroundColor={theme.palette.background.alt}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Transactions Récentes
            </Typography>
          </Box>

          {loading.transactions ? (
            <Typography textAlign="center" p="20px">
              Chargement des transactions...
            </Typography>
          ) : error.transactions ? (
            <Typography textAlign="center" p="20px" color="red">
              {error.transactions}
            </Typography>
          ) : (
            <Box>
            {/* Titres des colonnes */}
            <Box
              display="grid"
              gridTemplateColumns="repeat(3, 1fr)"
              borderBottom={`2px solid ${colors.primary?.[500] || "#6200ea"}`}
              p="10px"
              borderRadius="0.25rem"
            >
              <Typography color= "#ffffff" fontWeight="700">
                Nom 
              </Typography>
              <Typography color= "#ffffff" fontWeight="700">
                Montant (USD)
              </Typography>
              <Typography color= "#ffffff" fontWeight="700">
                Statut
              </Typography>
            </Box>
          
            {/* Contenu des transactions */}
            {transactions.map((u, index) => (
                <Box
                  key={u?.uid ?? index} // Utilise `index` comme clé de secours
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  borderBottom={`1px solid ${colors.grey?.[300] || "#e0e0e0"}`}
                  p="10px"
                >
                  <Typography color="#ffffff" fontWeight="500">
                    {u?.user?.displayName || "Nom indisponible"}
                  </Typography>
                  <Typography color="FFD166" fontWeight="600">
                    {u?.amount ?? 0} USD
                  </Typography>
                  <Typography
                    color={u?.status === "Validé" ? colors.success?.[500] || "#4caf50" : colors.error?.[500] || "#f44336"}
                    fontWeight="600"
                  >
                    {u?.status || "Inconnu"}
                  </Typography>
                </Box>
              ))}

                        </Box>
                        

          
          )}
        </Box>

        {/* Recettes générées */}
        <Box
          gridColumn="span 4"
          borderRadius="0.55rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Box p="25px 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}  mb="15px">
                Recettes générées (Gain total)
              </Typography>
              {loading.wallet ? (
                <Typography variant="h6" color={colors.grey[500]}>
                  Chargement...
                </Typography>
              ) : error.wallet ? (
                <Typography variant="h6" color="red">
                  {error.wallet}
                </Typography>
              ) : (
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={theme.palette.secondary[500]}
                >
                  {walletData !== null ? `$${walletData.toFixed(2)}` : "Données indisponibles"}
                </Typography>
              )}
            </Box>

            <IconButton>
              <DownloadOutlinedIcon sx={{ fontSize: "26px", color: theme.palette.secondary[500] }} />
            </IconButton>
          </Box>

          <Box height="250px">
            {chartData.length === 0 ? (
              <Typography textAlign="center" color={colors.grey[500]}>
                Aucune donnée à afficher pour le graphique.
              </Typography>
            ) : (
              <LineChart data={chartData} isDashboard={true} />
            )}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          borderRadius="0.55rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Box p="25px 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}  mb="15px">
                Montant total du portefeuille
              </Typography>
              {loading.wallet ? (
                <Typography variant="h6" color={colors.grey[500]}>
                  Chargement...
                </Typography>
              ) : error.wallet ? (
                <Typography variant="h6" color="red">
                  {error.wallet}
                </Typography>
              ) : (
                <Typography
                variant="h3"
                fontWeight="bold"
                color={theme.palette.secondary[500]}
              >
                {walletAmount !== null ? `$${walletAmount.toFixed(2)}` : "Données indisponibles"}
              </Typography>
              
              )}
            </Box>

            
          </Box>

         <Box height="250px" display="flex" justifyContent="center" alignItems="center">
          {walletAmount !== null ? (
            <PieChart walletAmount={walletAmount} />
          ) : (
            <Typography color={colors.grey[500]}>Aucune donnée disponible.</Typography>
          )}
        </Box>
        </Box>

        {/* Liste des utilisateurs */}
        <Box
  gridColumn="span 8"
  borderRadius="0.55rem"
  backgroundColor={theme.palette.background.alt}
  p="20px"
>
  {/* Titre de la section */}
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={`4px solid ${colors.primary[500]}`}
    p="15px"
  >
    <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
      Liste des utilisateurs
    </Typography>
  </Box>

  {loading.users ? (
    <Typography textAlign="center">Chargement des utilisateurs...</Typography>
  ) : error.users ? (
    <Typography textAlign="center" color="red">
      {error.users}
    </Typography>
  ) : (
    <Box>
      {/* Titres des colonnes */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        borderBottom={`2px solid ${colors.primary[500]}`}
        pb="10px"
        pt="10px"
        mb="10px"
        textAlign="center"
      >
        <Typography fontWeight="700" color={colors.grey[100]}>
          Nom
        </Typography>
        <Typography fontWeight="700" color={colors.grey[100]}>
          Montant du portefeuille
        </Typography>
        <Typography fontWeight="700" color={colors.grey[100]}>
          Score
        </Typography>
        <Typography fontWeight="700" color={colors.grey[100]}>
          Meilleur Score
        </Typography>
      </Box>

      {/* Données des utilisateurs */}
         {users.map((u, index) => (
          <Box
            key={u?.uid ?? index}
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            borderBottom={`1px solid ${colors.grey[300]}`}
            p="10px"
            textAlign="center"
          >
            <Typography>{u?.displayName ?? "Nom indisponible"}</Typography>
            <Typography>{u?.wallet?.amount ?? 0}</Typography>
            <Typography>{u?.score ?? 0}</Typography>
            <Typography>{u?.bestScore?.points ?? 0}</Typography>
          </Box>
        ))}

    </Box>
  )}
</Box>


        {/* Transactions en attente */}
        <Box
          gridColumn="span 4"
          borderRadius="0.55rem"
          backgroundColor={theme.palette.background.alt}
          p="20px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]} >
            Transactions en attente
            </Typography>
          </Box>
          <RecentTransaction />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
