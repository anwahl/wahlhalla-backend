<!-- Generator: Widdershins v4.0.1 -->

<h1 id="wahlhalla-task-tracking-api">Wahlhalla: Task Tracking API v0.0.1</h1>

> Scroll down for example requests and responses.

<h1 id="wahlhalla-task-tracking-api-default">Default</h1>

## schemas_components

`SCHEMAS components`

<h3 id="schemas_components-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="wahlhalla-task-tracking-api-assigned-task">Assigned Task</h1>

An entity that marries a task to a date and (optionally) to a person, which can be tracked with a completion status, and can have subtasks.

## get__api_assignedTask

`GET /api/assignedTask`

*returns a list of all assigned tasks*

Retrieves a list of all assigned tasks.

> Example responses

> 200 Response

```json
[
  {
    "id": 10,
    "personId": 5,
    "taskId": 56,
    "type": "WEEKLY",
    "timeOfDay": 600,
    "endTimeOfDay": 720,
    "dueDate": "2022-11-15T00:00:00.000Z",
    "occurrences": 12,
    "complete": true,
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z",
    "task": {
      "id": 31,
      "description": "task description",
      "typeId": 9,
      "targetId": 3,
      "value": 150,
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z",
      "target": {
        "id": 5,
        "description": "target description",
        "typeId": 2,
        "createdAt": "2023-01-01T01:13:51.000Z",
        "updatedAt": "2023-01-01T01:13:51.000Z"
      }
    },
    "person": {
      "id": 5,
      "firstName": "Annie",
      "lastName": "Wahl",
      "email": "admin@wahlhalla.com",
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z"
    }
  }
]
```

<h3 id="get__api_assignedtask-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_assignedtask-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|ID of the assigned task.|
|» personId|integer|false|none|The ID of the person assigned to the assigned task.|
|» taskId|integer|false|none|The ID of the task for the assigned task.|
|» type|string|false|none|The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].|
|» timeOfDay|string|false|none|The start time of the assigned task.|
|» endTimeOfDay|string|false|none|The end time of the assigned task.|
|» dueDate|string|false|none|The due date of the assigned task.|
|» occurrences|integer|false|none|The number of occurrences of the assigned task.|
|» complete|boolean|false|none|Whether the assigned task is complete.|
|» createdAt|string|false|none|The date the assigned task was created.|
|» updatedAt|string|false|none|The date the assigned task was updated.|
|» task|object|false|none|none|
|»» id|integer|false|none|ID of the task.|
|»» description|string|false|none|The task's description.|
|»» typeId|integer|false|none|The ID of the task type for the task.|
|»» targetId|integer|false|none|The ID of the target for the task.|
|»» value|integer|false|none|The value of the task.|
|»» createdAt|string|false|none|The date the task was created.|
|»» updatedAt|string|false|none|The date the task was updated.|
|»» target|object|false|none|none|
|»»» id|integer|false|none|ID of the target.|
|»»» description|string|false|none|The target's description.|
|»»» typeId|integer|false|none|The ID of the target type for the target.|
|»»» createdAt|string|false|none|The date the target was created.|
|»»» updatedAt|string|false|none|The date the target was updated.|
|» person|object|false|none|none|
|»» id|integer|false|none|ID of the person.|
|»» firstName|string|false|none|The person's first name.|
|»» lastName|string|false|none|The person's last name.|
|»» email|string|false|none|The person's email.|
|»» createdAt|date|false|none|The date the person was created.|
|»» updatedAt|date|false|none|The date the person was updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|type|DAILY|
|type|WEEKLY|
|type|BIWEEKLY|
|type|MONTHLY|
|type|YEARLY|
|type|STANDALONE|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_assignedTask_{id}

`GET /api/assignedTask/{id}`

*returns a single assigned task by the provided ID.*

Retrieves a single assigned task by the provided ID.

<h3 id="get__api_assignedtask_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the assigned task to retrieve.|

> Example responses

> 200 Response

```json
{
  "id": 10,
  "personId": 5,
  "taskId": 56,
  "type": "WEEKLY",
  "timeOfDay": 600,
  "endTimeOfDay": 720,
  "dueDate": "2022-11-15T00:00:00.000Z",
  "occurrences": 12,
  "complete": true,
  "createdAt": "2023-01-01T01:13:51.000Z",
  "updatedAt": "2023-01-01T01:13:51.000Z",
  "task": {
    "id": 31,
    "description": "task description",
    "typeId": 9,
    "targetId": 3,
    "value": 150,
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z",
    "target": {
      "id": 5,
      "description": "target description",
      "typeId": 2,
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z"
    }
  },
  "person": {
    "id": 5,
    "firstName": "Annie",
    "lastName": "Wahl",
    "email": "admin@wahlhalla.com",
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z"
  }
}
```

