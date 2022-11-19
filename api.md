# API v1 Spec

## GET `/api/v1/start`

Result:

```json
{
  "id": "123456",
  "name": "Data Something",
  "yAxisName": "Y Axis Name",
  "start": 1989,
  "end": 1999,
  "question": 2004
}
```

## GET `/api/v1/data/series`

Format: `/api/v1/data/series?id=123456&start=1989&end=1999`

Result:

```json
{
  "id": "123456",
  "name": "Data Something",
  "yAxisName": "Y Axis Name",
  "points": [
    {
      "year": 1989,
      "value": 1
    },
    {
      "year": 1990,
      "value": 2
    }
  ]
}
```

## GET `/api/v1/data/point`

Format: `/api/v1/data/point?id=123456&time=1989`

Result:

```json
{
  "year": 1989,
  "value": 1
}
```

## GET `/api/v1/search`

Format: `/api/v1/search?q=foo&start=1989&end=1999`

Result:

```json
[
  {
    "type": "dataset",
    "id": "123456",
    "name": "Data Something"
  },
  {
    "type": "article",
    "id": "123457",
    "name": "Article Something",
    "source": "The Guardian",
    "link": "https://...",
    "date": 1668892166
  }
]
```