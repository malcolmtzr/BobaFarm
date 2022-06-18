import React, { useState, useEffect } from "react";
import getWeb3 from "../getWeb3"
import Web3 from "web3";
import MetaMaskHandler from "./MetaMaskHandler";
import { Box, Typography } from "@mui/material";

export default function Mainpage() {

    const [account, setAccount] = useState("");

    const handleAccount = (account) => {
        console.log(account);
        setAccount(account);
    }


    return (
        <Box>
            <Box sx={{display: "grid", alignItems: "center", justifyContent: "center", paddingTop: "50px"}}>
                <Typography variant="h3" gutterBottom>BOBA FARM</Typography>
                <MetaMaskHandler onConnect={handleAccount}/>
            </Box>
            <Box sx={{display: "grid", alignItems: "center", justifyContent: "center", paddingTop: "40px"}}>
                Hello
            </Box>
            
        </Box>
    )
}