<h3 id="get__api_assignedtask_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a single assigned task joined with its task, the task's target, and the assigned task's person.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|cannot find assigned task with provided ID|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_assignedtask_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|ID of the assigned task.|
|» personId|integer|false|none|The ID of the person assigned to the assigned task.|
|» taskId|integer|false|none|The ID of the task for the assigned task.|
|» type|string|false|none|The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].|
|» timeOfDay|string|false|none|The start time of the assigned task.|
|» endTimeOfDay|string|false|none|The end time of the assigned task.|
|» dueDate|string|false|none|The due date of the assigned task.|
|» occurrences|integer|false|none|The number of occurrences of the assigned task.|
|» complete|boolean|false|none|Whether the assigned task is complete.|
|» createdAt|string|false|none|The date the assigned task was created.|
|» updatedAt|string|false|none|The date the assigned task was updated.|
|» task|object|false|none|none|
|»» id|integer|false|none|ID of the task.|
|»» description|string|false|none|The task's description.|
|»» typeId|integer|false|none|The ID of the task type for the task.|
|»» targetId|integer|false|none|The ID of the target for the task.|
|»» value|integer|false|none|The value of the task.|
|»» createdAt|string|false|none|The date the task was created.|
|»» updatedAt|string|false|none|The date the task was updated.|
|»» target|object|false|none|none|
|»»» id|integer|false|none|ID of the target.|
|»»» description|string|false|none|The target's description.|
|»»» typeId|integer|false|none|The ID of the target type for the target.|
|»»» createdAt|string|false|none|The date the target was created.|
|»»» updatedAt|string|false|none|The date the target was updated.|
|» person|object|false|none|none|
|»» id|integer|false|none|ID of the person.|
|»» firstName|string|false|none|The person's first name.|
|»» lastName|string|false|none|The person's last name.|
|»» email|string|false|none|The person's email.|
|»» createdAt|string|false|none|The date the person was created.|
|»» updatedAt|string|false|none|The date the person was updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|type|DAILY|
|type|WEEKLY|
|type|BIWEEKLY|
|type|MONTHLY|
|type|YEARLY|
|type|STANDALONE|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_assignedTask_{id}

`PUT /api/assignedTask/{id}`

*updates an assigned task by the provided ID.*

Updates an assigned task by the provided ID.

> Body parameter

```json
false
```

<h3 id="put__api_assignedtask_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the assigned task to update.|

<h3 id="put__api_assignedtask_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Assigned Task was updated successfully.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot update Assigned Task(s) with id={id}. Maybe Assigned Task was not found or req.body is empty!|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_assignedTask_{id}

`DELETE /api/assignedTask/{id}`

*deletes an assigned task by the provided ID.*

Deletes an assigned task by the provided ID.

<h3 id="delete__api_assignedtask_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the assigned task to delete.|

<h3 id="delete__api_assignedtask_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Assigned Task was deleted successfully!|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot delete Assigned Task with id={id}. Maybe Assigned Task was not found!|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Could not delete Assigned Task with id={id}|None|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_assignedTask_series_{id}

`PUT /api/assignedTask/series/{id}`

*updates all occurrences of assigned tasks in a series by the provided ID.*

Updates all occurrences of assigned tasks in a series by the provided ID.

> Body parameter

```json
false
```

<h3 id="put__api_assignedtask_series_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the assigned task to update and find the series of.|

<h3 id="put__api_assignedtask_series_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Assigned Task(s) was updated successfully.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot update Assigned Task(s) with id={id}. Maybe Assigned Task was not found or req.body is empty!|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_assignedTask_series_{id}

`DELETE /api/assignedTask/series/{id}`

*deletes an assigned task and its series by the provided ID.*

Deletes an assigned task and its series by the provided ID.

<h3 id="delete__api_assignedtask_series_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the assigned task to delete.|

<h3 id="delete__api_assignedtask_series_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Assigned Tasks were deleted successfully!|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot delete Assigned Task with id={id}. Maybe Assigned Task was not found!|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Could not delete Assigned Task with id={id}|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_assignedTask_

`POST /api/assignedTask/`

*creates an assigned task with the provided parameters.*

Creates an assigned task with the provided parameters

> Body parameter

```json
false
```

> Example responses

> 200 Response

```json
{}
```

<h3 id="post__api_assignedtask_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns the newly created assigned task.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="post__api_assignedtask_-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## get__api_assignedTask_person_{personId}

`GET /api/assignedTask/person/{personId}`

*returns a list of all assigned tasks assigned to provided person.*

Retrieves a list of all assigned tasks assigned to provided person.

<h3 id="get__api_assignedtask_person_{personid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|personId|path|integer|true|Numeric ID of the person to find the assigned tasks of.|

> Example responses

> 200 Response

