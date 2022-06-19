import React, { useState, useEffect } from "react";
import getWeb3 from "../getWeb3"
import Web3 from "web3";
import MetaMaskHandler from "./MetaMaskHandler";
import StakingTable from "./StakingTable";
import { Box, Typography, Button } from "@mui/material";
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";

export default function Mainpage() {

    const [account, setAccount] = useState("");
    const [openDialogue, setOpenDialogue] = useState(false);

    const handleAccount = (account) => {
        console.log(account);
        setAccount(account);
    }

    const handleStaking = (stakingAmounts) => {
        console.log(stakingAmounts);
        if (stakingAmounts.stakeMilk2Amount === "0" || stakingAmounts.stakeTea2Amount === "0" ||
            stakingAmounts.stakePearl2Amount === "0") {
            handleDialogueOpen();
        }
        else {
            
        }
    }

    const handleHarvest = () => {
        console.log("Harvest!");
    }

    const handleDialogueOpen = () => {
        setOpenDialogue(true);
      };
  
      const handleDialogueClose = () => {
        setOpenDialogue(false);
      };


    return (
        <Box>
            <Box sx={{display: "grid", alignItems: "center", justifyContent: "center", paddingTop: "50px"}}>
                <Typography variant="h3" gutterBottom>BOBA FARM</Typography>
                <MetaMaskHandler onConnect={handleAccount}/>
            </Box>
            <Box sx={{display: "grid", alignItems: "center", justifyContent: "center", paddingTop: "40px"}}>
                <StakingTable onStake={handleStaking} onHarvest={handleHarvest}/>
            </Box>

            <Dialog
            open={openDialogue}
            onClose={handleDialogueClose}
            >
                <DialogTitle>
                    Invalid Staking Amount
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Cannot stake 0 of any tokens
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogueClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}