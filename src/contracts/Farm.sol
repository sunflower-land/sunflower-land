pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./Token.sol";

contract Farm {
    //assign Token contract to variable
    Token private token;
    uint NOW_TIMESTAMP = 69;
    uint DECIMAL_PLACES = 18;

    struct Square {
        Commodity commodity;
        uint createdAt;
    }

    struct Inventory {
        bool isInitialized;
        uint apples;
        uint avocados;
    }


    mapping(address => Inventory) inventories;
    mapping(address => Square[]) fields;

    //pass as constructor argument deployed Token contract
    constructor(Token _token) public {
        //assign token deployed contract to variable
        token = _token;

        // Initial prices
        market[NOW_TIMESTAMP] = Prices({
            apples: 1 * 10^DECIMAL_PLACES, 
            avocados: 3 * 10^DECIMAL_PLACES,
            timestamp: block.timestamp,
            previousTimestamp: 0
        });
    }

    function createFarm() public {
        require(!inventories[msg.sender].isInitialized, "Inventory already exists");

        Inventory storage inventory = inventories[msg.sender];
        inventory.isInitialized = true;
        inventory.apples = 1;

        Square[] storage land = fields[msg.sender];
        Square memory empty = Square(Commodity.Empty, 0);
        land.push(empty);
    }

    function getInventory() public view returns (Inventory memory) {
        return inventories[msg.sender];
    }

    function getLand() public view returns (Square[] memory) {
        return fields[msg.sender];
    }

    enum Action { Buy, Sell, Plant, Harvest }
    uint FRUIT_COUNT = 2;
    enum Commodity { AppleSeed, AvocadoSeed, Empty }

    struct Transaction { 
        Action action;
        Commodity commodity;
        uint timestamp;
        uint landIndex;
    }

    uint MAX_AVOCADO_PRICE = 5;
    uint MIN_AVOCADO_PRICE = 3;

    struct Prices {
        uint apples;
        uint avocados;
        uint timestamp;
        uint previousTimestamp;
    }
     
    mapping(uint => Prices) market;

    struct Farm {
        Inventory inventory;
        Square[] land;
        uint balance;
        Transaction[] transactions;
    }

    uint APPLE_HARVEST_MILLSECONDS = 60 * 1000;

    function getFarm(Transaction[] memory _transactions) public view returns (Farm memory currentFarm) {
        Inventory memory inventory = inventories[msg.sender];
        Square[] memory land = fields[msg.sender];
        uint fmc = token.balanceOf(msg.sender);

        for (uint index = 0; index < _transactions.length; index++) {
            Transaction memory transaction = _transactions[index];
            Prices memory pricesAtTime = market[transaction.timestamp];

            if (transaction.commodity == Commodity.AppleSeed) {
                if (transaction.action == Action.Sell) {
                    require(1 <= inventory.apples, "Invalid farm: No apples to sell");

                    inventory.apples -= 1;
                    fmc += pricesAtTime.apples;
                } else if (transaction.action == Action.Buy) {
                    require(fmc >= pricesAtTime.apples, "Invalid farm: Not enough money to buy apples");

                    fmc -= pricesAtTime.apples;
                    inventory.apples += 1;
                } else if (transaction.action == Action.Plant) {
                    require(inventory.apples > 0, "Invalid farm: Not enough apple seeds to plant");

                    Square memory plantedApple = Square(Commodity.AppleSeed, transaction.timestamp);
                    land[transaction.landIndex] = plantedApple;
                    inventory.apples -= 1;
                } else if (transaction.action == Action.Harvest) {
                    Square memory square = land[transaction.landIndex];
                    require(square.commodity == Commodity.AppleSeed, "Invalid farm: That is not an apple");

                    uint duration = block.timestamp - square.createdAt;
                    require(duration > APPLE_HARVEST_MILLSECONDS, "Invalid farm:You do not have any apples ripe for harvest");

                    // Clear the land
                    Square memory emptyLand = Square(Commodity.Empty, 0);
                    land[transaction.landIndex] = emptyLand;
                    inventory.apples += 2;
                }
            }
        }

        return Farm({
            inventory: inventory,
            land: land,
            balance: fmc,
            transactions: _transactions
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
    function moveTheMarket(Transaction[] memory _transactions) public {
        uint apples = 0;
        uint avocados = 0;

        // What is the biggest mover?
        for (uint i=0; i < _transactions.length; i += 1) {
            if ( _transactions[i].commodity == Commodity.AppleSeed) {
                apples += 1;
            } else if ( _transactions[i].commodity == Commodity.AppleSeed) {
                avocados += 1;
            }
        }

        uint totalFruitTransactions = apples + avocados;

        // Percentage of transactions that were apples
        uint applePercentage = apples / totalFruitTransactions * 100;
        uint avocadoPercentage = avocados / totalFruitTransactions * 100;
        uint expectedTransactions = 1 / FRUIT_COUNT * 100;

        uint appleChange = applePercentage - expectedTransactions;
        uint avocadoChange = avocadoPercentage - expectedTransactions;


        // TODO even out the price from the previous hour - store transactions in the last hour?
        uint transactionCount = 0;
        uint tenMinutesAgo = block.timestamp - (60 * 10);
        Prices memory prices = market[NOW_TIMESTAMP];
        while (prices.timestamp > tenMinutesAgo) {
            transactionCount++;
            
            if (prices.previousTimestamp != 0) {
                prices = market[prices.previousTimestamp];
            } else {
                break;
            }
        }

        Prices memory currentPrices = market[NOW_TIMESTAMP];

        // Apples are staple, they always stay at 1 FMC
        uint relativeAvocadoChange = avocadoChange / transactionCount;
        uint newAvocadoPrice = clamp(currentPrices.avocados * relativeAvocadoChange, MIN_AVOCADO_PRICE, MAX_AVOCADO_PRICE);

        market[currentPrices.timestamp] = currentPrices;
        market[NOW_TIMESTAMP] = Prices({
            apples: 1,
            avocados: newAvocadoPrice,
            timestamp: block.timestamp,
            previousTimestamp: currentPrices.timestamp
        });
    }

    function sync(Transaction[] memory _transactions) public {
        uint balance = token.balanceOf(msg.sender);
        Farm memory farm = getFarm(_transactions);

        // Update the inventory
        Inventory storage oldInventory = inventories[msg.sender];

        oldInventory.apples = farm.inventory.apples;

        // TODO support more land
        Square[] storage land = fields[msg.sender];
        land[0] = farm.land[0];


        // Update the users FMC - mint or burn
        int balanceChange = int(farm.balance) - int(balance);
        if (balanceChange > 0) {
            token.mint(msg.sender, uint(balanceChange));
        } else if (balanceChange < 0) {
            int amountToBurn = -1 * int(balanceChange);
            token.burn(uint(amountToBurn));
        }

        // TODO - update the prices
        moveTheMarket(_transactions);

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

    function buyAppleSeed(Transaction[] memory _transactions) public view returns (Farm memory farm, uint price) {
        Prices memory currentPrices = market[NOW_TIMESTAMP];
        Transaction memory buyAppleTransaction = Transaction(Action.Buy, Commodity.AppleSeed, currentPrices.timestamp, 0);
        Transaction[] memory newTransactions = addTransaction(_transactions, buyAppleTransaction);


        Farm memory updatedFarm = getFarm(newTransactions);
        return (updatedFarm,currentPrices.apples);
    }

    function sellAppleSeed(Transaction[] memory _transactions) public view returns (Farm memory farm, uint price) {
        Prices memory currentPrices = market[NOW_TIMESTAMP];
        Transaction memory sellAppleTransaction = Transaction(Action.Sell, Commodity.AppleSeed, currentPrices.timestamp, 0);
        Transaction[] memory newTransactions = addTransaction(_transactions, sellAppleTransaction);


        Farm memory updatedFarm = getFarm(newTransactions);
        return (updatedFarm, currentPrices.apples);
    }

    function plantAppleSeed(Transaction[] memory _transactions, uint landIndex) public view returns (Farm memory farm) {
        Prices memory currentPrices = market[NOW_TIMESTAMP];
        Transaction memory plantAppleTransaction = Transaction(Action.Plant, Commodity.AppleSeed, currentPrices.timestamp, landIndex);
        Transaction[] memory newTransactions = addTransaction(_transactions, plantAppleTransaction);

        Farm memory updatedFarm = getFarm(newTransactions);
        return (updatedFarm);
    }

    function harvestAppleSeed(Transaction[] memory _transactions, uint landIndex) public view returns (Farm memory farm) {
        // Add the new transaction
        Prices memory currentPrices = market[NOW_TIMESTAMP];
        Transaction memory plantAppleTransaction = Transaction(Action.Harvest, Commodity.AppleSeed, currentPrices.timestamp, 0);
        Transaction[] memory newTransactions = addTransaction(_transactions, plantAppleTransaction);

        Farm memory updatedFarm = getFarm(newTransactions);
        return (updatedFarm);
    }

    function getApplePrice() public view returns (uint price) {
        return market[NOW_TIMESTAMP].apples;
    }
}