```json
[
  {
    "id": 10,
    "personId": 5,
    "taskId": 56,
    "type": "WEEKLY",
    "timeOfDay": 600,
    "endTimeOfDay": 720,
    "dueDate": "2022-11-15T00:00:00.000Z",
    "occurrences": 12,
    "complete": true,
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z",
    "task": {
      "id": 31,
      "description": "task description",
      "typeId": 9,
      "targetId": 3,
      "value": 150,
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z",
      "target": {
        "id": 5,
        "description": "target description",
        "typeId": 2,
        "createdAt": "2023-01-01T01:13:51.000Z",
        "updatedAt": "2023-01-01T01:13:51.000Z"
      }
    },
    "person": {
      "id": 5,
      "firstName": "Annie",
      "lastName": "Wahl",
      "email": "admin@wahlhalla.com",
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z"
    }
  }
]
```

<h3 id="get__api_assignedtask_person_{personid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_assignedtask_person_{personid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|ID of the assigned task.|
|» personId|integer|false|none|The ID of the person assigned to the assigned task.|
|» taskId|integer|false|none|The ID of the task for the assigned task.|
|» type|string|false|none|The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].|
|» timeOfDay|string|false|none|The start time of the assigned task.|
|» endTimeOfDay|string|false|none|The end time of the assigned task.|
|» dueDate|string|false|none|The due date of the assigned task.|
|» occurrences|integer|false|none|The number of occurrences of the assigned task.|
|» complete|boolean|false|none|Whether the assigned task is complete.|
|» createdAt|string|false|none|The date the assigned task was created.|
|» updatedAt|string|false|none|The date the assigned task was updated.|
|» task|object|false|none|none|
|»» id|integer|false|none|ID of the task.|
|»» description|string|false|none|The task's description.|
|»» typeId|integer|false|none|The ID of the task type for the task.|
|»» targetId|integer|false|none|The ID of the target for the task.|
|»» value|integer|false|none|The value of the task.|
|»» createdAt|string|false|none|The date the task was created.|
|»» updatedAt|string|false|none|The date the task was updated.|
|»» target|object|false|none|none|
|»»» id|integer|false|none|ID of the target.|
|»»» description|string|false|none|The target's description.|
|»»» typeId|integer|false|none|The ID of the target type for the target.|
|»»» createdAt|string|false|none|The date the target was created.|
|»»» updatedAt|string|false|none|The date the target was updated.|
|» person|object|false|none|none|
|»» id|integer|false|none|ID of the person.|
|»» firstName|string|false|none|The person's first name.|
|»» lastName|string|false|none|The person's last name.|
|»» email|string|false|none|The person's email.|
|»» createdAt|string|false|none|The date the person was created.|
|»» updatedAt|string|false|none|The date the person was updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|type|DAILY|
|type|WEEKLY|
|type|BIWEEKLY|
|type|MONTHLY|
|type|YEARLY|
|type|STANDALONE|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_assignedTask_type_{type}

`GET /api/assignedTask/type/{type}`

*returns a list of all assigned tasks with the provided schedule type.*

Retrieves a list of all assigned tasks with the provided schedule type.

<h3 id="get__api_assignedtask_type_{type}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|type|path|string|true|Schedule type .|

> Example responses

> 200 Response

```json
[
  {
    "id": 10,
    "personId": 5,
    "taskId": 56,
    "type": "WEEKLY",
    "timeOfDay": 600,
    "endTimeOfDay": 720,
    "dueDate": "2022-11-15T00:00:00.000Z",
    "occurrences": 12,
    "complete": true,
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z",
    "task": {
      "id": 31,
      "description": "task description",
      "typeId": 9,
      "targetId": 3,
      "value": 150,
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z",
      "target": {
        "id": 5,
        "description": "target description",
        "typeId": 2,
        "createdAt": "2023-01-01T01:13:51.000Z",
        "updatedAt": "2023-01-01T01:13:51.000Z"
      }
    },
    "person": {
      "id": 5,
      "firstName": "Annie",
      "lastName": "Wahl",
      "email": "admin@wahlhalla.com",
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z"
    }
  }
]
```

