"# MEAN-Flapper-News" 
https://thinkster.io/tutorials/mean-stack


The following are a list of actions a user can perform:

view all posts<br />
Add a new post<br />
upvote a post<br />
view comments associated with a post<br />
add a comment<br />
upvote a comment<br />
The actions map directly to several routes, which are described as follows:<br />

GET /posts - return a list of posts and associated metadata<br />
POST /posts - create a new post<br />
GET /posts/:id - return an individual post with associated comments<br />
PUT /posts/:id/upvote - upvote a post, notice we use the post ID in the URL<br />
POST /posts/:id/comments - add a new comment to a post by ID<br />
PUT /posts/:id/comments/:id/upvote - upvote a comment<br />


Added Features:
*feature downvote: Implement a 'downvoting' feature.
*feature number of comments: Display the number of comments next to each post on the main page-done
*feature hide new comments box: use ng-hide to hide the 'new comment' and 'new post' input box until a user clicks a button to see the field-done
