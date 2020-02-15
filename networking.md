# HTTP API:

## GET /api/client/create

```js
{
  id: "unique client id",
  ships: [
    {}
  ]
}
```

## GET /api/lobby

Headers:
 `x-client-id: <client id>`

```js
[
  {
    identifier: `${clientId}.${id}`,
    name: 'Player ${identifier}`,
    hue: 0-359,
    wins: 0,
    ready: false,
  },
  // ...
]
```

## GET /api/lobby/players/create

Headers:
 `x-client-id: <client id>`

```js
{
  identifier: `${clientId}.${id}`,
  name: 'Player ${identifier}`,
  hue: 0-359,
  wins: 0,
  ready: false,
}
```

GET /api/lobby/players/{identifier}/delete
Headers:
 `x-client-id: <client id>`

```js
{
  identifier: `${clientId}.${id}`,
  name: 'Player ${identifier}`,
  hue: 0-359,
  wins: 0,
  ready: false,
}
```

# Websocket API:

## Associate websocket to clientId

Client -> Server
`{ type: 'clientId:set', clientId: '...' }`

Good:

Server -> Client
`{ type: 'clientId:ok' }`

Bad:

Server -> Client
`{ type: 'error', message: '...' }`