<h3 id="get__api_assignedtask_type_{type}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_assignedtask_type_{type}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|ID of the assigned task.|
|» personId|integer|false|none|The ID of the person assigned to the assigned task.|
|» taskId|integer|false|none|The ID of the task for the assigned task.|
|» type|enum|false|none|The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].|
|» timeOfDay|time|false|none|The start time of the assigned task.|
|» endTimeOfDay|time|false|none|The end time of the assigned task.|
|» dueDate|date|false|none|The due date of the assigned task.|
|» occurrences|integer|false|none|The number of occurrences of the assigned task.|
|» complete|boolean|false|none|Whether the assigned task is complete.|
|» createdAt|date|false|none|The date the assigned task was created.|
|» updatedAt|date|false|none|The date the assigned task was updated.|
|» task|object|false|none|none|
|»» id|integer|false|none|ID of the task.|
|»» description|string|false|none|The task's description.|
|»» typeId|integer|false|none|The ID of the task type for the task.|
|»» targetId|integer|false|none|The ID of the target for the task.|
|»» value|integer|false|none|The value of the task.|
|»» createdAt|date|false|none|The date the task was created.|
|»» updatedAt|date|false|none|The date the task was updated.|
|»» target|object|false|none|none|
|»»» id|integer|false|none|ID of the target.|
|»»» description|string|false|none|The target's description.|
|»»» typeId|integer|false|none|The ID of the target type for the target.|
|»»» createdAt|date|false|none|The date the target was created.|
|»»» updatedAt|date|false|none|The date the target was updated.|
|» person|object|false|none|none|
|»» id|integer|false|none|ID of the person.|
|»» firstName|string|false|none|The person's first name.|
|»» lastName|string|false|none|The person's last name.|
|»» email|string|false|none|The person's email.|
|»» createdAt|date|false|none|The date the person was created.|
|»» updatedAt|date|false|none|The date the person was updated.|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_assignedTask_completion_{complete}

`GET /api/assignedTask/completion/{complete}`

*returns a list of all assigned tasks that are complete or not.*

Retrieves a list of all assigned tasks that are complete or not.

<h3 id="get__api_assignedtask_completion_{complete}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|complete|path|boolean|true|Whether the assigned tasks are complete.|

> Example responses

> 200 Response

```json
[
  {
    "id": 10,
    "personId": 5,
    "taskId": 56,
    "type": "WEEKLY",
    "timeOfDay": 600,
    "endTimeOfDay": 720,
    "dueDate": "2022-11-15T00:00:00.000Z",
    "occurrences": 12,
    "complete": true,
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z",
    "task": {
      "id": 31,
      "description": "task description",
      "typeId": 9,
      "targetId": 3,
      "value": 150,
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z",
      "target": {
        "id": 5,
        "description": "target description",
        "typeId": 2,
        "createdAt": "2023-01-01T01:13:51.000Z",
        "updatedAt": "2023-01-01T01:13:51.000Z"
      }
    },
    "person": {
      "id": 5,
      "firstName": "Annie",
      "lastName": "Wahl",
      "email": "admin@wahlhalla.com",
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z"
    }
  }
]
```

<h3 id="get__api_assignedtask_completion_{complete}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_assignedtask_completion_{complete}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|ID of the assigned task.|
|» personId|integer|false|none|The ID of the person assigned to the assigned task.|
|» taskId|integer|false|none|The ID of the task for the assigned task.|
|» type|string|false|none|The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].|
|» timeOfDay|string|false|none|The start time of the assigned task.|
|» endTimeOfDay|string|false|none|The end time of the assigned task.|
|» dueDate|string|false|none|The due date of the assigned task.|
|» occurrences|integer|false|none|The number of occurrences of the assigned task.|
|» complete|boolean|false|none|Whether the assigned task is complete.|
|» createdAt|string|false|none|The date the assigned task was created.|
|» updatedAt|string|false|none|The date the assigned task was updated.|
|» task|object|false|none|none|
|»» id|integer|false|none|ID of the task.|
|»» description|string|false|none|The task's description.|
|»» typeId|integer|false|none|The ID of the task type for the task.|
|»» targetId|integer|false|none|The ID of the target for the task.|
|»» value|integer|false|none|The value of the task.|
|»» createdAt|string|false|none|The date the task was created.|
|»» updatedAt|string|false|none|The date the task was updated.|
|»» target|object|false|none|none|
|»»» id|integer|false|none|ID of the target.|
|»»» description|string|false|none|The target's description.|
|»»» typeId|integer|false|none|The ID of the target type for the target.|
|»»» createdAt|string|false|none|The date the target was created.|
|»»» updatedAt|string|false|none|The date the target was updated.|
|» person|object|false|none|none|
|»» id|integer|false|none|ID of the person.|
|»» firstName|string|false|none|The person's first name.|
|»» lastName|string|false|none|The person's last name.|
|»» email|string|false|none|The person's email.|
|»» createdAt|string|false|none|The date the person was created.|
|»» updatedAt|string|false|none|The date the person was updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|type|DAILY|
|type|WEEKLY|
|type|BIWEEKLY|
|type|MONTHLY|
|type|YEARLY|
|type|STANDALONE|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_assignedTask_dueDate_{dueDate}

`GET /api/assignedTask/dueDate/{dueDate}`

*returns a list of all assigned tasks by due date.*

Retrieves a list of all assigned tasks by due date.

<h3 id="get__api_assignedtask_duedate_{duedate}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|dueDate|path|date|true|Due date of the assigned tasks.|

> Example responses

