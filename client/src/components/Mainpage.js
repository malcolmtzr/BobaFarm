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
            milk2StakingBalance: "",
            tea2StakingBalance: "",
            pearl2StakingBalance: ""
        }
    );
    const [bobaBalance, setBobaBalance] = useState(0);
    const [openDialogue, setOpenDialogue] = useState(false);
    const [openHarvestDialogue, setOpenHarvestDialogue] = useState(false);
    const [loadingStaking, setLoadingStaking] = useState(false);
    const [loadingHarvest, setLoadingHarvest] = useState(false);
    const [isUpdatingStakeBalances, setIsUpdatingStakeBalances] = useState(false);

    const callGetWeb3 = async () => {
        return await getWeb3();
    }

    const loadAccount = async (web3) => {
        const account = await web3.eth.getAccounts();
        if (account) {
            setAccount1(account[0])
            return account[0];
        }
        else {
            alert("Please connect to MetaMask");
        }
    }

    const handleAccountChange = (...args) => {
        const accounts = args[0];
        if (accounts.length === 0) {
          console.log("Please connect to MetaMask");
        }
        else if (accounts[0] !== account1) {
          setAccount1(accounts[0]);
          window.location.reload(false);
        }
      };

    const loadFarm = async (web3, account) => {
        const netId = await web3.eth.net.getId();
        const bobaFarmData = BobaFarm.networks[netId];
        if (bobaFarmData) {
            const bobaFarm = new web3.eth.Contract(BobaFarm.abi, bobaFarmData.address);
            setBobaFarmContract(bobaFarm);
        }
        else {
            alert("BobaFarm contract not deployed to network, please change to Ropsten Testnet Newtwork and refresh");
        }
    }

    const loadTokens = async (web3, account) => {
        try {
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
        }
        catch (err) {
            console.log("Check Network");
        }
    }

    const handleStaking = async (stakingAmounts) => {
        console.log(stakingAmounts);
        setLoadingStaking(true);
        if (stakingAmounts.stakeMilk2Amount == "0" || stakingAmounts.stakeTea2Amount == "0" ||
            stakingAmounts.stakePearl2Amount == "0") {
            handleDialogueOpen();
            setLoadingStaking(false);
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
                const _bobaBalance = await bobaContract.methods.balanceOf(account1).call();
                setBobaBalance(_bobaBalance);
            }
            catch (err) {
                console.log(err);
                alert("Error with MetaMask");
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
            const _bobaBalance = await bobaContract.methods.balanceOf(account1).call();
            setBobaBalance(_bobaBalance);
            setLoadingHarvest(false);
        }
        catch (err) {
            handleHarvestDialogueOpen();
            setLoadingHarvest(false);
        }
    }

    //Not implemented
    // const handleUnstake = async () => {
    // }

    const getStakeBalances = async() => {
        setIsUpdatingStakeBalances(true);
        try {
            const _milk2StakingBalance = await bobaFarmContract.methods.getMilkStakingBalance(account1).call({});
            const _tea2StakingBalance = await bobaFarmContract.methods.getTeaStakingBalance(account1).call({});
            const _pearl2StakingBalance = await bobaFarmContract.methods.getPearlStakingBalance(account1).call({});
            setStakingBalances(prevState => ({
                ...prevState,
                milk2StakingBalance: _milk2StakingBalance,
                tea2StakingBalance: _tea2StakingBalance,
                pearl2StakingBalance: _pearl2StakingBalance
            }));
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        catch (err) {
            console.log(err);
            alert("Error with MetaMask");
        }
        finally {
            setIsUpdatingStakeBalances(false);
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
            //console.log(account);
            const web3 = await callGetWeb3();
            const acc = await loadAccount(web3);
            await loadFarm(web3, acc);
            await loadTokens(web3, acc);
        }
        loadBlockchainData();
    }, [account])

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountChange);
            return () => {
                window.ethereum.removeListener("accountsChanged", handleAccountChange);
            }
        }
        else {
            alert("Please install MetaMask!");
        }
      }, [account1])

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
                onLoadingStaking={loadingStaking}
                onUpdateStakeBalances={getStakeBalances}
                onUpdatingStakeBalances={isUpdatingStakeBalances}/>
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
                        Error with MetaMask
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleHarvestDialogueClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}