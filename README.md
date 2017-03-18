"# MEAN-Flapper-News" 
https://thinkster.io/tutorials/mean-stack


The following are a list of actions a user can perform:

view all posts
Add a new post
upvote a post
view comments associated with a post
add a comment
upvote a comment
The actions map directly to several routes, which are described as follows:

GET /posts - return a list of posts and associated metadata
POST /posts - create a new post
GET /posts/:id - return an individual post with associated comments
PUT /posts/:id/upvote - upvote a post, notice we use the post ID in the URL
POST /posts/:id/comments - add a new comment to a post by ID
PUT /posts/:id/comments/:id/upvote - upvote a comment


Added Features
*feature downvote: Implement a 'downvoting' feature.
*feature number of comments: Display the number of comments next to each post on the main page-done
*feature hide new comments box: use ng-hide to hide the 'new comment' and 'new post' input box until a user clicks a button to see the field-done
