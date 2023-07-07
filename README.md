# Group generator

## Installation

Clone the repository, install the dependencies with `npm install` and run the project with `npm run dev`.  
The default port the server will use is 3000, you can change that in the vite.config.ts file that can be found in the root folder.

## Usage

In App.tsx, modify the content of the people const to reflect the team members you're trying to make groups with.  
If you forget someone, you can also add them to the list directly on the website (however they won't be saved if you refresh the page).  
Select the number of groups you want to make in the dropdown menu, select the method you want to use (descriptions below) and how many tries the algorithm should make (if you want the people to vote between different ways to split the groups for exemple).

> #### One by one
>
> Distribute the team members one by one to each group, like you would do if you were dealing cards.
>
> #### Chaotic
>
> Get a random member, and distribute him/her randomly to any of the groups with the least members of people (for example if group A has 3 people already while groupe B and C have 2, the person will be sent randomly to B or C).
>
> #### Get a random person
>
> Self-explanatory, if you just need to select one random person among your list.
