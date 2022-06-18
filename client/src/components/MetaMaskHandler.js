import React, { useState, useEffect } from "react";
import getWeb3 from "../getWeb3"
import Web3 from "web3";
import Button from "@mui/material/Button";

export default function MetaMaskHandler(props) {

    const [account, setAccount] = useState("");

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountChange)
        }
    }, []);

    useEffect(() => {
        props.onConnect(account);
    }, [account]);

    const handleAccountChange = async (userAccount) => {
        setAccount(userAccount[0]);
    }

    const handleConnect = async () => {
        if (window.ethereum) {
            try {
                const response = await window.ethereum.request(
                    {
                        method: "eth_requestAccounts"
                    }
                );
                //console.log(response);
                handleAccountChange(response);
                if (response.length !== 0) {
                    alert("You are already connected to MetaMask");
                }
            }
            catch (error) {
                alert("Error connecting to MetaMask")
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