> 200 Response

```json
[
  {
    "id": 10,
    "personId": 5,
    "taskId": 56,
    "type": "WEEKLY",
    "timeOfDay": 600,
    "endTimeOfDay": 720,
    "dueDate": "2022-11-15T00:00:00.000Z",
    "occurrences": 12,
    "complete": true,
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z",
    "task": {
      "id": 31,
      "description": "task description",
      "typeId": 9,
      "targetId": 3,
      "value": 150,
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z",
      "target": {
        "id": 5,
        "description": "target description",
        "typeId": 2,
        "createdAt": "2023-01-01T01:13:51.000Z",
        "updatedAt": "2023-01-01T01:13:51.000Z"
      }
    },
    "person": {
      "id": 5,
      "firstName": "Annie",
      "lastName": "Wahl",
      "email": "admin@wahlhalla.com",
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z"
    }
  }
]
```

<h3 id="get__api_assignedtask_duedate_{duedate}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_assignedtask_duedate_{duedate}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|ID of the assigned task.|
|» personId|integer|false|none|The ID of the person assigned to the assigned task.|
|» taskId|integer|false|none|The ID of the task for the assigned task.|
|» type|string|false|none|The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].|
|» timeOfDay|string|false|none|The start time of the assigned task.|
|» endTimeOfDay|string|false|none|The end time of the assigned task.|
|» dueDate|string|false|none|The due date of the assigned task.|
|» occurrences|integer|false|none|The number of occurrences of the assigned task.|
|» complete|boolean|false|none|Whether the assigned task is complete.|
|» createdAt|string|false|none|The date the assigned task was created.|
|» updatedAt|string|false|none|The date the assigned task was updated.|
|» task|object|false|none|none|
|»» id|integer|false|none|ID of the task.|
|»» description|string|false|none|The task's description.|
|»» typeId|integer|false|none|The ID of the task type for the task.|
|»» targetId|integer|false|none|The ID of the target for the task.|
|»» value|integer|false|none|The value of the task.|
|»» createdAt|string|false|none|The date the task was created.|
|»» updatedAt|string|false|none|The date the task was updated.|
|»» target|object|false|none|none|
|»»» id|integer|false|none|ID of the target.|
|»»» description|string|false|none|The target's description.|
|»»» typeId|integer|false|none|The ID of the target type for the target.|
|»»» createdAt|string|false|none|The date the target was created.|
|»»» updatedAt|string|false|none|The date the target was updated.|
|» person|object|false|none|none|
|»» id|integer|false|none|ID of the person.|
|»» firstName|string|false|none|The person's first name.|
|»» lastName|string|false|none|The person's last name.|
|»» email|string|false|none|The person's email.|
|»» createdAt|string|false|none|The date the person was created.|
|»» updatedAt|string|false|none|The date the person was updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|type|DAILY|
|type|WEEKLY|
|type|BIWEEKLY|
|type|MONTHLY|
|type|YEARLY|
|type|STANDALONE|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_assignedTask_que_ry

`GET /api/assignedTask/que/ry`

*returns a list of all assigned tasks by query.*

Retrieves a list of all assigned tasks by query.

<h3 id="get__api_assignedtask_que_ry-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|dueDate|query|date|false|Due date of the assigned tasks.|
|complete|query|boolean|false|Completion status of the assigned tasks.|
|type|query|enum|false|Schedule type of the assigned tasks.|
|personId|query|integer|false|Person assigned to the assigned tasks.|

> Example responses

> 200 Response

```json
[
  {
    "id": 10,
    "personId": 5,
    "taskId": 56,
    "type": "WEEKLY",
    "timeOfDay": 600,
    "endTimeOfDay": 720,
    "dueDate": "2022-11-15T00:00:00.000Z",
    "occurrences": 12,
    "complete": true,
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z",
    "task": {
      "id": 31,
      "description": "task description",
      "typeId": 9,
      "targetId": 3,
      "value": 150,
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z",
      "target": {
        "id": 5,
        "description": "target description",
        "typeId": 2,
        "createdAt": "2023-01-01T01:13:51.000Z",
        "updatedAt": "2023-01-01T01:13:51.000Z"
      }
    },
    "person": {
      "id": 5,
      "firstName": "Annie",
      "lastName": "Wahl",
      "email": "admin@wahlhalla.com",
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z"
    }
  }
]
```

