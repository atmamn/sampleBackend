/*
1. If password is tried unsuccessfully for login 3 times consecutively(within 15 mins). Forgot password option is suggested or try again after 1 day(account login suspension for 1 day).
2. How to generate image alts on the server/db
3. change user_id in venues table and user_id in users table to SMALLINT
4. change column name imgs in venue_imgs table to img
5.delete authenticateUser function
6.add timestamp to reviews table
7. There's a loop hole in event ratings/reviews. They don't reference so deleting doesn't delete both docs.
*/
