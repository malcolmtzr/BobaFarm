import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccount } from "../redux/accountSlice";
import getWeb3 from "../getWeb3"
import Web3 from "web3";
import Button from "@mui/material/Button";

export default function MetaMaskHandler(props) {

    //const [account, setAccount] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountChange)
        }
    }, []);

    // useEffect(() => {
    //     props.onConnect(account);
    // }, [account]);

    const handleAccountChange = (userAccount) => {
        //setAccount(userAccount[0]);
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
                //console.log(response);
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