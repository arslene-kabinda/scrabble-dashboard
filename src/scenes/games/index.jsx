import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import axiosInstance from "../../services/axios";
import UserGame from "../../components/UserGame";

const Games = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [games, setGames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchGames();

  }, [])
  const fetchGames = async () => {
    setLoading(true);
    setError(null); // Réinitialise l'erreur avant une nouvelle requête
    try {
      const { data } = await axiosInstance('/games');
      setGames(data);
    } catch (e) {
      setError("Une erreur s'est produite lors de la récupération des jeux.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="JEUX" subtitle="Jeux" />
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
        {
          loading ? <div>Loading....</div> : (
            <div className="grid grid-cols-2 gap">
              {
                games.map((game) => {
                  if (!game.usersModels || !game.usersModels.length || !game.users) {
                    return (
                      <div key={game.id} className="w-full p-4 border rounded-lg">
                        Données du jeu manquantes.
                      </div>
                    );
                  }
                  const firstUser = game.usersModels[0]
                  const secondUser = game.usersModels[1]
                  return (
                    <div  key={game.id}  className="w-full grid grid-cols-3 gap-5 border gap padding">
                      <UserGame details={firstUser} score={game.users.find(u => u.userId === firstUser.uid)} />
                      <div className="w-full flex items-center justify-center">
                        <span>
                          -
                        </span>
                      </div>
                      <UserGame left={true} details={secondUser} score={game.users.find(u => u.userId === secondUser.uid)} />
                    </div>
                  )
                })
              }
            </div>
          )
        }
      </Box>
    </Box>
  );
};

export default Games;
