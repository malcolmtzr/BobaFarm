import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAccount } from "../redux/accountSlice";
import getWeb3 from "../getWeb3"
import Web3 from "web3";
import BobaToken from "../contracts/BobaToken.json";
import BobaFarm from "../contracts/BobaFarm.json";
import MilkToken2 from "../contracts/MilkToken2.json";
import TeaToken2 from "../contracts/TeaToken2.json";
import PearlToken2 from "../contracts/PearlToken2.json";
import MetaMaskHandler from "./MetaMaskHandler";
import StakingTable from "./StakingTable";
import { Box, Typography, Button } from "@mui/material";
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";

export default function Mainpage() {
    const dispatch = useDispatch();
    const account = useSelector((state) => state.account.value);
    const [account1, setAccount1] = useState("");
    const [bobaContract, setBobaContract] = useState("");
    const [bobaFarmContract, setBobaFarmContract] = useState("");
    const [milkToken2Contract, setMilkToken2Contract] = useState("");
    const [teaToken2Contract, setTeaToken2Contract] = useState("");
    const [pearlToken2Contract, setPearlToken2Contract] = useState("");
    const [stakingBalances, setStakingBalances] = useState(
        {
            milk2StakingBalance: 0,
            tea2StakingBalance: 0,
            pearl2StakingBalance: 0
        }
    );
    const [bobaBalance, setBobaBalance] = useState(0);
    const [openDialogue, setOpenDialogue] = useState(false);
    const [openHarvestDialogue, setOpenHarvestDialogue] = useState(false);
    const [loadingStaking, setLoadingStaking] = useState(false);
    const [loadingHarvest, setLoadingHarvest] = useState(false);

    const callGetWeb3 = async () => {
        return await getWeb3();
    }

    const loadAccount = async (web3) => {
        const account = await web3.eth.getAccounts();
        console.log(account);
        if (account) {
            setAccount1(account[0])
            return account[0];
        }
        else {
            alert("Please connect to MetaMask");
        }
    }

    const loadFarm = async (web3, account) => {
        console.log(account);
        const netId = await web3.eth.net.getId();
        const bobaFarmData = BobaFarm.networks[netId];
        if (bobaFarmData) {
            const bobaFarm = new web3.eth.Contract(BobaFarm.abi, bobaFarmData.address);
            console.log(bobaFarm);
            setBobaFarmContract(bobaFarm);
            const _milk2StakingBalance = await bobaFarm.methods.getMilkStakingBalance(account).call();
            const _tea2StakingBalance = await bobaFarm.methods.getTeaStakingBalance(account).call();
            const _pearl2StakingBalance = await bobaFarm.methods.getPearlStakingBalance(account).call();
            setStakingBalances(prevState => ({
                ...prevState,
                milk2StakingBalance: _milk2StakingBalance,
                tea2StakingBalance: _tea2StakingBalance,
                pearl2StakingBalance: _pearl2StakingBalance
            }));
            console.log(stakingBalances);
            //const _bobaBalance = await bobaFarm.methods.bobaBalance(account).call();
            //console.log(_bobaBalance);
            //setBobaBalance(_bobaBalance);
        }
        else {
            alert("BobaFarm contract not deployed to network");
        }
    }

    const loadTokens = async (web3, account) => {
        const netId = await web3.eth.net.getId();
        const bobaTokenData = BobaToken.networks[netId];
        const milkToken2Data = MilkToken2.networks[netId];
        const teaToken2Data = TeaToken2.networks[netId];
        const pearlToken2Data = PearlToken2.networks[netId];
        const bobaToken = new web3.eth.Contract(BobaToken.abi, bobaTokenData.address);
        const milkToken2 = new web3.eth.Contract(MilkToken2.abi, milkToken2Data.address);
        const teaToken2 = new web3.eth.Contract(TeaToken2.abi, teaToken2Data.address)
        const pearlToken2 = new web3.eth.Contract(PearlToken2.abi, pearlToken2Data.address);
        setBobaContract(bobaToken);
        setMilkToken2Contract(milkToken2);
        setTeaToken2Contract(teaToken2);
        setPearlToken2Contract(pearlToken2);
        const _bobaBalance = await bobaToken.methods.balanceOf(account).call();
        setBobaBalance(_bobaBalance);
        console.log(bobaToken);
        console.log(milkToken2);
        console.log(teaToken2);
        console.log(pearlToken2);
        
    }

    // const handleAccount = (account) => {
    //     console.log(account);
    //     setAccount(account);
    // }

    const handleStaking = async (stakingAmounts) => {
        setLoadingStaking(true);
        console.log(stakingAmounts);
        console.log(bobaFarmContract._address);
        console.log(milkToken2Contract._address)
        console.log(teaToken2Contract._address)
        console.log(pearlToken2Contract._address)
        if (stakingAmounts.stakeMilk2Amount == "0" || stakingAmounts.stakeTea2Amount == "0" ||
            stakingAmounts.stakePearl2Amount == "0") {
            handleDialogueOpen();
        }
        else {
            const toStakeMilk2 = stakingAmounts.stakeMilk2Amount;
            const toStakeTea2 = stakingAmounts.stakeTea2Amount;
            const toStakePearl2 = stakingAmounts.stakePearl2Amount;
            try {
                const milk2Tx = await milkToken2Contract.methods.approve(bobaFarmContract._address, toStakeMilk2).send({from: account1});
                const tea2Tx = await teaToken2Contract.methods.approve(bobaFarmContract._address, toStakeTea2).send({from: account1});
                const pearl2Tx = await pearlToken2Contract.methods.approve(bobaFarmContract._address, toStakePearl2).send({from: account1});
                await bobaFarmContract.methods.stakeTokens(toStakeMilk2, toStakeTea2, toStakePearl2).send({from: account1});
                console.log(milk2Tx);
                console.log(tea2Tx);
                console.log(pearl2Tx);
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoadingStaking(false);
            }
        }
    }

    const handleHarvest = async () => {
        try {
            setLoadingHarvest(true);
            await bobaFarmContract.methods.harvestRewards().send({from: account1})
            .then(function(receipt) {
                console.log(receipt);
            });
            setLoadingHarvest(false);
        }
        catch (err) {
            handleHarvestDialogueOpen();
            setLoadingHarvest(false);
        }
    }

    const handleDialogueOpen = () => {
        setOpenDialogue(true);
    }
  
    const handleDialogueClose = () => {
        setOpenDialogue(false);
    }

    const handleHarvestDialogueOpen = () => {
        setOpenHarvestDialogue(true);
    }
  
    const handleHarvestDialogueClose = () => {
        setOpenHarvestDialogue(false);
    }

    useEffect(() => {
        const loadBlockchainData = async () => {
            console.log(account);
            const web3 = await callGetWeb3();
            const acc = await loadAccount(web3);
            await loadFarm(web3, acc);
            await loadTokens(web3, acc);
        }
        loadBlockchainData();
    }, [account])

    return (
        <Box>
            <Box sx={{display: "grid", alignItems: "center", justifyContent: "center", paddingTop: "50px"}}>
                <Typography variant="h3" gutterBottom>BOBA FARM</Typography>
                <MetaMaskHandler/>
            </Box>
            <Box sx={{display: "grid", alignItems: "center", justifyContent: "center", paddingTop: "40px"}}>
                <StakingTable 
                onStake={handleStaking} 
                onHarvest={handleHarvest} 
                onStakingBalances={stakingBalances}
                onRewardBalance={bobaBalance} 
                onLoadingHarvest={loadingHarvest} 
                onLoadingStaking={loadingStaking}/>
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

            <Dialog
            open={openHarvestDialogue}
            onClose={handleHarvestDialogueClose}
            >
                <DialogTitle>
                    No Rewards
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        There are currently no rewards to harvest
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleHarvestDialogueClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}