<h3 id="get__api_assignedtask_que_ry-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_assignedtask_que_ry-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|ID of the assigned task.|
|» personId|integer|false|none|The ID of the person assigned to the assigned task.|
|» taskId|integer|false|none|The ID of the task for the assigned task.|
|» type|string|false|none|The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].|
|» timeOfDay|string|false|none|The start time of the assigned task.|
|» endTimeOfDay|string|false|none|The end time of the assigned task.|
|» dueDate|string|false|none|The due date of the assigned task.|
|» occurrences|integer|false|none|The number of occurrences of the assigned task.|
|» complete|boolean|false|none|Whether the assigned task is complete.|
|» createdAt|string|false|none|The date the assigned task was created.|
|» updatedAt|string|false|none|The date the assigned task was updated.|
|» task|object|false|none|none|
|»» id|integer|false|none|ID of the task.|
|»» description|string|false|none|The task's description.|
|»» typeId|integer|false|none|The ID of the task type for the task.|
|»» targetId|integer|false|none|The ID of the target for the task.|
|»» value|integer|false|none|The value of the task.|
|»» createdAt|string|false|none|The date the task was created.|
|»» updatedAt|string|false|none|The date the task was updated.|
|»» target|object|false|none|none|
|»»» id|integer|false|none|ID of the target.|
|»»» description|string|false|none|The target's description.|
|»»» typeId|integer|false|none|The ID of the target type for the target.|
|»»» createdAt|string|false|none|The date the target was created.|
|»»» updatedAt|string|false|none|The date the target was updated.|
|» person|object|false|none|none|
|»» id|integer|false|none|ID of the person.|
|»» firstName|string|false|none|The person's first name.|
|»» lastName|string|false|none|The person's last name.|
|»» email|string|false|none|The person's email.|
|»» createdAt|string|false|none|The date the person was created.|
|»» updatedAt|string|false|none|The date the person was updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|type|DAILY|
|type|WEEKLY|
|type|BIWEEKLY|
|type|MONTHLY|
|type|YEARLY|
|type|STANDALONE|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_assignedTask_category_{category}

`GET /api/assignedTask/category/{category}`

*returns a list of all assigned tasks by specified category.*

Retrieves a list of all assigned tasks by specified category.

<h3 id="get__api_assignedtask_category_{category}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|category|path|string|true|Category of the assigned tasks' tasks' task type.|

#### Enumerated Values

|Parameter|Value|
|---|---|
|category|APPOINTMENT|
|category|BILL|
|category|CHORE|
|category|LIST|
|category|OTHER|

> Example responses

> 200 Response

```json
[
  {
    "id": 10,
    "personId": 5,
    "taskId": 56,
    "type": "WEEKLY",
    "timeOfDay": 600,
    "endTimeOfDay": 720,
    "dueDate": "2022-11-15T00:00:00.000Z",
    "occurrences": 12,
    "complete": true,
    "createdAt": "2023-01-01T01:13:51.000Z",
    "updatedAt": "2023-01-01T01:13:51.000Z",
    "task": {
      "id": 31,
      "description": "task description",
      "typeId": 9,
      "targetId": 3,
      "value": 150,
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z",
      "target": {
        "id": 5,
        "description": "target description",
        "typeId": 2,
        "createdAt": "2023-01-01T01:13:51.000Z",
        "updatedAt": "2023-01-01T01:13:51.000Z"
      }
    },
    "person": {
      "id": 5,
      "firstName": "Annie",
      "lastName": "Wahl",
      "email": "admin@wahlhalla.com",
      "createdAt": "2023-01-01T01:13:51.000Z",
      "updatedAt": "2023-01-01T01:13:51.000Z"
    }
  }
]
```

<h3 id="get__api_assignedtask_category_{category}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all assigned tasks joined with their tasks, those tasks' targets, and the assigned tasks' persons.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_assignedtask_category_{category}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|ID of the assigned task.|
|» personId|integer|false|none|The ID of the person assigned to the assigned task.|
|» taskId|integer|false|none|The ID of the task for the assigned task.|
|» type|string|false|none|The schedule type of the assigned task. In ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY', 'STANDALONE'].|
|» timeOfDay|string|false|none|The start time of the assigned task.|
|» endTimeOfDay|string|false|none|The end time of the assigned task.|
|» dueDate|string|false|none|The due date of the assigned task.|
|» occurrences|integer|false|none|The number of occurrences of the assigned task.|
|» complete|boolean|false|none|Whether the assigned task is complete.|
|» createdAt|string|false|none|The date the assigned task was created.|
|» updatedAt|string|false|none|The date the assigned task was updated.|
|» task|object|false|none|none|
|»» id|integer|false|none|ID of the task.|
|»» description|string|false|none|The task's description.|
|»» typeId|integer|false|none|The ID of the task type for the task.|
|»» targetId|integer|false|none|The ID of the target for the task.|
|»» value|integer|false|none|The value of the task.|
|»» createdAt|string|false|none|The date the task was created.|
|»» updatedAt|string|false|none|The date the task was updated.|
|»» target|object|false|none|none|
|»»» id|integer|false|none|ID of the target.|
|»»» description|string|false|none|The target's description.|
|»»» typeId|integer|false|none|The ID of the target type for the target.|
|»»» createdAt|string|false|none|The date the target was created.|
|»»» updatedAt|string|false|none|The date the target was updated.|
|» person|object|false|none|none|
|»» id|integer|false|none|ID of the person.|
|»» firstName|string|false|none|The person's first name.|
|»» lastName|string|false|none|The person's last name.|
|»» email|string|false|none|The person's email.|
|»» createdAt|string|false|none|The date the person was created.|
|»» updatedAt|string|false|none|The date the person was updated.|

