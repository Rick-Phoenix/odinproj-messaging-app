# Pop! 

https://github.com/user-attachments/assets/0efc3d04-f131-4509-a87e-2551ce5a92bb

Since this my penultimate project for The Odin Project, I wanted to spend a bit more time describing what it is, what features it has, how I implemented them and what could be improved.

## The App

This is a concept for a messaging app, where users can send messages (and images) to one another, and also manage their profile with some basic info, as well as viewing other users' profiles. 

Users can send and manage friend requests, and they can create group chats where they can customize the name and identifying picture for the chat.

## How It's Made

### Backend

The backend is made with express, coupled with jwebtoken (for authentication), multer (for handling uploads), express-validator (for validating forms), the cloudinary API (for uploading images) and prisma (for database queries). 

When the user visits /signup and submits a form to register an account, the input is sanitized and validated with express-validator and the user is redirected to /login.

On /login, the user can log in to their account, and if logged in successfully, they will receive a JWT.

All other operations, like fetching chats, friend requests and all the other data, have to go through a middleware function that checks if the token is valid and if it isn't, it sends a response with code 401 or 403. 

### Frontend

The frontend is realized with React 19 (bundled with Vite) and React-Router.

The app is wrapped in a component that I've called "Functional Wrapper", which consists of the permanent parts of the app, namely the header and the footer. 

The presence and validity of the JWT is checked by the UserContext, which is responsible for fetching the user's data and passing it as context to the rest of the app. 
If there is an invalid or expired token, the user is redirected to the login page. 

All the different components handle some extra fetching operations for what they need (i.e. messages for chats, friend requests, etc) and use that data to generate their content.

## Potential Improvements

As this is only my second fullstack project, I am still learning how to optimize the composition of apps on the frontend and backend. 

Express's middleware chain-like structure makes it easier to understand processes in terms of a 'reaction-chain' of events, so the dynamics there are more or less straightforward, but as I was writing the app I realized how important it is to cover all scenarios in terms of authentication and security.

 On the frontend, the parts that could use more optimization and better structuring are two: state management and query handling. 

### Frontend
#### State Management

Right now, all the user data is managed by one overarching context, and passed down to all components from there. 

This can be problematic because as we all know, React Context triggers a rerender for any change that is applied to it, so in future projects (starting from the very next one, which will be my final project for TOP), my plan is to use a more granular composition for context, while also exploring the use of libraries like Zustand for more selective subscription to context. 

#### Query Handling

As I was developing the app, it quickly became clear to me that it is crucial to create a solid structure for queries, that allows the app to query less often while also sharing the results of those queries in an efficient way. 

While delving into a library like React Query felt a bit out of scope for this project, in my next project I will definitely start with that in mind, as I've learned that it's a crucial part of how an app's logic gets structured. 

#### CSS

As it might be evident from the single (and rather chaotic) .css file contained in this whole app, my approach to CSS so far has been agnostic and unstructured, and on purpose. While I tried imposing some rules and structures at the start of my learning journey, at one point I realized that I wasn't gaining any benefit from it, and that I needed to work with CSS more to really understand what I wanted and how I should structure my workflow with it. 

While admittedly I still do not have a strong view of how the structure of CSS files and rules should look like in my projects, I am slowly developing an idea of how to separate files and group classes and selectors in a better way.

While I have always had a good feel for UI/UX, I have always considered graphic design to be one of my weakest points, so I am using each of these projects as a way to analyze and define some basic design principles like the choice for colors, fonts, spaces, shapes and layouts, and while I feel like I still have a lot of work in front of me in that sense, I equally feel like I am moving in the right direction in terms of understanding how an app should be styled, both in principle (the idea, logic and purpose behind it) and in practice (the actual CSS programming needed to turn it into reality).

### Backend

#### Authorization And Security

What I've learned through the development of this app (and more generally during my studies of Express and backend coding) is that the authentication part is relatively simple, but handling the different layers of authorization is something that requires more careful planning, because if the logic is not structured properly, then all of the potential security situations (and the various combinations between these) have to be handled one by one, which ends up being inefficient as well as insecure.

#### Structured vs Unstructured DBs

Last but not least, I've ran into several hurdles while trying to manage self-relations with PostgreSQL, and while on the one hand I appreciate the benefits of relational databases, this experience has made me curious to try non-relational databases for the next projects, to see what the difference between the two might look like in terms of development experience.

## Closing Thoughts

As my journey with TOP is nearing a close, I am first of all appreciating what a truly wild ride it has been, going from having never written any line of code in my life to writing (modest, but still real) fullstack applications in the span of only three months. 

And on the more technical side, this project was really my first step in understanding how a full app really works, and how a developer should think about (and plan the execution of) the division of tasks and responsibilities between the front and back end, as well as finding the optimal integration and 'talking points' between the two.
