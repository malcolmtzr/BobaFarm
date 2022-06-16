import React, { useState, useEffect } from "react";
import getWeb3 from "../getWeb3"
import Web3 from "web3";
import Button from "@mui/material/Button";

export default function MetaMaskHandler() {

    const [account, setAccount] = useState("");

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountChange)
        }
    }, []);

    useEffect(() => {

    }, []);

    const handleAccountChange = async (userAccount) => {
        setAccount(userAccount);
    }

    const handleConnect = async () => {
        if (window.ethereum) {
            try {
                const response = await window.ethereum.request(
                    {
                        method: "eth_requestAccounts"
                    }
                );
                console.log(response[0]);
                handleAccountChange(response[0]);
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
            <Button variant="contained" onClick={handleConnect}>
                Connect
            </Button>
        </div>
    )
}