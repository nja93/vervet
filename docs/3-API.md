# API

## Introduction

Makes use of the API route as defined in Next.js 13+. This approach was not strictly necessary as it in now possible to use server-side data fetching with server components in Next, but to allow for the future possibility of sharing the data with users on their personal services or third-parties, it was deemed wise to take this approach.

Almost all of the API routes are locked behind an authorization reqiurement but the restriction boundaries are not yet final and may be relaxed in future.

### Routes
|Route|Methods|Description|
|:----|:----|:----|
|/api/auth/[...nextauth]|GET|Get user and user session details|
| |POST|Add a new user|
|/api/v1/channels **\****|GET|Get available channels|
|/api/v1/feeds **\***|GET|Get all available feeds|
|/api/v1/feeds/[feedId]|GET|Get a partiuclar feed|
| |PUT|Edit a partucular feed|
| |DELETE|Remove a particular feed|
|/api/v1/feeds/[feedId]/notifications|GET|Get all notifications sent under a feed|
|/api/v1/feeds/[feedId]/subscriptions **\***|GET|Get all subscribed users in a field|
|/api/v1/feeds/[feedId]/templates **\***|GET|Get all feed templates under a feed|
|/api/v1/notifications|POST|Create a new notification event|
|/api/v1/notifications/[notificationId]|GET|Get back the details of a previous notification event|
|/api/v1/replies/[notificationId]|PUT|Record user sentiment to notification|
|/api/v1/search/general|GET|General search for users and feeds|
|/api/v1/subscriptions/[subscriptionId]|GET|Get the subscription object corresponding to the subscription id|
| |DELETE|Delete a subscription|
|/api/v1/templates|GET|Get all user templates and feed templates for all feeds|
|/api/v1/templates/feed **\***|GET|Get all feed templates under a feed|
|/api/v1/templates/feed/[feedId]|POST|Add a new template under a feed|
|/api/v1/templates/[templateId]|GET|Get a template details|
| |PUT|Edit a template|
| |DELETE|Delete a template|
|/api/v1/templates/user **\***|GET|Get all user templates|
| |POST|Add a user template|
|/api/v1/user/dashboardStats|GET|Statistical data for the user profile page|
|/api/v1/user/feeds **\***|GET|Get all feeds created by a user|
| |POST|Add a feed under a user|
|/api/v1/user/following **\***|GET|Get all feeds a user is following|
|/api/v1/user/following/[feedId]|GET|Get the feed details of a feed if the user is following it|
| |POST|Have user follow a new feed|
| |DELETE|Have user unfollow a feed|
|/api/v1/user/homeStats|GET|Statistical data for the home page|
|/api/v1/user/notifications **\***|GET|Get all notifications received by a user|
|/api/v1/user/subscriptions **\***|GET|Get a user's subscription data|
| |POST|Add a subscription to a user|
|/api/v1/user/templates **\***|GET|Get user templates|


> Fields with  **\*** have a access to a child route when you tack on '**/count**' to the end that returns a JSON of the number of items under the key **count** to assist in pagination.