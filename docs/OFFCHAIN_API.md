# SunflowerLand Offchain Open API

This documentation communicates how to query SunflowerLand's offchain API.

This information is relevant for developers who are looking to build custom tooling around SunflowerLand's most current, offchain data.

### OpenAPI Schema

The OpenAPI schema is available within the documentation directory [openapi.json](./openapi.json)

### Rate-Limits

There are some rate-limits imposed while querying this API. For best results, query these batch APIs at a 15 second interval. Querying at higher intervals will almost certainly result in failure response: `HTTP 429 Too Many Requests`.

## Get Farms

Query current offchain state for a batch amount of farms.

### URL:

```
GET https://api.sunflower-land.com/community/farms
```

### Response Body:

```json
{
    "next_cursor": "abcd",
    "farms": [
      {
        "id": 120,
        "nft_id": 120,
        "farm": {
          "balance": "11.96",
          "inventory": { ... },
          ...
        }
      },
      {
        "id": 31878,
        "nft_id": 31878,
        "farm": {
          "balance": "4379.987803407873924",
          "inventory": { ... },
          ...
        }
      },
    ],
}
```

Use the `next_cursor` to fetch the the net page of farms.

```
GET https://api.sunflower-land.com/community/farms?cursor=abcd
```

## Get A Farm

Query current offchain state for one farm.

### URL:

```
GET https://api.sunflower-land.com/community/farms/{id}
```

### Response Body:

A farm lookup, with the farmId as the key.

```json
{
  "id": 120,
  "nft_id": 120,
  "farm": {
    "balance": "11.96",
    "inventory": { ... },
    ...
  }
}
```
