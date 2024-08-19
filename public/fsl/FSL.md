## Guide

FSL ID only supports a single callback URI.

To support our different environments, we do front-end host mapping to point to the correct URL.

For each environment, we create a HTML page.

https://sunflower-land.com/fsl/production > production.html
https://sunflower-land.com/fsl/testnet > testnet.html
https://sunflower-land.com/fsl/hannigan ? hannigan.html

To add support for an environment create your own file and inside that file redirect to your API.
