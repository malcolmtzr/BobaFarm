import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccount } from "../redux/accountSlice";
import getWeb3 from "../getWeb3"
import Web3 from "web3";
import Button from "@mui/material/Button";

export default function MetaMaskHandler(props) {

    const dispatch = useDispatch();

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountChange)
        }
    }, []);

    const handleAccountChange = (userAccount) => {
        dispatch(setAccount({
            account: userAccount[0]
        }));
    }

    const handleConnect = async () => {
        if (window.ethereum) {
            try {
                const response = await window.ethereum.request(
                    {
                        method: "eth_requestAccounts"
                    }
                );
                handleAccountChange(response);
                if (response.length !== 0) {
                    alert("Connected");
                }
            }
            catch (error) {
                alert("Check MetaMask extension")
            }
        }
        else {
            alert("Please install MetaMask");
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={handleConnect} sx={{width: "100%"}}>
                Connect to MetaMask
            </Button>
        </div>
    )
}