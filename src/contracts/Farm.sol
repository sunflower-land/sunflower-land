pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/Math.sol";
import "./Token.sol";

contract Farm {
    using SafeMath for uint256;

    //assign Token contract to variable
    Token private token;
    uint NOW_TIMESTAMP = 69;
    uint totalHoursHarvested = 0;
    //uint DECIMAL_PLACES = 2;

    struct Square {
        Fruit commodity;
        uint createdAt;
    }

    mapping(address => Square[]) fields;
    mapping(address => uint) playersExperience;

    //pass as constructor argument deployed Token contract
    constructor(Token _token) public {
        //assign token deployed contract to variable
        token = _token;

        // Initial prices
        market[NOW_TIMESTAMP] = Prices({
            apples: 100, 
            avocados: 400,
            timestamp: block.timestamp,
            previousTimestamp: 0
        });
    }

    event FarmCreated(address indexed _address);
    event FarmSynced(address indexed _address);

    function createFarm() public {
        require(fields[msg.sender].length == 0, "Farm already exists");

        Square[] storage land = fields[msg.sender];
        Square memory empty = Square(Fruit.None, 0);
        Square memory apple = Square(Fruit.Apple, block.timestamp);

        land.push(empty);
        land.push(apple);
        land.push(apple);
        land.push(apple);
        land.push(empty);

        Transaction[] memory transactions;

        //Emit an event
        emit FarmCreated(msg.sender);
    }

    function sqrt(uint x) private pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function experienceToLevel(uint experience) private view returns (uint level) {
        if (experience < 3) {
            return 1;
        } else if (experience < 50) {
            return 2;
        } else if (experience < 850) {
            return 3;
        } else if (experience < 7000) {
            return 4;
        } else if (experience < 18720) {
            return 5;
        } else if (experience < 148920) {
            return 6;
        }

        return 7;
    }

    function getLevel() public view returns (uint level) {
        uint experience = playersExperience[msg.sender];

        return experienceToLevel(experience);
    }

    function getLandPrice(uint landSize) private view returns (uint price) {
        if (landSize <= 5) {
            // $50
            return 5000;
        } else if (landSize <= 8) {
            // $500
            return 50000;
        } else if (landSize <= 11) {
            // $5000
            return 500000;
        }

        // $50,000
        return 5000000;
    }

    function buyMoreSpace(Transaction[] memory _transactions) public {
        Farm memory farm = sync(_transactions);
        require(fields[msg.sender].length > 0, "Farm does not exist");
        require(fields[msg.sender].length <= 17, "Farm can not grow any bigger");

        Square[] storage land = fields[msg.sender];

        uint price = getLandPrice(land.length);
        string memory priceString = uint2str(price);
        string memory message = concatenate("Not enough money to buy new fields: ", priceString);
        require(farm.balance >= price, message);

        Square memory empty = Square(Fruit.None, 0);
        // Do not bother rearranging the array - it is already in a strange square!
        // Add 3 fields
        for (uint index = 0; index < 3; index++) {
            land.push(empty);
        }

        // TODO can we include this in the sync burn?
        uint fmc = dollarToFMC(price);
        token.burn(msg.sender, fmc);
        emit FarmSynced(msg.sender);
    }

    function getLand() public view returns (Square[] memory) {
        return fields[msg.sender];
    }

    enum Action { Plant, Harvest }
    uint FRUIT_COUNT = 2;
    enum Fruit { None, Apple, Avocado, Banana, Coconut, Pineapple, Money, Diamond }

    struct Transaction { 
        Action action;
        Fruit commodity;
        // Unique prices key
        uint timestamp;
        uint landIndex;
        uint createdAt;
    }

    uint MAX_AVOCADO_PRICE = 500;
    uint MIN_AVOCADO_PRICE = 300;

    struct Prices {
        uint apples;
        uint avocados;
        uint timestamp;
        uint previousTimestamp;
    }
     
    mapping(uint => Prices) market;

    struct Farm {
        Square[] land;
        uint balance;
        Transaction[] transactions;
        uint level;
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

    function getSeedPrice(Prices memory prices, Fruit _commodity) private view returns (uint price) {
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

        return 0;
    }

    function getFruitPrice(Prices memory prices, Fruit _commodity) private view returns (uint price) {
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
        require(fields[msg.sender].length > 0, "Farm does not exist");

        Square[] memory land = fields[msg.sender];
        uint balance = getBalance();
        uint experience = playersExperience[msg.sender];
        uint level = experienceToLevel(experience);

        for (uint index = 0; index < _transactions.length; index++) {
            level = experienceToLevel(experience);

            Transaction memory transaction = _transactions[index];
            require(level >= uint(transaction.commodity), "You are not experienced enough to plant this fruit");

            Prices memory prices = market[transaction.timestamp];
            
            if (transaction.action == Action.Plant) {
                uint price = getSeedPrice(prices, transaction.commodity);

                require(balance >= price, "Invalid farm: Not enough money to buy seeds");
                balance = balance.sub(price);

                Square memory plantedSeed = Square({
                    commodity: transaction.commodity,
                    // TODO - When they sync the far6 will be at the time of the farm :(
                    createdAt: transaction.createdAt
                });
                land[transaction.landIndex] = plantedSeed;
            } else if (transaction.action == Action.Harvest) {
                Square memory square = land[transaction.landIndex];
                require(square.commodity == transaction.commodity, "Invalid farm: No fruit exists");

                uint duration = block.timestamp - square.createdAt;
                string memory durationString = uint2str(duration);
                string memory message = concatenate("Invalid farm: The fruit is not ripe, please wait: ", durationString);
                uint hoursToHarvest = getHarvestHours(transaction.commodity);
                require(duration > hoursToHarvest, message);

                // Clear the land
                Square memory emptyLand = Square(Fruit.None, 0);
                land[transaction.landIndex] = emptyLand;

                uint price = getFruitPrice(prices, transaction.commodity);

                balance = balance.add(price);
                experience += hoursToHarvest;
            }
        }

        return Farm({
            land: land,
            balance: balance,
            transactions: _transactions,
            level: level
        });
    }

    function clamp(uint value, uint minimum, uint maximum) private pure returns (uint clamped) {
        if (value < minimum) {
            return minimum;
        }

        if (value > maximum) {
            return maximum;
        }

        return value;
    }

    // Assume the proportional number of transactions is what influences price
    // Since at the time of transaction, they will likely be buying something and have sold all their seeds
    // function moveTheMarket(Transaction[] memory _transactions) public {
    //     uint apples = 0;
    //     uint avocados = 0;

    //     // What is the biggest mover?
    //     for (uint i=0; i < _transactions.length; i += 1) {
    //         if (_transactions[i].commodity == Fruit.Apple) {
    //             apples += 1;
    //         } else if ( _transactions[i].commodity == Fruit.Avocado) {
    //             avocados += 1;
    //         }
    //     }

    //     uint totalFruitTransactions = apples + avocados;

    //     if (totalFruitTransactions == 0) {
    //         // TODO still update the timestamps being used
    //         return;
    //     }

    //     // Percentage of transactions that were apples
    //     uint applePercentage = 0;
    //     if (apples > 0) {
    //         applePercentage = totalFruitTransactions * 100;
    //     } 
    //     uint avocadoPercentage = 0;
    //     if (avocados > 0) {
    //         // 35%
    //         avocadoPercentage = avocados / totalFruitTransactions * 100;
    //     } 

    //     // 30%
    //     uint expectedTransactions = 100 / FRUIT_COUNT;

    //     // 5% 
    //     int avocadoChange = int(avocadoPercentage) - int(expectedTransactions);


    //     //TODO even out the price from the previous hour - store transactions in the last hour?
    //     int transactionCount = 1;
    //     uint tenMinutesAgo = block.timestamp - (60 * 10);
    //     Prices memory prices = market[NOW_TIMESTAMP];
    //     while (prices.timestamp > tenMinutesAgo) {
    //         transactionCount++;
            
    //         // Endless loop if we do not have this???
    //         if (transactionCount >= 2) {
    //             break;
    //         }

    //         // Back to the beginining
    //         if (prices.previousTimestamp == 0) {
    //             break;
    //         }

    //         prices = market[prices.previousTimestamp];
    //     }

    //     Prices memory currentPrices = market[NOW_TIMESTAMP];

    //     // To avoid major market shifts, divide it
    //     int MARKET_IMPACT = 10;
    //     // 5% / 3 Transactions = 1.8%
    //     int relativeAvocadoChange = avocadoChange / transactionCount / MARKET_IMPACT;
    //     // 98.2% - we want to decrease it a little.
    //     int percentage = 100 - relativeAvocadoChange;
    //     // $5.23
    //     uint avocadoPrice = currentPrices.avocados * uint(percentage) / 100;
    //     // $5
    //     uint clampedAvocadoPrice = clamp(avocadoPrice, MIN_AVOCADO_PRICE, MAX_AVOCADO_PRICE);

    //     market[currentPrices.timestamp] = currentPrices;
    //     market[NOW_TIMESTAMP] = Prices({
    //         // Staple crop
    //         apples: 100,
    //         avocados: clampedAvocadoPrice,
    //         timestamp: block.timestamp,
    //         previousTimestamp: currentPrices.timestamp
    //     });
    // }

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
        } else if (farm.balance < balance) {
            uint loss = balance - farm.balance;
            uint fmc = dollarToFMC(loss);
            token.burn(msg.sender, fmc);
        }

        uint hoursFarmed = getHoursHarvested(_transactions);
        playersExperience[msg.sender] += hoursFarmed;

        totalHoursHarvested += hoursFarmed;

        emit FarmSynced(msg.sender);
        return farm;
    }

    // TODO - store the conversion & prices together on chain
    // With 17 fields 24/7 for 1 year a user would harvest 148920 hours
    // This would need 67,150 harvesters for 1 year to get to this threshold
    uint ORIGINAL_CONVERSION = 100000;

    function getConversion() public view returns (uint conversion) {
        if (totalHoursHarvested == 0) {
            return ORIGINAL_CONVERSION;
        }

        uint hourRoot = sqrt(totalHoursHarvested);

        // We are at the maximum conversion rate, now it is 1:1
        // This is when 10000000000 hours have been harvested
        if (hourRoot > ORIGINAL_CONVERSION) {
            return 1;
        }

        return ORIGINAL_CONVERSION - hourRoot;
    }

    function dollarToFMC(uint dollars) public view returns (uint fmc) {
        uint conversion = getConversion();
        uint realFMC = dollars * conversion;

        // Remove the decimal points
        return realFMC / 100;
    }

    // Decimal places to multiple by 100
    function FMCToDollar(uint fmc) public view returns (uint dollars) {
        uint conversion = getConversion();
        uint fmcWithDecimals = fmc * 100;
        return fmcWithDecimals / conversion;
    }

    function getBalance() public view returns (uint balance) {
        uint fmc = token.balanceOf(msg.sender);
        return FMCToDollar(fmc);
    }

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
        Prices memory currentPrices = market[NOW_TIMESTAMP];
        Transaction memory plantAppleTransaction = Transaction({
            action: Action.Plant,
            commodity: _commodity,
            timestamp: currentPrices.timestamp,
            landIndex: landIndex,
            createdAt: block.timestamp
        });
        Transaction[] memory newTransactions = addTransaction(_transactions, plantAppleTransaction);

        Farm memory updatedFarm = buildFarm(newTransactions);
        return (updatedFarm);
    }

    function harvest(Transaction[] memory _transactions, Fruit _commodity, uint landIndex) public view returns (Farm memory farm) {
        // Add the new transaction
        Prices memory currentPrices = market[NOW_TIMESTAMP];
        Transaction memory plantAppleTransaction = Transaction({
            action: Action.Harvest,
            commodity: _commodity,
            timestamp: currentPrices.timestamp,
            landIndex: landIndex,
            createdAt: block.timestamp
        });
        Transaction[] memory newTransactions = addTransaction(_transactions, plantAppleTransaction);

        Farm memory updatedFarm = buildFarm(newTransactions);
        return (updatedFarm);
    }

    function getPrices() public view returns (Prices memory price) {
        return market[NOW_TIMESTAMP];
    }

    function getApplePrice() public view returns (uint price) {
        return market[NOW_TIMESTAMP].apples;
    }

    function getAvocadoPrice() public view returns (uint price) {
        return market[NOW_TIMESTAMP].avocados;
    }
}
