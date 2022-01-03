// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.1/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.1/contracts/utils/math/SafeMath.sol";

// File: contracts/interfaces/IUniswapV2Router01.sol

pragma solidity >=0.6.2;

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}


pragma solidity >=0.6.2;


interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

// pragma solidity >=0.5.0;

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}


pragma solidity >=0.5.0;

interface IUniswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address) external;
}

struct Cost {
    address materialAddress;
    uint amount;
}

interface CommunityItem {
    function mint(address account, uint256 amount) external;
}

contract CommunityCrafting {
    using SafeMath for uint256;

    IUniswapV2Router02 public immutable uniswapV2Router;

    address private sunflowerTeam;

    struct CommunityRecipe {
        address itemAddress;
        uint sff;
        address owner;
        bool exists;
        uint createdAt;
    }

    mapping(address => CommunityRecipe) recipes;


    constructor() {
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);

        // set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;

        sunflowerTeam = msg.sender;
    }

    function createRecipe(address itemAddress, uint sff, address owner) public {
        require(!recipes[itemAddress].exists, "RECIPE_ALREADY_EXISTS");
        require(sff > 0, "COMMUNITY_RECIPE_REQUIRES_AMOUNT");

        recipes[itemAddress] = CommunityRecipe({
            itemAddress: itemAddress,
            sff: sff,
            owner: owner,
            exists: true,
            createdAt: block.timestamp
        });
    }


    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    function craft(address recipeAddress) public payable {
        // Grab the SFF cost
        CommunityRecipe memory recipe = recipes[recipeAddress];

        require(recipe.exists, "COMMUNITY_RECIPE_DOES_NOT_EXIST");

        payOut(recipe.sff, recipe.owner);

        CommunityItem(recipeAddress).mint(msg.sender, 1);
    }

    function payOut(uint sff, address owner) public payable {
        address[] memory path = new address[](2);
        // Sunflower Token
        path[0] = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
        // WETH
        path[1] = 0xdf9B4b57865B403e08c85568442f95c26b7896b0;

        uint[] memory values = uniswapV2Router.getAmountsIn(sff, path);

        // 20% to designer, 5% to team
        uint totalEth = values[0].mul(125).div(100);
        require(msg.value >= totalEth, "INSUFFICENT_ETH");

        // Transfer tokens to this contract so we can provide liquidity
        ERC20(0xdf9B4b57865B403e08c85568442f95c26b7896b0).transferFrom(msg.sender, address(this), values[1]);
        // Approve the router just in case
        ERC20(0xdf9B4b57865B403e08c85568442f95c26b7896b0).approve(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff, values[1]);

        (uint amountToken, uint amountETH, uint liquidity) = uniswapV2Router.addLiquidityETH{ value: values[0] }(
            0xdf9B4b57865B403e08c85568442f95c26b7896b0,
            // Sunflower Tokens to use
            values[1],
            0, 
            0,
            0x000000000000000000000000000000000000dEaD,
            block.timestamp
        );

        uint ethLeftover = msg.value.sub(amountETH);

        // 80% of leftover to designer
        uint designerCommission = ethLeftover.mul(80).div(100);
        (bool sent, bytes memory data) = owner.call{value: designerCommission}("");
        require(sent, "DESIGNER_COMMISION_FAILED");

        uint sunflowerCommision = ethLeftover - designerCommission;
        (bool sentTeam, bytes memory data2) = sunflowerTeam.call{value: sunflowerCommision}("");
        require(sentTeam, "TEAM_COMMISION_FAILED");
    }

    function getRecipe(address recipe) public view returns (CommunityRecipe memory) {
        return recipes[recipe];
    }
}