#### Enumerated Values

|Property|Value|
|---|---|
|type|DAILY|
|type|WEEKLY|
|type|BIWEEKLY|
|type|MONTHLY|
|type|YEARLY|
|type|STANDALONE|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="wahlhalla-task-tracking-api-person">Person</h1>

An entity that is designed to track who a task is assigned to. More is planned in future versions.

## get__api_person

`GET /api/person`

*returns a list of all persons*

Retrieves a list of all persons.

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_person-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all persons ordered by last name.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_person-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_person_{id}

`GET /api/person/{id}`

*returns a person by ID.*

Retrieves person by ID.

<h3 id="get__api_person_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the person to retrieve.|

> Example responses

<h3 id="get__api_person_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a person found by specified ID.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot find person with id={id}.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_person_{id}-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## put__api_person_{id}

`PUT /api/person/{id}`

*updates a person by ID.*

Updates person by ID.

> Body parameter

```json
false
```

<h3 id="put__api_person_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the person to update.|

<h3 id="put__api_person_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Person was updated successfully.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot find person with id={id}.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_person_{id}

`DELETE /api/person/{id}`

*deletes an person by the provided ID.*

Deletes an person by the provided ID.

<h3 id="delete__api_person_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the person to delete.|

<h3 id="delete__api_person_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Person was deleted successfully!|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot delete Person with id={id}. Maybe Person was not found!|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Could not delete person with id={id}|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_person_

`POST /api/person/`

*creates an person with the provided parameters.*

Creates an person with the provided parameters

> Body parameter

```json
false
```

> Example responses

<h3 id="post__api_person_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns the newly created person.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="post__api_person_-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## get__api_person_name_{name}

`GET /api/person/name/{name}`

*returns a person by name.*

Retrieves person by name.

<h3 id="get__api_person_name_{name}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|name|path|string|true|Name of the person to retrieve.|

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_person_name_{name}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a person found by specified name.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_person_name_{name}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="wahlhalla-task-tracking-api-subtask">Subtask</h1>

An entity that can belong to an Assigned Task in a many-to-one relationship.

## get__api_subtask

`GET /api/subtask`

*returns a list of all subtasks*

Retrieves a list of all subtasks.

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_subtask-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all subtasks ordered by last name.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_subtask-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_subtask_{id}

`GET /api/subtask/{id}`

*returns a subtask by ID.*

Retrieves subtask by ID.

<h3 id="get__api_subtask_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the subtask to retrieve.|

> Example responses

<h3 id="get__api_subtask_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a subtask found by specified ID.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot find subtask with id={id}.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_subtask_{id}-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## put__api_subtask_{id}

`PUT /api/subtask/{id}`

*updates a subtask by ID.*

Updates subtask by ID.

> Body parameter

```json
false
```

<h3 id="put__api_subtask_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the subtask to update.|

<h3 id="put__api_subtask_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subtask was updated successfully.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot find subtask with id={id}.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_subtask_{id}

`DELETE /api/subtask/{id}`

*deletes an subtask by the provided ID.*

Deletes an subtask by the provided ID.

<h3 id="delete__api_subtask_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the subtask to delete.|

<h3 id="delete__api_subtask_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subtask was deleted successfully!|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot delete Subtask with id={id}. Maybe Subtask was not found!|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Could not delete subtask with id={id}|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_subtask_

`POST /api/subtask/`

*creates an subtask with the provided parameters.*

Creates an subtask with the provided parameters

> Body parameter

```json
false
```

> Example responses

<h3 id="post__api_subtask_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns the newly created subtask.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="post__api_subtask_-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## get__api_subtask_assignedTask_{assignedTaskId}

`GET /api/subtask/assignedTask/{assignedTaskId}`

*returns subtasks by assigned task.*

Retrieves subtasks by assigned task.

