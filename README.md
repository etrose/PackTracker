# PackTracker
My Capstone Project

This Repo holds the expo React Native Project (aside from .gitignore files). 
The project was started from scratch as an expo project. expo is a free and open source toolchain built around React Native to help you 
build React Native apps quickly and has a great archive of included libraries to utilize.

The assets folder holds the locally stored pictures for the app such as logos and icons.
The src folder holds all of the apps React Native pages and components which are written with React.js, css, and jsx.

After opening the app for the first time the user will have the choice to either login to an existing account or register a new one. 
The app autimatically checks for user authentication and decides whether to route to the login page or the home page. 
The authentication checks with the Firebase server backend to ensure the user is properly authorized before accessing the data.

The user can then navigate to their profile to view their information, and add dog profiles.

The user can use the search tab to find any existing users or groups by simply typing into the search bar which outputs automatically.

The social pages include a GroupList which shows all the groups the user is a part of, and FriendList which shows all the user's 
current friends and friend requests.

While viewing a friend's profile, the user can send them a message which will show up in their friends inbox tab.

While view a group's page that the user is a member of, they can create a post in that group and it will show on the group's page.



