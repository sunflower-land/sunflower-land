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

