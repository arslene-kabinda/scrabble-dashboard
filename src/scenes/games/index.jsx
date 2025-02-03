import React, { useEffect, useState } from "react";
import { Box, useTheme, Pagination } from "@mui/material";
import Header from "../../components/Header";
import axiosInstance from "../../services/axios";
import UserGame from "../../components/UserGame";

const Games = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const gamesPerPage = 10;

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    setError(null); // Réinitialise l'erreur avant une nouvelle requête
    try {
      const { data } = await axiosInstance('/games');
      // Trier les jeux par date décroissante
      const sortedGames = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setGames(sortedGames);
    } catch (e) {
      setError("Une erreur s'est produite lors de la récupération des jeux.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const paginatedGames = games.slice((page - 1) * gamesPerPage, page * gamesPerPage);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="JEUX" subtitle={<span style={{ marginBottom: "1rem", display: "inline-block" }}>Jeux</span>} />
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
            <>
              <div className="grid grid-cols-2 gap">
                {
                  paginatedGames.map((game) => {
                    if (!game.users) {
                      return (
                        <div key={game.id} className="w-full p-4 border rounded-lg">
                          Données du jeu manquantes.
                        </div>
                      );
                    }
                    const firstUser = game.users[0];
                    const secondUser = game.users[1];
                    return (
                      <div key={game.id} className="w-full grid grid-cols-3 gap-5 border gap padding">
                        <UserGame details={firstUser.user} />
                        <div className="w-full flex flex-col items-center justify-center gap-3">
                          <div className="flex items-center gap-3">
                            <span>{firstUser.score}</span>
                            <span>-</span>
                            <span>{secondUser.score}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Créé le : {new Date(game.createdAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
                          </div>
                        </div>
                        <UserGame details={secondUser.user} />
                      </div>
                    );
                  })
                }
              </div>
              <Pagination count={Math.ceil(games.length / gamesPerPage)} page={page} onChange={handleChangePage} color="primary" sx={{ mt: 2 }} />
            </>
          )
        }
      </Box>
    </Box>
  );
};

export default Games;
