import React, { useState, useEffect } from "react";
import { Avatar, Box, Card, Typography, CardContent, Pagination } from "@mui/material";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { GithubApi } from "../apiHandler/GithubApi.js";

const StarredRepo = () => {
  const [data, setData] = useState([]);
  const [showBoxList, setShowBoxList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  let totalPages = Math.ceil(data.total_count / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const combinedData = await GithubApi(currentPage); 
      setData(combinedData.items);
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    totalPages = Math.ceil(data?.total_count / itemsPerPage);
  }, [data, itemsPerPage]);

  const handleToggle = (index) => {
    setShowBoxList((prevShowBoxList) => {
      const updatedShowBoxList = [...prevShowBoxList];
      updatedShowBoxList[index] = !updatedShowBoxList[index];
      return updatedShowBoxList;
    });
  };

  if (!data) {
    // Loading state or error handling can be added here
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Most Starred Repos</h1>
      {data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((repo, index) => (        <div key={repo.id}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              width: "65%",
              margin: "auto",
              justifyContent: "space-between",
              padding: "20px",
              background: "#f0f0f0",
              marginBottom: "20px",
            }}
          >
            <Avatar
              alt="User Avatar"
              src={repo.owner.avatar_url}
              sx={{
                width: 130,
                height: 130,
                marginRight: "20px",
                borderRadius: "0",
              }}
            />

            <CardContent sx={{ flexGrow: 1, textAlign: "left" }}>
              <Typography gutterBottom variant="h5">
                {repo.name}
              </Typography>
              <Typography variant="body2">{repo.description}</Typography>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography variant="body2" sx={{ width: "25%" }}>
                  <StarBorderOutlinedIcon fontSize="15px"/>{repo.stargazers_count}
                </Typography>
                <Typography variant="body2" sx={{ width: "25%" }}>
                  {repo.open_issues_count}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ width: "50%", textAlign: "right" }}
                >
                 Last Updated on: {new Date(repo.updated_at).toLocaleDateString()} by {repo.owner.login}
                </Typography>
              </Box>
            </CardContent>

            <Box>
              {showBoxList[index] ? (
                <KeyboardArrowUpOutlinedIcon onClick={() => handleToggle(index)} />
              ) : (
                <KeyboardArrowDownOutlinedIcon onClick={() => handleToggle(index)} />
              )}
            </Box>
          </Card>

          {showBoxList[index] && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "85%",
                  padding: "20px",
                  height: "500px",
                  background: "lightblue",
                }}
              >
                Box below the button
              </div>
            </Box>
          )}
        </div>
      ))}
       <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="secondary"
          variant="outlined"
          shape="rounded"
        />
      </Box>
    </div>
  );
};

export default StarredRepo;
