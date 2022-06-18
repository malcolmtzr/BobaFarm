pragma solidity ^0.8.7;

import "./BobaToken.sol";
import "./MilkToken.sol";
import "./TeaToken.sol";
import "./PearlToken.sol";
import "./MilkToken2.sol";
import "./TeaToken2.sol";
import "./PearlToken2.sol";
//import "./MilkTokenSwap.sol";
//import "./TeaTokenSwap.sol";
//import "./PearlTokenSwap.sol";

contract BobaFarm {

    string public name = "BobaFarm";

    //map useraddress to the following values
    mapping(address => uint256) public bobaBalance;
    mapping(address => uint256) public startBlock;
    mapping(address => uint256) public milkStakingBalance;
    mapping(address => uint256) public teaStakingBalance;
    mapping(address => uint256) public pearlStakingBalance;
    mapping(address => bool) public staking;

    //Reward token
    BobaToken public bobaToken;
    uint256 private rewardTokensPerBlock;

    //LP tokens
    MilkToken2 public milkToken;
    TeaToken2 public teaToken;
    PearlToken2 public pearlToken;

    //events
    //event Stake(address indexed from, uint256 amount, string token);
    //event Unstake(address indexed from, uint256 amount, string token);
    event Stake(address indexed from, string lp1, uint256 amountLp1, string lp2, uint256 amountLp2, string lp3, uint256 amountLp3);
    event Unstake(address indexed from, string lp1, uint256 amountLp1, string lp2, uint256 amountLp2, string lp3, uint256 amountLp3);
    event HarvestRewards(address indexed to, uint256 amount);

    constructor(BobaToken _bobaToken, MilkToken2 _milkToken, TeaToken2 _teaToken, PearlToken2 _pearlToken) {
        rewardTokensPerBlock = 200;
        bobaToken = _bobaToken;
        milkToken = _milkToken;
        teaToken = _teaToken;
        pearlToken = _pearlToken;
    }

    //function addTokensToFarm(MilkToken2 _milkToken, TeaToken2 _teaToken, PearlToken2 _pearlToken) public {
    //    milkToken = _milkToken;
    //    teaToken = _teaToken;
    //    pearlToken = _pearlToken;
    //}

    function stakeTokens(uint256 milkAmount, uint256 teaAmount, uint256 pearlAmount) public {
        require(milkAmount > 0 && milkToken.balanceOf(msg.sender) >= milkAmount &&
                teaAmount > 0 && teaToken.balanceOf(msg.sender) >= teaAmount &&
                pearlAmount > 0 && pearlToken.balanceOf(msg.sender) >= pearlAmount,
                "Cannot stake zero LP tokens to the farm / User must own enough LP tokens as specified");

        //check if user has already staked LP tokens, if true add unrealized yield to reward balance (bobaBalance).
        //ensure accumulated yield is always captured.
        if (staking[msg.sender] == true) {
            uint256 amtToTransferToRewards = getCurrentYield(msg.sender);
            bobaBalance[msg.sender] += amtToTransferToRewards;
        }

        milkToken.transferFrom(msg.sender, address(this), milkAmount);
        teaToken.transferFrom(msg.sender, address(this), teaAmount);
        pearlToken.transferFrom(msg.sender, address(this), pearlAmount);

        milkStakingBalance[msg.sender] += milkAmount;
        teaStakingBalance[msg.sender] += teaAmount;
        pearlStakingBalance[msg.sender] += pearlAmount;

        startBlock[msg.sender] = block.number;
        staking[msg.sender] = true;

        //Award users rewards token when they stake to farm
        uint256 stakingRewards = rewardTokensPerBlock;
        bobaToken.mint(msg.sender, stakingRewards);

        //emit Stake(msg.sender, milkAmount, "MILK");
        //emit Stake(msg.sender, teaAmount, "TEA");
        //emit Stake(msg.sender, pearlAmount, "PEARL");
        emit Stake(msg.sender, "MILK", milkAmount, "TEA", teaAmount, "PEARL", pearlAmount);
    }

    function unstakeTokens(uint256 milkAmount, uint256 teaAmount, uint256 pearlAmount) public {
        require(staking[msg.sender] == true && milkStakingBalance[msg.sender] >= milkAmount &&
                teaStakingBalance[msg.sender] >= teaAmount && pearlStakingBalance[msg.sender] >= pearlAmount,
                "No LP tokens to unstake");
        
        //ensure accumulated yield is captured.
        uint256 amtToTransferToRewards = getCurrentYield(msg.sender);
        bobaBalance[msg.sender] += amtToTransferToRewards;

        uint256 milkTransferAmount = milkAmount;
        uint256 teaTransferAmount = teaAmount;
        uint256 pearlTransferAmount = pearlAmount;

        //reset amounts (prevent re-entrancy)
        milkAmount = 0;
        teaAmount = 0;
        pearlAmount = 0;

        milkStakingBalance[msg.sender] -= milkTransferAmount;
        milkToken.transfer(msg.sender, milkTransferAmount);
        teaStakingBalance[msg.sender] -= teaTransferAmount;
        teaToken.transfer(msg.sender, teaTransferAmount);
        pearlStakingBalance[msg.sender] -= pearlTransferAmount;
        pearlToken.transfer(msg.sender, pearlTransferAmount);

        if (milkStakingBalance[msg.sender] == 0 || teaStakingBalance[msg.sender] == 0 || pearlStakingBalance[msg.sender] == 0) {
            staking[msg.sender] = false;
        }

        startBlock[msg.sender] = block.number;

        //emit Unstake(msg.sender, milkTransferAmount, "MILK");
        //emit Unstake(msg.sender, teaTransferAmount, "TEA");
        //emit Unstake(msg.sender, pearlTransferAmount, "PEARL");
        emit Unstake(msg.sender, "MILK", milkAmount, "TEA", teaAmount, "PEARL", pearlAmount);
    }

    function getCurrentYield(address user) public view returns (uint256) {
        uint256 endBlock = block.number;
        uint256 numBlocksSince = endBlock - startBlock[user];
        uint256 milkTokenYield = milkStakingBalance[user] * 50 / 100;
        uint256 teaTokenYield = teaStakingBalance[user] * 30 / 100;
        uint256 pearlTokenYield = pearlStakingBalance[user] * 20 / 100;
        uint256 totalYield = numBlocksSince * (milkTokenYield + teaTokenYield + pearlTokenYield);
        return totalYield;
    }

    function harvestRewards() public {
        //ensure accumulated yield is captured
        uint256 amtToTransferToRewards = getCurrentYield(msg.sender);
        require(amtToTransferToRewards > 0 || bobaBalance[msg.sender] > 0, "No rewards to harvest");
        
        uint256 rewardsAmount = amtToTransferToRewards;

        if (bobaBalance[msg.sender] != 0) {
            uint256 currentRewards = bobaBalance[msg.sender];
            //reset (prevent re-entrancy)
            bobaBalance[msg.sender] = 0;
            rewardsAmount = amtToTransferToRewards + currentRewards;
        }

        startBlock[msg.sender] = block.number;
        bobaToken.mint(msg.sender, rewardsAmount);

        emit HarvestRewards(msg.sender, rewardsAmount);
    }
}