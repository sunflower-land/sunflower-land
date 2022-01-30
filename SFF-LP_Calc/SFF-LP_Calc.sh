#!/bin/bash
#
# The purpose of this module is to calculate the number of SFF tokens a player had in liquidity during the snapshot.  Hopefully other projects might find it useful.
# It was tested on CentOS 8 and Ubuntu 20.04.  The following dependencies must be installed: php, php-bcmath, php-json and curl.
#
# CentOS-> yum install php php-bcmath php-json curl
# Ubuntu-> apt install php php-bcmath php-json curl
#
# In order to gather the list of addresses in a Uniswap-v2 compatible liquidity pool, the CovalentHQ API is used.  As of January 2022, there is no charge for acquiring
# an API Key.  https://www.covalenthq.com/
#
# There are two files associated with this module:
#
# SFF-LP_Calc.sh
# This file is where all variables are specified.  The pool balance of SFF tokens at block 23451693 must be manually entered as a variable (currently estimates are
# placeholders).  The Polygon blockchain index at CovalentHQ is polled and JSON files are returned and written as files.  Then SFF-LP_Calc.php is executed against each
# of these files to return something more human readable.
#
# SFF-LP_Calc.php
# This performs the math part and converts each JSON file to a CSV.  The final value of each line of the CSV is the number of SFF tokens each wallet had during the snapshot.
#
# To run this calculator module, just execute SFF-LP_Calc.sh.
#
# prompt> ./SFF-LP_Calc.sh
#
# The final output is a CSV file with the following fields:
# contract_name,contract_ticker_symbol,contract_address,address,balance_adjusted,percent,block_height,award
# Where "award" is the number of SFF tokens a given wallet was managing.
#

APIKEY= # REQUIRED
SOURCEDATA=https://api.covalenthq.com
BLOCK=23451693 # This is the block height at which you are checking.
PAGESIZE=200 # For Sunflower Land, this is the maximum pagesize required.  Your project might need a higher value.
DAIBALANCE=2626.81801121502069791
ETHBALANCE=21479.571815287322932462
WMATICBALANCE=121440.42480161090989595
USDCBALANCE=7971.234589050222694769
USDTBALANCE=201.549277087792448983
QUICKBALANCE=201.549277087792448983

# Confirms API key was entered above in variable section
if [ -z ${APIKEY} ]; then
  echo "‘APIKEY’ variable is not set, exiting."
        exit
else
  echo "Your API Key is $APIKEY."
fi

# Quickswap SFF/DAI Pool
echo "Polling data for SFF/DAI on Quickswap."
curl "$SOURCEDATA/v1/137/tokens/0xe5b2c4d8bcbe27115b34c9a8400fff984fe480e8/token_holders/?key=$APIKEY&block-height=$BLOCK&page-size=$PAGESIZE" > sff-dai.json
echo ""

# Quickswap SFF/ETH Pool
echo "Polling data for SFF/ETH on Quickswap."
curl "$SOURCEDATA/v1/137/tokens/0x90c2bcab97204b1f06baea3ccdf5258f599dfa29/token_holders/?key=$APIKEY&block-height=$BLOCK&page-size=$PAGESIZE" > sff-eth.json
echo ""

# Quickswap SFF/WMATIC Pool
echo "Polling data for SFF/WMATIC on Quickswap."
curl "$SOURCEDATA/v1/137/tokens/0xcea1571d21de966aa5bcc23cec9bf16b7fec40d7/token_holders/?key=$APIKEY&block-height=$BLOCK&page-size=$PAGESIZE" > sff-wmatic.json
echo ""

# Quickswap SFF/USDC Pool
echo "Polling data for SFF/USDC on Quickswap."
curl "$SOURCEDATA/v1/137/tokens/0xfab88a7cdb9b0c81f958f0c8ccc1e9cbb6299704/token_holders/?key=$APIKEY&block-height=$BLOCK&page-size=$PAGESIZE" > sff-usdc.json
echo ""

# Quickswap SFF/USDT Pool
echo "Polling data for SFF/USDT on Quickswap."
curl "$SOURCEDATA/v1/137/tokens/0xc5b4f981831a055849d628a06cc5bbc4ad9448fd/token_holders/?key=$APIKEY&block-height=$BLOCK&page-size=$PAGESIZE" > sff-usdt.json
echo ""

# Quickswap SFF/QUICK Pool
echo "Polling data for SFF/QUICK on Quickswap."
curl "$SOURCEDATA/v1/137/tokens/0x4eb58cc0d969daa476b131432f51590cfdb5f7fa/token_holders/?key=$APIKEY&block-height=$BLOCK&page-size=$PAGESIZE" > sff-quick.json
echo ""
echo ""

# The syntax to convert the JSON files into something more human readable is:
# prompt> php <name of php calculation file> <input file> <output file> <SFF token supply of pool at snapshot>

echo "Compiling data into more human readable format."
echo ""
php SFF-LP_Calc.php sff-dai.json sff-dai-pool-balance.csv $DAIBALANCE
echo ""
php SFF-LP_Calc.php sff-eth.json sff-eth-pool-balance.csv $ETHBALANCE
echo ""
php SFF-LP_Calc.php sff-wmatic.json sff-wmatic-pool-balance.csv $WMATICBALANCE
echo ""
php SFF-LP_Calc.php sff-usdc.json sff-usdc-pool-balance.csv $USDCBALANCE
echo ""
php SFF-LP_Calc.php sff-usdt.json sff-usdt-pool-balance.csv $USDTBALANCE
echo ""
php SFF-LP_Calc.php sff-quick.json sff-quick-pool-balance.csv $QUICKBALANCE
echo ""

