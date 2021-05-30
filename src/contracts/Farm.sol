pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/Math.sol";
import "./Token.sol";

contract Farm {
    using SafeMath for uint256;

    Token private token;
    uint private totalHoursHarvested = 0;

    struct Square {
        Fruit commodity;
        uint createdAt;
    }

    mapping(address => Square[]) fields;
    mapping(address => uint) syncedAt;

    constructor(Token _token) public {
        token = _token;
    }

    event FarmCreated(address indexed _address);
    event FarmSynced(address indexed _address);

    function createFarm() public {
        uint synced = syncedAt[msg.sender];
        require(synced == 0, "Farm already exists");

        Square[] storage land = fields[msg.sender];
        Square memory empty = Square(Fruit.None, 0);
        Square memory apple = Square(Fruit.Apple, block.timestamp);

        // Each farmer starts with 5 fields & 3 apples
        land.push(empty);
        land.push(apple);
        land.push(apple);
        land.push(apple);
        land.push(empty);

        Transaction[] memory transactions;

        syncedAt[msg.sender] = block.timestamp;

        //Emit an event
        emit FarmCreated(msg.sender);
    }
    
    function lastSyncedAt() public view returns(uint) {
        return syncedAt[msg.sender];
    }


    function getLand() public view returns (Square[] memory) {
        return fields[msg.sender];
    }

    enum Action { Plant, Harvest }
    enum Fruit { None, Apple, Avocado, Banana, Coconut, Pineapple, Money, Diamond }

    struct Transaction { 
        Action action;
        Fruit commodity;
        uint landIndex;
        uint createdAt;
    }

    struct Farm {
        Square[] land;
        uint balance;
        Transaction[] transactions;
    }

    function getHarvestHours(Fruit _commodity) private view returns (uint) {
        if (_commodity == Fruit.Apple) {
            return 1;
        } else if (_commodity == Fruit.Avocado) {
            return 3;
        } else if (_commodity == Fruit.Banana) {
            return 8;
        } else if (_commodity == Fruit.Coconut) {
            // 1 Day
            return 24;
        } else if (_commodity == Fruit.Pineapple) {
            // 3 days
            return 72;
        } else if (_commodity == Fruit.Money) {
            // 1 week
            return 168;
        } else if (_commodity == Fruit.Diamond) {
            // 4 weeks
            return 672;
        }

        require(false, "Invalid fruit");
        return 9999999;
    }

    function getSeedPrice(Fruit _commodity) private view returns (uint price) {
        if (_commodity == Fruit.Apple) {
            // $0.05
            return 5;
        } else if (_commodity == Fruit.Avocado) {
            // $0.30
            return 30;
        } else if (_commodity == Fruit.Banana) {
            // $1
            return 100;
        } else if (_commodity == Fruit.Coconut) {
            // $5
            return 500;
        } else if (_commodity == Fruit.Pineapple) {
            // $10
            return 1000;
        } else if (_commodity == Fruit.Money) {
            // $50
            return 5000;
        } else if (_commodity == Fruit.Diamond) {
            // $1000
            return 100000;
        }

        require(false, "Invalid fruit");

        return 100000;
    }

    function getFruitPrice(Fruit _commodity) private view returns (uint price) {
        if (_commodity == Fruit.Apple) {
            // $0.10
            return 10;
        } else if (_commodity == Fruit.Avocado) {
            // $0.60
            return 60;
        } else if (_commodity == Fruit.Banana) {
            // $2.8
            return 280;
        } else if (_commodity == Fruit.Coconut) {
            // $11.5
            return 1150;
        } else if (_commodity == Fruit.Pineapple) {
            // $32
            return 3200;
        } else if (_commodity == Fruit.Money) {
            // $100
            return 10000;
        } else if (_commodity == Fruit.Diamond) {
            // $1275
            return 127500;
        }

        require(false, "Invalid fruit");

        return 0;
    }
    
    function requiredLandSize(Fruit _commodity) private view returns (uint size) {
        if (_commodity == Fruit.Apple || _commodity == Fruit.Avocado) {
            return 5;
        } else if (_commodity == Fruit.Banana || _commodity == Fruit.Coconut) {
            return 8;
        } else if (_commodity == Fruit.Pineapple) {
            return 11;
        } else if (_commodity == Fruit.Money) {
            return 14;
        } else if (_commodity == Fruit.Diamond) {
            // $32
            return 17;
        }

        require(false, "Invalid fruit");

        return 99;
    }
    
       
    function getLandPrice(uint landSize) private view returns (uint price) {
        if (landSize <= 5) {
            // $5 - 10 hours of planting avocados on 5 fields
            return 500;
        } else if (landSize <= 8) {
            // $250 - 6 days planting coconuts on 8 fields
            return 250000;
        } else if (landSize <= 11) {
            // $2000 - 4 weeks planting pineapples on 11 fields
            return 500000;
        }
        
        // $8400 - 3 months of planting Money trees on 14 fields
        return 8400000;
    }


    function concatenate(
        string memory a,
        string memory b)
        internal
        pure
        returns(string memory) {
            return string(abi.encodePacked(a, b));
        }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function buildFarm(Transaction[] memory _transactions) private view returns (Farm memory currentFarm) {
        uint lastSyncedAt = syncedAt[msg.sender];
        require(lastSyncedAt > 0, "Farm does not exist");

        Square[] memory land = fields[msg.sender];
        uint balance = getBalance();

        for (uint index = 0; index < _transactions.length; index++) {
            Transaction memory transaction = _transactions[index];

            // Fraud protection
            require(transaction.createdAt >= lastSyncedAt, "You can not perform an action in the past");
            require(transaction.createdAt <= block.timestamp, "You can not perform an action in the future");
            if (index > 0) {
                require(transaction.createdAt >= _transactions[index - 1].createdAt, "Transactions are not in order");
            }

            require(land.length >= requiredLandSize(transaction.commodity), "Your farm is not ready to plant this fruit. Level up first.");

            if (transaction.action == Action.Plant) {
                uint price = getSeedPrice(transaction.commodity);
                require(balance >= price, "Not enough money to buy seed");

                balance = balance.sub(price);

                Square memory plantedSeed = Square({
                    commodity: transaction.commodity,
                    createdAt: transaction.createdAt
                });
                land[transaction.landIndex] = plantedSeed;
            } else if (transaction.action == Action.Harvest) {
                Square memory square = land[transaction.landIndex];
                require(square.commodity == transaction.commodity, "Invalid farm: No fruit exists");

                // Currently seconds
                uint duration = transaction.createdAt - square.createdAt;
                uint hoursToHarvest = getHarvestHours(transaction.commodity);
                string memory durationString = uint2str(hoursToHarvest - duration);
                string memory message = concatenate("Invalid farm: The fruit is not ripe, please wait: ", durationString);
                require(duration >= hoursToHarvest, message);

                // Clear the land
                Square memory emptyLand = Square(Fruit.None, 0);
                land[transaction.landIndex] = emptyLand;

                uint price = getFruitPrice(transaction.commodity);

                balance = balance.add(price);
            }
        }

        return Farm({
            land: land,
            balance: balance,
            transactions: _transactions
        });
    }


    function getHoursHarvested(Transaction[] memory _transactions) private view returns (uint) {
        uint secondsHarvested = 0;
        for (uint i=0; i < _transactions.length; i += 1) {
            if (_transactions[i].action == Action.Harvest) {
                secondsHarvested = secondsHarvested + getHarvestHours(_transactions[i].commodity);
            }
        }

        // Solidity uses integer division, which is equivalent to floored division.
        // TESTING - return secondsHarvested / 3600;
        return secondsHarvested * 10;
    }

    function sync(Transaction[] memory _transactions) public returns (Farm memory) {
        uint balance = getBalance();
        Farm memory farm = buildFarm(_transactions);

        // Update the land
        Square[] storage land = fields[msg.sender];
        for (uint i=0; i < farm.land.length; i += 1) {
            land[i] = farm.land[i];
        }


        // Update the balance - mint or burn
        if (farm.balance > balance) {
            uint profit = farm.balance - balance;
            uint fmc = dollarToFMC(profit);
            token.mint(msg.sender, fmc);
            
            // An additional 5% of profit goes to developers & designers of Fruit Market
            uint commission = fmc / 5;
            token.mint(token.getOwner(), commission);
        } else if (farm.balance < balance) {
            uint loss = balance - farm.balance;
            uint fmc = dollarToFMC(loss);
            token.burn(msg.sender, fmc);
        }

        totalHoursHarvested += getHoursHarvested(_transactions);

        syncedAt[msg.sender] = block.timestamp;

        emit FarmSynced(msg.sender);
        return farm;
    }
    
     
    function levelUp() public {
        // TODO modifier
        uint lastSyncedAt = syncedAt[msg.sender];
        require(lastSyncedAt > 0, "Farm does not exist");
        
        require(fields[msg.sender].length <= 17, "You are at the maximum level");

        Square[] storage land = fields[msg.sender];

        uint price = getLandPrice(land.length);
        string memory priceString = uint2str(price);
        string memory message = concatenate("Not enough money to level up: ", priceString);
        uint balance = getBalance();
        require(balance >= price, message);

        Square memory empty = Square(Fruit.None, 0);

        // Do not bother rearranging the array - it is already in a strange square - Add 3 fields
        for (uint index = 0; index < 3; index++) {
            land.push(empty);
        }

        uint fmc = dollarToFMC(price);
        token.burn(msg.sender, fmc);

        emit FarmSynced(msg.sender);
    }


    function sqrt(uint x) private pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    
    
    // With 17 fields 24/7 for 1 year a user would harvest 148920 hours
    // This is when 29784000000 hours have been harvested - I.e. 200,000 diamond farmers for 1 year 24/7
    uint ORIGINAL_CONVERSION = 100000;
    
    function getConversion() public view returns (uint conversion) {
        if (totalHoursHarvested == 0) {
            return ORIGINAL_CONVERSION;
        }

        uint hourRoot = sqrt(totalHoursHarvested);

        // We are at the maximum conversion rate, now it is 1:1
        if (hourRoot > ORIGINAL_CONVERSION) {
            return 1;
        }

        return ORIGINAL_CONVERSION - hourRoot;
    }

    function dollarToFMC(uint dollars) public view returns (uint fmc) {
        uint conversion = getConversion();
        uint realFMC = dollars * conversion;

        // Remove the decimal places
        return realFMC / 100;
    }

    function FMCToDollar(uint fmc) public view returns (uint dollars) {
        uint conversion = getConversion();
        
        //Add decimal places
        uint fmcWithDecimals = fmc * 100;
        return fmcWithDecimals / conversion;
    }

    function getBalance() public view returns (uint balance) {
        uint fmc = token.balanceOf(msg.sender);
        return FMCToDollar(fmc);
    }

    // Append a transaction to the list
    function addTransaction(Transaction[] memory _transactions, Transaction memory _transaction) private view returns (Transaction[] memory) {
        Transaction[] memory newTransactions = new Transaction[](_transactions.length + 1);
        for (uint i=0; i < _transactions.length; i += 1) {
            newTransactions[i] = _transactions[i];
        }

        // Add the new transaction
        newTransactions[_transactions.length] = _transaction;

        return newTransactions;
    }

    function plant(Transaction[] memory _transactions, Fruit _commodity, uint landIndex) public view returns (Farm memory farm) {
        Transaction memory plantAppleTransaction = Transaction({
            action: Action.Plant,
            commodity: _commodity,
            landIndex: landIndex,
            createdAt: block.timestamp
        });
        Transaction[] memory newTransactions = addTransaction(_transactions, plantAppleTransaction);

        Farm memory updatedFarm = buildFarm(newTransactions);
        return (updatedFarm);
    }

    function harvest(Transaction[] memory _transactions, Fruit _commodity, uint landIndex) public view returns (Farm memory farm) {
        // Add the new transaction
        Transaction memory plantAppleTransaction = Transaction({
            action: Action.Harvest,
            commodity: _commodity,
            landIndex: landIndex,
            createdAt: block.timestamp
        });
        Transaction[] memory newTransactions = addTransaction(_transactions, plantAppleTransaction);

        Farm memory updatedFarm = buildFarm(newTransactions);
        return (updatedFarm);
    }
}
