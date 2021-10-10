pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

//import "@openzeppelin/contracts/math/Math.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/math/Math.sol";

import "./Token.sol";

contract Farm {
    using SafeMath for uint256;

    Token private token;

    struct Square {
        Fruit fruit;
        uint createdAt;
    }

    mapping(address => Square[]) fields;
    mapping(address => uint) syncedAt;

    mapping(address => uint) rewardsOpenedAt;

    constructor(Token _token) public {
        token = _token;
    }

    event FarmCreated(address indexed _address);
    event FarmSynced(address indexed _address);

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    function createFarm(address payable _charity) public payable {
        require(syncedAt[msg.sender] == 0, "FARM_EXISTS");

        uint decimals = token.decimals();

        require(
            // Donation must be at least $0.10 to play
            msg.value >= 1 * 10**(decimals - 1),
            "INSUFFICIENT_DONATION"
        );

        require(
            // The Water Project - double check
            _charity == address(0x060697E9d4EEa886EbeCe57A974Facd53A40865B)
            // Heifer
            || _charity == address(0xD3F81260a44A1df7A7269CF66Abd9c7e4f8CdcD1)
            // Cool Earth
            || _charity == address(0x3c8cB169281196737c493AfFA8F49a9d823bB9c5),
            "INVALID_CHARITY"
        );


        Square[] storage land = fields[msg.sender];
        Square memory empty = Square({
            fruit: Fruit.None,
            createdAt: 0
        });
        Square memory sunflower = Square({
            fruit: Fruit.Sunflower,
            createdAt: 0
        });

        // Each farmer starts with 5 fields & 3 Sunflowers
        land.push(empty);
        land.push(sunflower);
        land.push(sunflower);
        land.push(sunflower);
        land.push(empty);

        syncedAt[msg.sender] = block.timestamp;

        (bool sent, bytes memory data) = _charity.call{value: msg.value}("");
        require(sent, "DONATION_FAILED");

        //Emit an event
        emit FarmCreated(msg.sender);
    }
    
    function lastSyncedAt() private view returns(uint) {
        return syncedAt[msg.sender];
    }


    function getLand() public view returns (Square[] memory) {
        return fields[msg.sender];
    }

    enum Action { Plant, Harvest }
    enum Fruit { None, Sunflower, Potato, Pumpkin, Beetroot, Cauliflower, Parsnip, Radish }

    struct Event { 
        Action action;
        Fruit fruit;
        uint landIndex;
        uint createdAt;
    }

    struct Farm {
        Square[] land;
        uint balance;
    }

    function getHarvestSeconds(Fruit _fruit) private pure returns (uint) {
        if (_fruit == Fruit.Sunflower) {
            // 1 minute
            return 1 * 60;
        } else if (_fruit == Fruit.Potato) {
            // 5 minutes
            return 5 * 60;
        } else if (_fruit == Fruit.Pumpkin) {
            // 1 hour
            return 1  * 60 * 60;
        } else if (_fruit == Fruit.Beetroot) {
            // 4 hours
            return 4 * 60 * 60;
        } else if (_fruit == Fruit.Cauliflower) {
            // 8 hours
            return 8 * 60 * 60;
        } else if (_fruit == Fruit.Parsnip) {
            // 1 day
            return 24 * 60 * 60;
        } else if (_fruit == Fruit.Radish) {
            // 3 days
            return 3 * 24 * 60 * 60;
        }

        require(false, "INVALID_FRUIT");
        return 9999999;
    }

    function getSeedPrice(Fruit _fruit) private view returns (uint price) {
        uint decimals = token.decimals();

        if (_fruit == Fruit.Sunflower) {
            //$0.01
            return 1 * 10**decimals / 100;
        } else if (_fruit == Fruit.Potato) {
            // $0.10
            return 10 * 10**decimals / 100;
        } else if (_fruit == Fruit.Pumpkin) {
            // $0.40
            return 40 * 10**decimals / 100;
        } else if (_fruit == Fruit.Beetroot) {
            // $1
            return 1 * 10**decimals;
        } else if (_fruit == Fruit.Cauliflower) {
            // $4
            return 4 * 10**decimals;
        } else if (_fruit == Fruit.Parsnip) {
            // $10
            return 10 * 10**decimals;
        } else if (_fruit == Fruit.Radish) {
            // $50
            return 50 * 10**decimals;
        }

        require(false, "INVALID_FRUIT");

        return 100000 * 10**decimals;
    }

    function getFruitPrice(Fruit _fruit) private view returns (uint price) {
        uint decimals = token.decimals();

        if (_fruit == Fruit.Sunflower) {
            // $0.02
            return 2 * 10**decimals / 100;
        } else if (_fruit == Fruit.Potato) {
            // $0.16
            return 16 * 10**decimals / 100;
        } else if (_fruit == Fruit.Pumpkin) {
            // $0.80
            return 80 * 10**decimals / 100;
        } else if (_fruit == Fruit.Beetroot) {
            // $1.8
            return 180 * 10**decimals / 100;
        } else if (_fruit == Fruit.Cauliflower) {
            // $8
            return 8 * 10**decimals;
        } else if (_fruit == Fruit.Parsnip) {
            // $16
            return 16 * 10**decimals;
        } else if (_fruit == Fruit.Radish) {
            // $80
            return 80 * 10**decimals;
        }

        require(false, "INVALID_FRUIT");

        return 0;
    }
    
    function requiredLandSize(Fruit _fruit) private pure returns (uint size) {
        if (_fruit == Fruit.Sunflower || _fruit == Fruit.Potato) {
            return 5;
        } else if (_fruit == Fruit.Pumpkin || _fruit == Fruit.Beetroot) {
            return 8;
        } else if (_fruit == Fruit.Cauliflower) {
            return 11;
        } else if (_fruit == Fruit.Parsnip) {
            return 14;
        } else if (_fruit == Fruit.Radish) {
            return 17;
        }

        require(false, "INVALID_FRUIT");

        return 99;
    }
    
       
    function getLandPrice(uint landSize) private view returns (uint price) {
        uint decimals = token.decimals();
        if (landSize <= 5) {
            // $1
            return 1 * 10**decimals;
        } else if (landSize <= 8) {
            // 50
            return 50 * 10**decimals;
        } else if (landSize <= 11) {
            // $500
            return 500 * 10**decimals;
        }
        
        // $2500
        return 2500 * 10**decimals;
    }

    modifier hasFarm {
        require(lastSyncedAt() > 0, "NO_FARM");
        _;
    }
     
    uint private THIRTY_MINUTES = 30 * 60;

    function buildFarm(Event[] memory _events) private view hasFarm returns (Farm memory currentFarm) {
        Square[] memory land = fields[msg.sender];
        uint balance = token.balanceOf(msg.sender);
        
        for (uint index = 0; index < _events.length; index++) {
            Event memory farmEvent = _events[index];

            uint thirtyMinutesAgo = block.timestamp.sub(THIRTY_MINUTES); 
            require(farmEvent.createdAt >= thirtyMinutesAgo, "EVENT_EXPIRED");
            require(farmEvent.createdAt >= lastSyncedAt(), "EVENT_IN_PAST");
            require(farmEvent.createdAt <= block.timestamp, "EVENT_IN_FUTURE");

            if (index > 0) {
                require(farmEvent.createdAt >= _events[index - 1].createdAt, "INVALID_ORDER");
            }

            if (farmEvent.action == Action.Plant) {
                require(land.length >= requiredLandSize(farmEvent.fruit), "INVALID_LEVEL");
                
                uint price = getSeedPrice(farmEvent.fruit);
                uint fmcPrice = getMarketPrice(price);
                require(balance >= fmcPrice, "INSUFFICIENT_FUNDS");

                balance = balance.sub(fmcPrice);

                Square memory plantedSeed = Square({
                    fruit: farmEvent.fruit,
                    createdAt: farmEvent.createdAt
                });
                land[farmEvent.landIndex] = plantedSeed;
            } else if (farmEvent.action == Action.Harvest) {
                Square memory square = land[farmEvent.landIndex];
                require(square.fruit != Fruit.None, "NO_FRUIT");

                uint duration = farmEvent.createdAt.sub(square.createdAt);
                uint secondsToHarvest = getHarvestSeconds(square.fruit);
                require(duration >= secondsToHarvest, "NOT_RIPE");

                // Clear the land
                Square memory emptyLand = Square({
                    fruit: Fruit.None,
                    createdAt: 0
                });
                land[farmEvent.landIndex] = emptyLand;

                uint price = getFruitPrice(square.fruit);
                uint fmcPrice = getMarketPrice(price);

                balance = balance.add(fmcPrice);
            }
        }

        return Farm({
            land: land,
            balance: balance
        });
    }


    function sync(Event[] memory _events) public hasFarm returns (Farm memory) {
        Farm memory farm = buildFarm(_events);

        // Update the land
        Square[] storage land = fields[msg.sender];
        for (uint i=0; i < farm.land.length; i += 1) {
            land[i] = farm.land[i];
        }
        
        syncedAt[msg.sender] = block.timestamp;
        
        uint balance = token.balanceOf(msg.sender);
        // Update the balance - mint or burn
        if (farm.balance > balance) {
            uint profit = farm.balance.sub(balance);
            token.mint(msg.sender, profit);
        } else if (farm.balance < balance) {
            uint loss = balance.sub(farm.balance);
            // Store rewards in the Farm Contract
            token.transfer(address(this), loss);
        }

        emit FarmSynced(msg.sender);

        return farm;
    }

    function levelUp() public hasFarm {
        require(fields[msg.sender].length <= 17, "MAX_LEVEL");

        
        Square[] storage land = fields[msg.sender];

        uint price = getLandPrice(land.length);
        uint fmcPrice = getMarketPrice(price);
        uint balance = token.balanceOf(msg.sender);

        require(balance >= fmcPrice, "INSUFFICIENT_FUNDS");
        
        token.burn(msg.sender, fmcPrice);
        
        // Add 3 sunflower fields in the new fields
        Square memory sunflower = Square({
            fruit: Fruit.Sunflower,
            // Make them immediately harvestable in case they spent all their tokens
            createdAt: 0
        });

        for (uint index = 0; index < 3; index++) {
            land.push(sunflower);
        }

        emit FarmSynced(msg.sender);
    }

    // How many tokens do you get per dollar
    // Algorithm is totalSupply / 10000 but we do this in gradual steps to avoid widly flucating prices between plant & harvest
    function getMarketRate() private view returns (uint conversion) {
        uint decimals = token.decimals();
        uint totalSupply = token.totalSupply();

        // Less than 100, 000 tokens
        if (totalSupply < (100000 * 10**decimals)) {
            // 1 Farm Dollar gets you 1 FMC token
            return 1;
        }

        // Less than 500, 000 tokens
        if (totalSupply < (500000 * 10**decimals)) {
            return 5;
        }

        // Less than 1, 000, 000 tokens
        if (totalSupply < (1000000 * 10**decimals)) {
            return 10;
        }

        // Less than 5, 000, 000 tokens
        if (totalSupply < (5000000 * 10**decimals)) {
            return 50;
        }

        // Less than 10, 000, 000 tokens
        if (totalSupply < (10000000 * 10**decimals)) {
            return 100;
        }

        // Less than 50, 000, 000 tokens
        if (totalSupply < (50000000 * 10**decimals)) {
            return 500;
        }

        // Less than 100, 000, 000 tokens
        if (totalSupply < (100000000 * 10**decimals)) {
            return 1000;
        }

        // Less than 500, 000, 000 tokens
        if (totalSupply < (500000000 * 10**decimals)) {
            return 5000;
        }

        // Less than 1, 000, 000, 000 tokens
        if (totalSupply < (1000000000 * 10**decimals)) {
            return 10000;
        }

        // 1 Farm Dollar gets you a 0.00001 of a token - Linear growth from here
        return totalSupply.div(10000);
    }

    function getMarketPrice(uint price) public view returns (uint conversion) {
        uint marketRate = getMarketRate();

        return price.div(marketRate);
    }

    function myReward() public view hasFarm returns (uint amount) {        
        uint lastOpenDate = rewardsOpenedAt[msg.sender];

        // Block timestamp is seconds based
        uint threeDaysAgo = block.timestamp.sub(60 * 60 * 24 * 3); 

        require(lastOpenDate < threeDaysAgo, "NO_REWARD_READY");

        // E.g. 0.2%
        uint decimals = token.decimals();
        uint balance = token.balanceOf(msg.sender).mul(decimals);
        uint proportionOwned = balance.div(token.totalSupply());

        // E.g. 0.2% * 2000 = 4
        uint reward = token.balanceOf(address(this)).mul(proportionOwned).div(decimals);

        return reward;
    }

    function receiveReward() public hasFarm {
        uint amount = myReward();

        require(amount > 0, "NO_REWARD_AMOUNT");

        rewardsOpenedAt[msg.sender] = block.timestamp;

        token.transfer(msg.sender, amount);
    }
}
