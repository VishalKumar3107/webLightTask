import React, { useState, useEffect } from "react";
import { Avatar, Box, Card, Typography, CardContent, Pagination } from "@mui/material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { Githubapi } from "../apiHandler/Githubapi";
import GithubActivityChart from "../apiHandler/Highcharts";

const StaredRepos = () => {
    const [data, setData] = useState([]);
    const [showBoxList, setShowBoxList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        Githubapi(currentPage).then((combinedData) => {
            setData(combinedData.items);
            setShowBoxList(Array(combinedData.items.length).fill(false));
        });
    }, [currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div>
            <Typography gutterBottom variant="h3" padding={"10px"} color="white" textAlign="center" fontFamily={"BlinkMacSystemFont"}>
                Most Starred Repos
            </Typography>

            {data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((repo, index) => (
                <div key={repo.id}>
                    <Card
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "95%",
                            height: "80px",
                            margin: "auto",
                            justifyContent: "space-between",
                            padding: "10px",
                            background: "#f0f0f0",
                            marginBottom: "10px",
                            borderRadius: "0",
                            "@media (max-width: 600px)": {
                                height: "auto",
                                width: "90%",
                                padding: "0px 16px",

                            },
                        }}
                    >
                        <Avatar
                            alt="User Avatar"
                            src={repo.owner.avatar_url}
                            sx={{
                                width: 80,
                                height: 80,
                                marginRight: "10px",
                                borderRadius: "0",
                                "@media (max-width: 600px)": {
                                    width: 50,
                                    height: 50,
                                },
                            }}
                        />

                        <CardContent sx={{ flexGrow: 1, textAlign: "left" }}>
                            <Typography gutterBottom variant="h5" fontSize="20px" color="#5C5470">
                                {repo.name}
                            </Typography>
                            <Typography variant="body2" fontSize={"12px"}>{repo.description}</Typography>
                            <Box sx={{ display: "flex", flexDirection: "row", fontSize: "12px", marginTop: "10px" }}>
                                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", width: "25%", fontSize: "12px" }}>
                                    <StarBorderOutlinedIcon fontSize="inherit" sx={{ marginRight: "5px", verticalAlign: "middle" }} />
                                    {repo.stargazers_count}
                                </Typography>


                                <Typography variant="body2" sx={{ width: "25%" }} fontSize="12px">
                                    {repo.open_issues_count}
                                </Typography>
                                <Typography variant="body2" sx={{ width: "50%", textAlign: "right" }} fontSize="12px">
                                    Last Updated on: {new Date(repo.updated_at).toLocaleDateString()} by {repo.owner.login}
                                </Typography>
                            </Box>
                        </CardContent>

                        <Box>
                            {showBoxList[index] ? (
                                <KeyboardArrowUpOutlinedIcon onClick={() => setShowBoxList((prev) => [...prev.slice(0, index), false, ...prev.slice(index + 1)])} />
                            ) : (
                                <KeyboardArrowDownOutlinedIcon onClick={() => setShowBoxList((prev) => [...prev.slice(0, index), true, ...prev.slice(index + 1)])} />
                            )}
                        </Box>
                    </Card>

                    {showBoxList[index] && (
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "-10px", width: "100%" }}>
                            <div
                                style={{
                                    width: "95%",
                                    padding: "10px",
                                    height: "auto",
                                    marginBottom: "20px",
                                    marginTop: "0px",
                                    paddingTop: "5px",
                                    background: "#DBD8E3",
                                }}
                            >
                                <GithubActivityChart owner={repo.owner.login} repo={repo.name} />
                            </div>
                        </Box>
                    )}
                </div>
            ))}

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Pagination
                    count={Math.ceil(data?.total_count / itemsPerPage) ?? 0}
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

export default StaredRepos;
