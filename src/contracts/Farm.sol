pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/Math.sol";
import "./Token.sol";

contract Farm {
    using SafeMath for uint256;

    //assign Token contract to variable
    Token private token;
    uint NOW_TIMESTAMP = 69;
    //uint DECIMAL_PLACES = 2;

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
            apples: 100, 
            avocados: 400,
            timestamp: block.timestamp,
            previousTimestamp: 0
        });
    }

    uint INITIAL_FIELD_COUNT = 9;

    event FarmCreated(address indexed _address);
    event FarmSynced(address indexed _address);

    function createFarm() public {
        require(!inventories[msg.sender].isInitialized, "Inventory already exists");

        Inventory storage inventory = inventories[msg.sender];
        inventory.isInitialized = true;
        inventory.apples = 1;

        // Farm only has 1 block
        Square[] storage land = fields[msg.sender];
        Square memory empty = Square(Commodity.Empty, 0);
        for (uint index = 0; index < INITIAL_FIELD_COUNT; index++) {
            land.push(empty);
        }

        uint balance = token.balanceOf(msg.sender);
        Transaction[] memory transactions;

        //Emit an event
        emit FarmCreated(msg.sender);
    }

    function sqrt(uint x) private returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function buyMoreSpace(Transaction[] memory _transactions) public {
        Farm memory farm = sync(_transactions);
        Inventory memory inventory = inventories[msg.sender];
        require(inventory.isInitialized, "Farm does not exist");

        Square[] storage land = fields[msg.sender];
        // 4
        uint newWidth = sqrt(land.length) + 1;
        // 16
        uint newSize = newWidth * newWidth;
        uint newFields = newSize.sub(land.length);

        // TODO safemath
        uint price = (newFields ^ (newWidth - 3)) * 1000;

        string memory priceString = uint2str(price);
        string memory message = concatenate("Not enough money to buy new fields: ", priceString);
        require(farm.balance >= price, message);

        Square memory empty = Square(Commodity.Empty, 0);
        // Do not bother rearranging the array - it is already in a strange square!
        for (uint index = 0; index < newFields; index++) {
            land.push(empty);
        }


        // TODO - Add the new spots
        token.burn(msg.sender, price);
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
        Inventory inventory;
        Square[] land;
        uint balance;
        Transaction[] transactions;
    }

    uint APPLE_HARVEST_SECONDS = 6;

    function getSeedFromInventory(Inventory memory _inventory, Commodity _commodity) private view returns (uint count) {
        if (_commodity == Commodity.AppleSeed) {
            return _inventory.apples;
        } else if (_commodity == Commodity.AvocadoSeed) {
            return _inventory.avocados;
        }

        return 0;
    }

    function getFruitPrice(Prices memory prices, Commodity _commodity) private view returns (uint price) {
        if (_commodity == Commodity.AppleSeed) {
            return prices.apples;
        } else if (_commodity == Commodity.AvocadoSeed) {
            return prices.avocados;
        }

        return 0;
    }

    enum InventoryAction {
        Add,
        Subtract
    }

    function updateInventory(Inventory memory _inventory, Commodity _commodity, InventoryAction _action, uint _change) private view returns (Inventory memory) {
        if (_commodity == Commodity.AppleSeed) {
            if (_action == InventoryAction.Add) {
                _inventory.apples = _inventory.apples.add(_change);
            } else {
                _inventory.apples = _inventory.apples.sub(_change);
            }
        } else if (_commodity == Commodity.AvocadoSeed) {
            if (_action == InventoryAction.Add) {
                _inventory.avocados = _inventory.avocados.add(_change);
            } else {
                _inventory.avocados = _inventory.avocados.sub(_change);
            }
        }

        return _inventory;
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
        Inventory memory inventory = inventories[msg.sender];

        require(inventory.isInitialized, "Farm does not exist");

        Square[] memory land = fields[msg.sender];
        uint balance = token.balanceOf(msg.sender);

        for (uint index = 0; index < _transactions.length; index++) {
            Transaction memory transaction = _transactions[index];
            Prices memory prices = market[transaction.timestamp];
            
            uint seedCount = getSeedFromInventory(inventory, transaction.commodity);
            uint price = getFruitPrice(prices, transaction.commodity);

            if (transaction.action == Action.Sell) {
                require(1 <= seedCount, "Invalid farm: No seeds to sell");

                inventory = updateInventory(inventory, transaction.commodity, InventoryAction.Subtract, 1);
                // TODO USE REAL PRICES
                balance = balance.add(100);
            } else if (transaction.action == Action.Buy) {
                require(balance >= price, "Invalid farm: Not enough money to buy seeds");

                // TODO USE REAL PRICES
                balance = balance.sub(100);
                inventory = updateInventory(inventory, transaction.commodity, InventoryAction.Add, 1);
            } else if (transaction.action == Action.Plant) {
                require(seedCount > 0, "Invalid farm: Not enough seeds to plant");


                Square memory plantedSeed = Square({
                    commodity: transaction.commodity,
                    // TODO - When they sync the farm, this will be at the time of the farm :(
                    createdAt: transaction.createdAt
                });
                land[transaction.landIndex] = plantedSeed;
                inventory = updateInventory(inventory, transaction.commodity, InventoryAction.Subtract, 1);
            } else if (transaction.action == Action.Harvest) {
                Square memory square = land[transaction.landIndex];
                require(square.commodity == transaction.commodity, "Invalid farm: No fruit exists");

                uint duration = block.timestamp - square.createdAt;
                string memory durationString = uint2str(duration);
                string memory message = concatenate("Invalid farm: The fruit is not ripe, please wait: ", durationString);
                // TODO - normal times
                require(duration > APPLE_HARVEST_SECONDS, message);

                // Clear the land
                Square memory emptyLand = Square(Commodity.Empty, 0);
                land[transaction.landIndex] = emptyLand;
                inventory = updateInventory(inventory, transaction.commodity, InventoryAction.Add, 2);
            }
        }

        return Farm({
            inventory: inventory,
            land: land,
            balance: balance,
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
            if (_transactions[i].commodity == Commodity.AppleSeed) {
                apples += 1;
            } else if ( _transactions[i].commodity == Commodity.AvocadoSeed) {
                avocados += 1;
            }
        }

        uint totalFruitTransactions = apples + avocados;

        if (totalFruitTransactions == 0) {
            // TODO still update the timestamps being used
            return;
        }

        // Percentage of transactions that were apples
        uint applePercentage = 0;
        if (apples > 0) {
            applePercentage = totalFruitTransactions * 100;
        } 
        uint avocadoPercentage = 0;
        if (avocados > 0) {
            // 35%
            avocadoPercentage = avocados / totalFruitTransactions * 100;
        } 

        // 30%
        uint expectedTransactions = 100 / FRUIT_COUNT;

        // 5% 
        int avocadoChange = int(avocadoPercentage) - int(expectedTransactions);


        //TODO even out the price from the previous hour - store transactions in the last hour?
        int transactionCount = 1;
        uint tenMinutesAgo = block.timestamp - (60 * 10);
        Prices memory prices = market[NOW_TIMESTAMP];
        while (prices.timestamp > tenMinutesAgo) {
            transactionCount++;
            
            // Endless loop if we do not have this???
            if (transactionCount >= 2) {
                break;
            }

            // Back to the beginining
            if (prices.previousTimestamp == 0) {
                break;
            }

            prices = market[prices.previousTimestamp];
        }

        Prices memory currentPrices = market[NOW_TIMESTAMP];

        // To avoid major market shifts, divide it
        int MARKET_IMPACT = 10;
        // 5% / 3 Transactions = 1.8%
        int relativeAvocadoChange = avocadoChange / transactionCount / MARKET_IMPACT;
        // 98.2% - we want to decrease it a little.
        int percentage = 100 - relativeAvocadoChange;
        // $5.23
        uint avocadoPrice = currentPrices.avocados * uint(percentage) / 100;
        // $5
        uint clampedAvocadoPrice = clamp(avocadoPrice, MIN_AVOCADO_PRICE, MAX_AVOCADO_PRICE);

        market[currentPrices.timestamp] = currentPrices;
        market[NOW_TIMESTAMP] = Prices({
            // Staple crop
            apples: 100,
            avocados: clampedAvocadoPrice,
            timestamp: block.timestamp,
            previousTimestamp: currentPrices.timestamp
        });
    }

    function sync(Transaction[] memory _transactions) public returns (Farm memory) {
        uint balance = token.balanceOf(msg.sender);
        Farm memory farm = buildFarm(_transactions);

        // Update the inventory
        Inventory storage oldInventory = inventories[msg.sender];
        oldInventory.apples = farm.inventory.apples;

        // Update the land
        Square[] storage land = fields[msg.sender];
        for (uint i=0; i < farm.land.length; i += 1) {
            land[i] = farm.land[i];
        }


        // Update the balance - mint or burn
        if (farm.balance > balance) {
            uint profit = farm.balance - balance;
            token.mint(msg.sender, profit);
        } else if (farm.balance < balance) {
            uint loss = balance - farm.balance;
            token.burn(msg.sender, loss);
        }

        moveTheMarket(_transactions);
        emit FarmSynced(msg.sender);
        return farm;
    }

    function getBalance() public view returns (uint balance) {
        return token.balanceOf(msg.sender);
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

    function buy(Transaction[] memory _transactions, Commodity _commodity) public view returns (Farm memory farm, uint price) {
        Prices memory currentPrices = market[NOW_TIMESTAMP];
        Transaction memory buyAppleTransaction = Transaction({
            action: Action.Buy,
            commodity: _commodity,
            timestamp: currentPrices.timestamp,
            landIndex: 0,
            createdAt: block.timestamp
        });
        Transaction[] memory newTransactions = addTransaction(_transactions, buyAppleTransaction);


        Farm memory updatedFarm = buildFarm(newTransactions);
        return (updatedFarm,currentPrices.apples);
    }

    function sell(Transaction[] memory _transactions, Commodity _commodity) public view returns (Farm memory farm, uint price) {
        Prices memory currentPrices = market[NOW_TIMESTAMP];
        Transaction memory sellAppleTransaction = Transaction({
            action: Action.Sell,
            commodity: _commodity,
            timestamp: currentPrices.timestamp,
            landIndex: 0,
            createdAt: block.timestamp
        });
        Transaction[] memory newTransactions = addTransaction(_transactions, sellAppleTransaction);


        Farm memory updatedFarm = buildFarm(newTransactions);
        return (updatedFarm, currentPrices.apples);
    }

    function plant(Transaction[] memory _transactions, Commodity _commodity, uint landIndex) public view returns (Farm memory farm) {
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

    function harvest(Transaction[] memory _transactions, Commodity _commodity, uint landIndex) public view returns (Farm memory farm) {
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
