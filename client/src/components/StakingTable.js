import React, { useState, useEffect, useRef } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import SpaIcon from '@mui/icons-material/Spa';
import GrainIcon from '@mui/icons-material/Grain';


export default function StakingTable(props) {

    const [bobaToken, setBobaToken] = useState("");
    const [milkToken2, setMilkToken2] = useState("");
    const [teaToken2, setTeaToken2] = useState("");
    const [pearlToken2, setPearlToken2] = useState("");

    //const [stakeMilkToken2Amt, setStakeMilkToken2Amt] = useState(0);
    //const [stakeTeaToken2Amt, setStakeTeaToken2Amt] = useState(0);
    //const [stakePearlToken2Amt, setPearlToken2Amt] = useState(0);

    const [stakingAmounts, setStakingAmounts] = useState(
        {
            stakeMilk2Amount: 0,
            stakeTea2Amount: 0,
            stakePearl2Amount: 0
        }
    );

    const [bobaTokenAmount, setBobaTokenAmount] = useState(0);

    const milk2Input = useRef(null);
    const tea2Input = useRef(null);
    const pearl2Input = useRef(null);

    const [milk2InputError, setMilk2InputError] = useState(false);
    const [tea2InputError, setTea2InputError] = useState(false);
    const [pearl2InputError, setPearl2InputError] = useState(false);

    const [milk2ErrorText, setMilk2ErrorText] = useState("");
    const [tea2ErrorText, setTea2ErrorText] = useState("");
    const [pearl2ErrorText, setPearl2ErrorText] = useState("");
    
    useEffect( async () => {
        //setMilkToken2();
        //setTeaToken2();
        //setPearlToken2();
    }, []);

    const onStakeMilk2Change = (event) => {
        let regex = new RegExp("^\\d+$");
        let isValid = regex.test(event.target.value);
        if (!isValid) {
            setMilk2InputError(true);
            setMilk2ErrorText("Invalid input");
        }
        else {
            setMilk2InputError(false);
            setMilk2ErrorText("");
            setStakingAmounts(prevState => ({
                ...prevState,
                stakeMilk2Amount: event.target.value
            })
            );
        }
    };

    const onStakeTea2Change = (event) => {
        let regex = new RegExp("^\\d+$");
        let isValid = regex.test(event.target.value);
        if (!isValid) {
            setTea2InputError(true);
            setTea2ErrorText("Invalid input");
        }
        else {
            setTea2InputError(false);
            setTea2ErrorText("");
            setStakingAmounts(prevState => ({
                ...prevState,
                stakeTea2Amount: event.target.value
            })
            );
        }
    };

    const onStakePearl2Change = (event) => {
        let regex = new RegExp("^\\d+$");
        let isValid = regex.test(event.target.value);
        if (!isValid) {
            setPearl2InputError(true);
            setPearl2ErrorText("Invalid input");
        }
        else {
            setPearl2InputError(false);
            setPearl2ErrorText("");
            setStakingAmounts(prevState => ({
                ...prevState,
                stakePearl2Amount: event.target.value
            })
            );
        }
    };

    const onStake = () => {
        props.onStake(stakingAmounts);
    };

    const onHarvest = () => {
        props.onHarvest();
    };

    return(
        <Box sx={{display: "grid", justifyItems: "center"}}>
            <Typography variant="h5">Tokens</Typography>
            <Divider style={{width: "100%"}}/>
            <Grid container spacing={25} paddingTop="10px">
                <Grid item xs={4}>
                    <Card raised sx={{minWidth: 170}}>
                        <CardContent sx={{display: "grid", justifyItems: "center"}}>
                            <Typography variant="h6">
                                MILK2
                            </Typography>
                            <LocalDrinkIcon fontSize="large" sx={{paddingTop: "10px"}}/>
                        </CardContent>
                        <CardActions>
                            <Box sx={{display: "grid", justifyItems: "center"}}>
                                <Typography variant="button">
                                    Stake Token:
                                </Typography>
                                <TextField 
                                type="number" 
                                id="stakeMilk2Value" 
                                size="small" 
                                variant="outlined" 
                                label="Amount" 
                                onChange={onStakeMilk2Change} 
                                inputRef={milk2Input} 
                                error={milk2InputError} 
                                helperText={milk2ErrorText}/>
                            </Box>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card raised sx={{minWidth: 170}}>
                        <CardContent sx={{display: "grid", justifyItems: "center"}}>
                            <Typography variant="h6">
                                TEA2
                            </Typography>
                            <SpaIcon fontSize="large" sx={{paddingTop: "10px"}}/>
                        </CardContent>
                        <CardActions>
                            <Box sx={{display: "grid", justifyItems: "center"}}>
                                <Typography variant="button">
                                    Stake Token:
                                </Typography>
                                <TextField 
                                type="number" 
                                id="stakeTea2Value" 
                                size="small"  
                                variant="outlined" 
                                label="Amount" 
                                onChange={onStakeTea2Change} 
                                inputRef={tea2Input} 
                                error={tea2InputError} 
                                helperText={tea2ErrorText}/>
                            </Box>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card raised sx={{minWidth: 170}}>
                        <CardContent sx={{display: "grid", justifyItems: "center"}}>
                            <Typography variant="h6">
                                PEARL2
                            </Typography>
                            <GrainIcon fontSize="large" sx={{paddingTop: "10px"}}/>
                        </CardContent>
                        <CardActions>
                            <Box sx={{display: "grid", justifyItems: "center"}}>
                                <Typography variant="button">
                                    Stake Token:
                                </Typography>
                                <TextField 
                                type="number" 
                                id="stakePearl2Value" 
                                size="small"  
                                variant="outlined" 
                                label="Amount" 
                                onChange={onStakePearl2Change} 
                                inputRef={pearl2Input} 
                                error={pearl2InputError} 
                                helperText={pearl2ErrorText}/>
                            </Box>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <Divider style={{width: "100%", paddingTop:"10px"}}/>
            <Box sx={{display: "grid", justifyItems: "center", paddingTop: "10px", width: "100%"}}>
                <Button variant="contained" fullWidth onClick={onStake}>Stake Tokens</Button>
            </Box>
            <Typography variant="h5" sx={{paddingTop: "40px"}}>Rewards</Typography>
            <Divider style={{width: "100%"}}/>
            <Box sx={{display: "grid", justifyItems: "center", paddingTop: "10px", width: "100%"}}>
                <Button variant="contained" fullWidth onClick={onHarvest}>Harvest Rewards</Button>
            </Box>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-evenly", paddingTop: "10px", width: "100%"}}>
                <Typography variant="h5" sx={{paddingTop: "20px"}}>Rewards: </Typography>
                <Typography variant="h5" sx={{paddingTop: "20px"}}>{bobaTokenAmount} BOBA</Typography>
            </Box>
        </Box>
    )
}