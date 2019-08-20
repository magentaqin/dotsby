# Fix simulator

Fix simulator which accepts quickfix message from ApexFix and handle transaction.

## Features

* Order management.
* User-defined transaction procedure (by lua script).
* Lua script management.

## Error Code

|HTTP status|error code|description|
|---|---|---|
|400|INVALID_SESSION_ID|session_id is invalid, empty session_id for some api whose session_id is required|
|400|INVALID_MSG_TYPE|msg type out of enum value|
|400|INVALID_SCRIPT|empty script|
|404|ORDER_NOT_FOUND|can not find order detail info in /order.get api|
|404|SCRIPT_NOT_FOUND|can not find script detail info in /script.get api|