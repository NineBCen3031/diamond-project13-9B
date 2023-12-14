# Group 9B - Moderation

Project Manager: Race Eisman, Scrum Master: Zachary Maurno, Dev Team: Lucas Lim

## Project Features

### Moderation Page

Main page of the project, hosts most of the implemented features. <br/>
![moderation page2](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/e8a256ab-ca92-47ae-a6d4-659920df57cd)

### Report Overview
Pop-up that appears when clicking on flagged posts in the moderation page. <br/>
Allows teachers and administrators to quickly review reports and approve or reject questionable content.  <br/>
![report overview](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/5aa9e083-35c2-4e98-bb39-9f15ac8f0c7d)

### Muting Students
Teachers and administrators can mute problematic students to prevent them from posting in gallery.  <br/>
![muting](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/ac0f720b-797a-4555-a7b4-62b23f8e07c2)

### Moderation History
Review past moderation decisions on the history page, which is easily accessed from the moderation page. <br/>
![class history](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/a66cc37d-bc2f-4445-9e56-4338f2eeac9e)

### Reporting Posts
Posts can be reported from the gallery. You will be prompted for a report reason which will be saved, and the flag counter of the post incremented. <br/>
![reporting popup](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/931ffb22-d720-4902-a198-5f8825b2b65a)


## Users

### `Administrator` 
Have access to all classroom moderation pages and reports.

### `Teacher`
Have access to their own classrooms and reports.

### `Student`
Can report posts in the gallery. Reported posts will be sent for review when they have enough flags.


<br/>

# Running the Project

  ### Set-up the required programs as described in the CodeSparks repo, (Node, Docker, Strapi)

  ### Change permissions in Strapi
  `localhost:1337/admin` Will allow you to access the Strapi back-end. 

  Navigate to the Classroom Manager's permissions.
  ![classroom mangaer](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/c97199c3-e339-48e4-a8f0-565e3fd11486)

   <br/>

   Enable all content permissions.
  ![classroom manger 2](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/2b1e5035-e64d-40fa-926e-c5a8f31fb6ba)

  

  ### Add content as needed
  Navigate to the contents tab and click add new contents.
  ![creaitng content1](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/d300c301-c688-4f84-8468-2a6bcb7f5a72)

  <br/>

  Fill in all required fields for a piece of content, make sure to specify the classroom the content is for.
  ![creating content](https://github.com/NineBCen3031/diamond-project13-9B/assets/93298664/c75fbdd2-0d41-4670-a848-f0a9759abc16)


  ### Done!
  `localhost:3000` Will allow you to access the CodeSparks program. 
  Login using Username: "teacher" Password: "easypassword"

  As a teacher you can view the moderation page from the Dashboard. You can manage reports and content from there.
  


