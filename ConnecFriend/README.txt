CONNECFRIEND — Assignment 1
Muhammad Asad Hayat Awan | 241792

RUN: Extract the ZIP and open index.html in Chrome or Edge.
Username: asad   Password: 1234
No installation, internet, API keys, or server required.

FILES
index.html: login page
home.html: feed, sharing, invitations, private messaging
profile.html: personal details, friend list and ratings
app.js: simple JavaScript functions and sample data
assets/: bundled Bootstrap 5.3.3 and original SVG avatars
Layout and components use Bootstrap classes. assets/theme.css adds only the custom
purple palette, background and focus colors unavailable as built-in classes.
assets/theme.js provides a saved light/dark toggle; dark mode is the default.

TRY THESE FEATURES
1. Wrong login shows an error; correct login opens Home.
2. Friends are ordered by latest login: Affan, Sara, Hamza.
3. Invite Zoya: pending request. Invite Ali: blocked by his ignore list.
4. Share news with everyone or selected friends. Empty choices are rejected.
5. Like/dislike a post. Click again to undo; switching removes your previous vote.
6. Open My profile and rate friends from 1 to 3.
7. Send separate private messages to friends or other members.
8. Reload: posts, ratings, invitations and messages remain in localStorage.

This is a frontend simulation, as requested by the assignment. Login is a demo,
not secure authentication. Messages are not delivered to real people; recipient
choices are simulated. Login times and other members' activity are sample data.
Private messages stay in separate local threads. Sign out ends the demo session.
To reset sample data, clear this page's site storage in browser settings.
If a browser blocks storage for local files, use VS Code Live Server.

CODE GUIDE
members and initial hold sample data. renderHome/renderFeed/renderProfile create
repeated cards. publish, invite, vote, rate and sendMessage update state; save
stores it. safe escapes user text so it is displayed instead of executed as HTML.

Review and personalize this work before submission; understand every function.
The assignment requires individual work. ZIP filename uses your roll number.
Bootstrap is included under the MIT license (see its CSS header).
