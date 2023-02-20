# Dean Town

## Description
Dean Town is an attempt to create a full-functioning e-commerce store from scratch using Express and EJS templating engine, fetching data from a MongoDB database.

## Disclaimer
**Payments and prices are not real. We are in no way making money through this project.**
This is purely a stylistic exercise.
All the rights to the photos used in our project belong to FreshCotton (www.freshcotton.com).

## Visit the shop
The store can be visited through the following link - https://iron-store.adaptable.app/.
It runs best on computer/laptop screens. When accessing the link on a smartphone make sure to display the desktop version on your mobile browser and you'll still be able to have a decent navigation experience.
The links in the navbar are always visible and will guide you through the shopping experience. Unlogged user can still browse the items in the shop, filter them in the all products page or access the single item details.

## Signup and Login
In order to start adding items to the cart the user must sign up or - in case they already have an account - log in.
The signup/login process will automatically redirect to the profile page where the user will find their randomly generated profile pictures along with their personal informations and shopping history (if available).
The user can update their personal data or their address informations at any time through the forms on this page.

## Products
Users can add items to their cart either through the all products page or through the item details page. The "add to cart" button will trigger a side panel on the right of the screen where the user can review their cart, modify quantity of any given item or even delete it.
The same options are available on the cart page, accessible through the link in the navbar.
The cart will be stored in a session inside the database, that means that even after logging out and logging back in the items will still be waiting for the user inside their cart.

## Checkout
Once the user is done browsing and ready for (fictitious) payment, they can navigate to the checkout page through the side cart or directly through the cart page.
If the user has not yet filled their address fields they will be prompted to do so, otherwise they will have one last chance to review the billing informations and the shopping cart along with the subtotal before clicking on the "pay now" button that will succesfully create the order and the user will be met by a confetti shower 🎊.
The newly placed order will be available for revision in the profile page under the shopping history section, along with every other order made by that same user.

## Known bugs
- No known bugs at the moment.

**Feel free to report to either Dean or Fabrizio if you encounter any bug, both UI or UX related.**

## Backlog
- Delete your own account.
- Better filters on products page.
- Edit products (for admins).
- Nodemailer for signup.
- Reset password.

## Links
### Repo
https://github.com/DeanStavenuiter/ironhack-ecommerce
### Deploy
https://iron-store.adaptable.app/
### Slides
https://docs.google.com/presentation/d/1C_AE0cJ2hiEQePKGgp0F6pN4QTbAIQ7kFKQ1q3oHxXE/edit?usp=sharing