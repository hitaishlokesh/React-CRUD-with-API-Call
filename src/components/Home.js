import React from "react";
import { Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { grey } from "@mui/material/colors";
import Table from "./Table"

const useStyles = makeStyles({
    headingColor: {
      backgroundColor: grey[900],
      color: "white",
    },
  });

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Box textAlign="center" className={classes.headingColor} p={2} mb={2}>
        <Typography variant="h2">React CRUD with API Call</Typography>
      </Box>
      <Table/>
    </>
  );
}
