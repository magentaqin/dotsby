# Lua Api

## Quickfix functions

Some quickfix related funcitons are registered into luaVm. The functions below generate a `go` structure represented by a `lua.LUserData`. You can call
methods of these go structures directly.

### New Message

* `quickfix.NewMessage() *quickfix.Message`

```lua
-- generate a lua.LUserData which is equal to a go *quickfix.message.
msg = quickfix.NewMessage()
```

* `quickfix.ExecutionReport() *ExecutionReport`

```lua
-- generate an empty *quickfix.ExecutionReport
report = quickfix.ExecutionReport()

-- call ExecutionReport's method
report:SetClOrdID("1500023232")
```


### Constructors

The functions below are constructor functions to convert lua type into a quickfix interface.

* `quickfix.FIXString(value) quickfix.FIXString`

```lua
symbol = quickfix.FIXString("JD") -- turn a lua.LString into a go quickfix.FIXString
```

* `quickfix.FIXDecimal(value, exp, scale) quickfix.FIXDecimal`
* `quickfix.FIXBoolean(value) quickfix.FIXBoolean`
* `quickfix.FIXInt(value) quickfix.FIXInt`
* `quickfix.FIXFloat(value) quickfix.FIXFloat`
* `quickfix.FIXBytes(value) quickfix.FIXBytes`
* `quickfix.FIXUTCTimestamp(value, precision) quickfix.FIXUTCTimestamp`

## Send result and rejectMessageError

* `SendResult(messagable, sessionId) error`

The first parameter `messagable` is a quickfix interface `Messagable`, usually a `quickfix.Message`. The
second parameter `sessionId` is optional, if it's `nil`,  `SendResult` tries to get session id from the first parameter.

* `SendRejectMessage(rejectMessageError)`

`SendRejectMessage` sends a `quickfix.MessageRejectError` and **terminates** the lua scripts.

## Order manager

* `om.Order() order`

Generate an empty `*engine.Order`.

* `OrderCreate(order) error`

`order` is a `*engine.Order` defined in fix simulator.

* `OrderUpdate(order) error`

* `OrderQuery(query) orders, error`

`query` is a table, here is an example:

```lua
query = {
  clOrderId = "xxxxxxxx"
  sessionId= "FIX.4.2:INCAAPEX->TRYCOSECS"
  orderType = OrdType_MARKET
  ordStatuses = {OrdStatus_CALCULATED}
  limit = 2
}
```
* `OrderGet(clOrdId, sessionId) order, error`

* `OrderGetAllWorkingOrder() orders`

Return an array of working orders.

## Utils

* `utils.StringToMessage(msgStr) *quickfix.Message, error`

Convert a string to a `*quickfix.Message`. If the string is invalid, returns an error.

* `utils.GetSessionId(message) sessionId, error`

Get `quickfix.SessionId` from a `*quickfxi.Message`.

* `utils.ConvertLuaTimeToGoTime(ts) *time.Time`

Convert a lua time stamp into a go `*time.Time`.