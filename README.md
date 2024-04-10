<p align="center">
  <img width="404" alt="Screenshot 2024-04-10 at 1 15 59 PM" src="https://github.com/devsgk/TechStory-client/assets/139360841/a1ad04f0-e5a6-487c-9566-8c94996f67ed">
</p>


<p align="center">
  Are you looking for “Medium-like tech-focused blog platform with GitHub-style approval feature?” You are on the right place!
</p>

<div align="center">
  
[Deployed](https://client.devsgk.work/)
/
[Frontend repository](https://github.com/devsgk/NeedleInHaystack-client)
/
[Backend repository](https://github.com/devsgk/NeedleInHaystack-server)

</div>

## 📒 Contents
- [✈️ Demo](#️-demo)
- [🔧 Tech Stacks](#-tech-stacks)
- [🙋🏻‍♂️ Introduction](#️-introduction)
- [💪 Motivation](#-motivation)
- [🧐 What is a text editor?](#-what-is-a-text-editor)
- [⛰️ Challenges](#️-challenges)
  1. [Problems when you try to control everything in state](#1-problems-when-you-try-to-control-everything-in-state)
  2. [How to manipuate DOM in more React-"nous" way?](#2-how-to-manipulate-dom-in-more-react-nous-way)
- [📚 What I learned](#-what-i-learned)
- [⏰ Project timeline](#-project-timeline)

<br>

## ✈️ Demo
To be updaed...

<br>

## 🔧 Tech Stacks

### Client
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

### Server
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

### Test
![Static Badge](https://img.shields.io/badge/vitest-8A2BE2?style=for-the-badge)
![Testing-Library](https://img.shields.io/badge/React%20Testing%20Library-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![JestDOM](https://img.shields.io/badge/Jest%20DOM-8A2BE2?style=for-the-badge)

### Deployment
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)
![AWS](https://img.shields.io/badge/Elastic%20Beanstalk-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

<br>

## 🙋🏻‍♂️ Introduction
: Welcome to the GitHub repository, showcasing my two-week solo project developed in Vanilla Coding Bootcamp in South Korea. Over the last five months, I have diligently applied myself to mastering both frontend and backend web development skills, and this project is a testament to that journey. I invite fellow developers to delve into the codebase, raise questions, and share comments or feedback. Let's embrace this opportunity to learn from each other and advance our journeys as developers. Cheers!

<br>

## 💪 Motivation
: During my journey to learn web development, I’ve always had three companions by my side: Medium blogs for learning insights, GitHub for code management, and Notion for organizing thoughts and notes. This mix of resources led me to an intriguing idea - what if Medium could adopt a GitHub-style approval mechanism and Notion’s interactive comment system? Amid these reflections, the core challenge of my project emerged: implementing a rich text editor from scratch. This project started as a "what-if" doodle in the margins of my notebook, mixing and matching the best parts of my favorite tools. It turned into a real-deal adventure in coding, aiming to create something that’s both a challenge and fun. Who knows? Maybe one day, we’ll see these changes for real!

<br>

## 🧐 What is a text editor?
: Let’s explore the definition of “text editor”. Essentially, a **rich-text** **editor** is “an interface for editing rich text within web browsers. It offers “**what-you-see-is-what-you-get**” (WYSIWYG) editing area, meaning what you see during the editing process is exactly what viewers will see upon rendering”.

So, what distinguishes a "rich-text" editor from a "plain-text" editor? Unlike "plain-text," which is like to typing in Notepad without any formatting options, "rich-text" provides users with the ability to enhance their content's style. This includes options for applying bold, italic, and underline styles, as well as adjusting font color and size, among other features. My project was focused on implementing this very functionality - a rich-text editor that brings your content to life!

During my Proof-Of-Concept process, I encountered several intriguing insights about text editor technologies that Naver’s development team introduced. Here's a brief summary of the core technologies utilized in their text editor development and some of the challenges encountered across different generations:

**1st Generation:**

- Utilized “contentEditable” and “HTML”.
- This approach faced challenges in supporting various devices.

**1.5th Generation:**

- Introduced a JSON type model.
- Users experienced unnatural interactions when selecting multiple elements.

**2nd Generation:**

- Introduced the concept of a virtual cursor.
- This approach solved the problem of unnatural interactions. However, users could not access some features with right-click options.

**3rd Generation:**

- The most recent text editor combined the traditional “contentEditable” with React and MobX.

FYI, Naver has a development team called “Smart Studio,” which is specifically organized to develop rich text editors with a group of more than 30 skilled developers. However, given the situation where I had to implement a rich text editor from scratch on my own in just 2 weeks, I decided to focus on what I could manage. In this project, I utilized “contentEditable”, “HTML”, and “React”.

<br>

## ⛰️ Challenges
### 1. Problems when you try to control everything in state

: Developing the frontend with React framework brought its own set of challenges, especially when I tried to strictly adhere React’s guideline for managing application state. Consider managing the state of a single word like “hello” when its styles such as bold, italic, underline, and font colors are applied in a nested fashion across different characters. This scenario required an extensive amount of code to function correctly. Moreover, the text editor’s need to process a high frequency of user events, including keyboard and mouse interactions, introduced a significant level of complexity. Attempting to manage all these events within the state resulted in functional issues.

Through my research, I discovered that many existing text editor libraries bypass these challenges by performing direct DOM manipulation. Inspired by this approach, I chose to tackle the obstacles by also adopting direct DOM manipulation. This strategy offered a practical solution to the challenges encountered, enabling a more efficient handling of styles and user interactions.

To implement this solution, I first enabled content editing by assigning the “contentEditable” property to a div, allowing user to input their text directly. I then leveraged the Web API’s “Selection” and “Range” objects to detect user’s mouse selection accurately. By integrating event listeners to the text editor, I detected the user’s action within the text editor and identify which styles they wished to apply. I then performed DOM manipulation to apply the desired text effect.

<br>

### 2. How to manipulate DOM in more React-"nous" way?

: After deciding to manipulate DOM, the question arose; “How can I do it in a way that aligns more closely with React principles?” React generally discourages users to perform direct DOM manipulation. Yet, in cases where it’s necessary, such as for a text editor, React does provide methods to safely interact with the DOM.

I used the “useRef” and “useForwardRef” hooks to gain direct access to DOM elements in a React-friendly way. The next step was to safely insert HTML into the DOM, where I turned to “dangerouslySetInnerHTML” property. As the name implies, React warns users about potential security risks when using “innerHTML” due to the possibility of XSS attacks. To address these concerns, I employed the DOMPurify library to sanitize user input before I inserted them into the DOM. This cleaned input was then managed using the “useState” hook to update the component’s state with sanitized HTML content. Finally, this state was used to set the “innerHTML” of the div, ensuring a secure way to dynamically render user content and safeguard against XSS threats.

Below is the summary of the steps on how I let React render user’s edited text content;

1. **Enable Text Input**: Apply the “contentEditable” property to a div, allowing users to freely input their text content.
2. **Sanitize Content**: Use “DOMPurify.sanitize” to clean the div’s innerHTML, ensuring the content is free from potentially harmful scripts or HTML.

```jsx
const sanitizedContent = DOMPurify.sanitize(ref.current.innerHTML);

```

3. **Update State with Sanitized Content**: Employ the setState method to update the component's state with the sanitized content, maintaining the application's reactivity and security.

```jsx
setState(sanitizedContent)
```

4. **Render Sanitized Content Safely**: Utilize the “dangerouslySetInnerHTML” property to inject the sanitized content back into the div. This method allows you to set the updated state as the HTML of the div safely.

```jsx
<div dangerouslySetInnerHTML={{ __html: updatedState }} />
```

<br>

## 📚 What I learned
: Working on this project was gave us a huge opportunity to deeply understand the principles behind the search engines we use daily. Real search engines utilize machine learning, AI, and manage much larger data sets, so we see endless challenges and opportunities for improvement in our project moving forward.

Among the achievable aspects, one area we're considering is how to further enhance search accuracy to deliver more personalized results to users. Storing users' search histories in the database has been our practice, but leveraging additional information like location and age could offer even more tailored results.

As for search speed, as we anticipate managing increasingly larger datasets, we're contemplating how to maintain quick search responses. This involves strategizing on data management and exploring ways to ensure that search speeds remain fast despite the growing volume of information.

Continual improvement and adaptation to these challenges are our key focuses, aiming to provide a search engine that not only meets but exceeds user expectations in terms of accuracy, speed, and personalized experience.

<br>
## What I learned
**From Dream to Reality**

: It was incredibly fulfilling to see a concept from my imagination materialize into something tangible. The transition from an idea to a working project was a vivid reminder of how creativity and technical skills can converge to create something meaningful.

**Doing It All**

This project was a true journey from start to finish. Starting with brainstorming, then moving through planning and development, each phase came with its own set of challenges. Facing and overcoming these challenges was not just about problem-solving; it was a process that fueled my enthusiasm for web development even more. Every obstacle I overcame propelled me forward, making me more invested in this field.

This entire experience was eye-opening. It pushed me to stretch my boundaries, honed my skills, and ignited an even deeper passion for web development. More than just a project, it was a comprehensive lesson in perseverance, innovation, and the joy of seeing your vision come to life.

## ⏰ Project timeline
**2024.03.04 - 2024.03.10**

- Brain storming for project ideas
- POC
- Planning
- KANBAN Task

**2024.03.11 - 2024.03.24**

- MERN stack environment setting
- Implement rich-text editor
- Implement full stack blog platform
- Engraft text editor into blog platform

**2024.03.25 - 2024.03.31**

- README
- Test code
- Deployment
