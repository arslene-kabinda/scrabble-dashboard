import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { useGetCustomersQuery } from "../../state/api";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../services/axios";

const Users = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance('/users')
      setUsers(data)
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }


  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Users" subtitle="Liste des utilisateurs" />
      <Box
        mt="40px"
        height="75vh"
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
            <div>
              
              <div className="row col-4 header" >
                
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
    </Box>
  );
};

export default Users;