<h3 id="get__api_subtask_assignedtask_{assignedtaskid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|assignedTaskId|path|integer|true|ID of the assigned task of the subtasks to retrieve.|

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_subtask_assignedtask_{assignedtaskid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|subtasks found by specified assigned task.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_subtask_assignedtask_{assignedtaskid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_subtask_description_{description}

`GET /api/subtask/description/{description}`

*returns subtasks by name.*

Retrieves subtasks by name.

<h3 id="get__api_subtask_description_{description}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|description|path|string|true|Description of the subtasks to retrieve.|

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_subtask_description_{description}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|subtasks found by specified description.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_subtask_description_{description}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_subtask_assignedTask_{assignedTaskId}_description_{description}

`GET /api/subtask/assignedTask/{assignedTaskId}/description/{description}`

*returns subtasks by assigned task and description.*

Retrieves subtasks by assigned task and description.

<h3 id="get__api_subtask_assignedtask_{assignedtaskid}_description_{description}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|assignedTaskId|path|integer|true|ID of the assigned task of the subtasks to retrieve.|
|description|path|string|true|Description of the subtasks to retrieve.|

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_subtask_assignedtask_{assignedtaskid}_description_{description}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|subtasks found by specified assigned task and description.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_subtask_assignedtask_{assignedtaskid}_description_{description}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="wahlhalla-task-tracking-api-target">Target</h1>

An entity representing an object or place to be the target of tasks.

## get__api_target

`GET /api/target`

*returns a list of all targets*

Retrieves a list of all targets.

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_target-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all targets ordered by description.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_target-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_target_{id}

`GET /api/target/{id}`

*returns a target by ID.*

Retrieves target by ID.

<h3 id="get__api_target_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the target to retrieve.|

> Example responses

<h3 id="get__api_target_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a target found by specified ID.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot find target with id={id}.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_target_{id}-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## put__api_target_{id}

`PUT /api/target/{id}`

*updates a target by ID.*

Updates target by ID.

> Body parameter

```json
false
```

<h3 id="put__api_target_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the target to update.|

<h3 id="put__api_target_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Target was updated successfully.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot find target with id={id}.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_target_{id}

`DELETE /api/target/{id}`

*deletes an target by the provided ID.*

Deletes an target by the provided ID.

<h3 id="delete__api_target_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the target to delete.|

<h3 id="delete__api_target_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Target was deleted successfully!|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot delete Target with id={id}. Maybe Target was not found!|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Could not delete target with id={id}|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_target_

`POST /api/target/`

*creates an target with the provided parameters.*

Creates an target with the provided parameters

> Body parameter

```json
false
```

> Example responses

<h3 id="post__api_target_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns the newly created target.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="post__api_target_-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## get__api_target_type_{typeId}

`GET /api/target/type/{typeId}`

*returns a target by name.*

Retrieves target by name.

<h3 id="get__api_target_type_{typeid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|typeId|path|integer|true|ID of the target type of the targets to retrieve.|

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_target_type_{typeid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a target found by specified target type.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown errors|None|

<h3 id="get__api_target_type_{typeid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_target_description_{description}

`GET /api/target/description/{description}`

*returns a target by name.*

Retrieves target by name.

<h3 id="get__api_target_description_{description}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|description|path|string|true|Description of the targets to retrieve.|

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_target_description_{description}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a target found by specified target type.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_target_description_{description}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="wahlhalla-task-tracking-api-target-type">Target Type</h1>

An entity that is designed to describe a target.

## get__api_targetType

`GET /api/targetType`

*returns a list of all target types*

Retrieves a list of all target types.

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_targettype-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a list of all target types ordered by last name.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_targettype-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_targetType_{id}

`GET /api/targetType/{id}`

*returns a target type by ID.*

Retrieves target type by ID.

<h3 id="get__api_targettype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the target type to retrieve.|

> Example responses

<h3 id="get__api_targettype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a target type found by specified ID.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot find targetType with id={id}.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_targettype_{id}-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## put__api_targetType_{id}

`PUT /api/targetType/{id}`

*updates a target type by ID.*

Updates target type by ID.

> Body parameter

```json
false
```

<h3 id="put__api_targettype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the target type to update.|

<h3 id="put__api_targettype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TargetType was updated successfully.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot find target type with id={id}.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_targetType_{id}

`DELETE /api/targetType/{id}`

*deletes an target type by the provided ID.*

Deletes an target type by the provided ID.

<h3 id="delete__api_targettype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Numeric ID of the target type to delete.|

<h3 id="delete__api_targettype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TargetType was deleted successfully!|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Cannot delete Target Type with id={id}. Maybe TargetType was not found!|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Could not delete target type with id={id}|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_targetType_

`POST /api/targetType/`

*creates an target type with the provided parameters.*

Creates an target type with the provided parameters

> Body parameter

```json
false
```

> Example responses

<h3 id="post__api_targettype_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns the newly created target type.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="post__api_targettype_-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## get__api_targetType_description_{description}

`GET /api/targetType/description/{description}`

*returns a target type by description.*

Retrieves target type by description.

<h3 id="get__api_targettype_description_{description}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|description|path|string|true|Description of the target type to retrieve.|

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_targettype_description_{description}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|target types found by specified description.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|validation error|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|unknown error|None|

<h3 id="get__api_targettype_description_{description}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

