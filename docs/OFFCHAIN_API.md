# SunflowerLand Offchain Open API

This documentation communicates how to query SunflowerLand's offchain API.

This information is relevant for developers who are looking to build custom tooling around SunflowerLand's most current, offchain data.

### Rate-Limits

There are some rate-limits imposed while querying this API. For best results, query these batch APIs at a 15 second interval. Querying at higher intervals will almost certainly result in failure response: `HTTP 429 Too Many Requests`.

## Batch Farm Data

Query current offchain state for a batch amount of farms.

### URL:

```
POST https://api.sunflower-land.com/community/getFarms
```

### Request Body:

A unique list of farmIds, no duplicates. You can query up to 100 farms per request.

```json
{
  "ids": [
    120,
    31878,
    ...
  ]
}
```

### Response Body:

A farm lookup, with the farmId as the key. If for some reason a requested farm could not be returned, its ID will exist in the "skipped" array.

```json
{
    "farms": {
        "120": {
            "balance": "11.96",
            "inventory": { ... },
            ...
        },
        "31878": {
            "balance": "4379.987803407873924",
            "inventory": { ... },
            ...
        }
    },
    "skipped": []
}
```

## Batch Bumpkin Data

Query current offchain state for a batch amount of bumpkins.

### URL:

```
POST https://api.sunflower-land.com/community/getBumpkins
```

### Request Body:

A unique list of bumpkinIds, no duplicates. You can query up to 100 bumpkins per request.

```json
{
  "ids": [
    1,
    22,
    ...
  ]
}
```

### Response Body:

A bumpkin lookup, with the bumpkinId as the key. If for some reason a requested bumpkin could not be returned, its ID will exist in the "skipped" array.

```json
{
    "bumpkins": {
        "1": {
            "id": 1,
            "experience": 417435.3,
            "achievements": { ... },
            "activity": { ... },
            "equipped": { ... },
            "skills": { ... },
            ...
        },
        "22": {
            "id": 22,
            "experience": 524732.9977500003,
            "achievements": { ... },
            "activity": { ... },
            "equipped": { ... },
            "skills": { ... },
            ...
        }
    },
    "skipped": []
}
```
