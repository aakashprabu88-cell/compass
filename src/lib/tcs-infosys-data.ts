import { QuestionAnswer, CodingQuestion } from "./company-prep";

export const TCS_BEHAVIORAL: QuestionAnswer[] = [
  {
    question: "Why do you want to work at TCS?",
    answer: "During my final year, I attended a TCS campus webinar where a project manager explained how TCS helped a European banking client migrate their entire core banking system to the cloud in 18 months. That scale of transformation fascinated me. TCS has over 600,000 employees across 46 countries, which means I would get exposure to diverse client environments and global project methodologies. I'm also drawn to the ILP training program — structured onboarding that transforms freshers into industry-ready professionals within weeks. I want to build my foundation at a company that has a proven system for nurturing talent.",
    tips: "Reference a specific TCS initiative or project. Show you understand their global scale."
  },
  {
    question: "Describe a time you had to learn a new technology quickly for a project.",
    answer: "In my final semester, our capstone project required building a real-time data pipeline using Apache Kafka. None of us had used Kafka before — we only knew basic Java and SQL. I volunteered to learn it. I spent the first three days watching Confluent's official tutorials and reading Kafka documentation. By day four, I had a basic producer-consumer setup running locally. By day seven, I integrated it with our Spring Boot backend and a MySQL sink connector. I then created a short README and conducted a 30-minute knowledge-sharing session with my team so everyone could contribute. We delivered the project on time with a working pipeline processing 1,000 messages per second.",
    tips: "Show structured learning. Emphasize knowledge sharing with the team."
  },
  {
    question: "Tell me about a time you worked effectively in a team.",
    answer: "During a college hackathon, our four-person team had only 12 hours to build an emergency response coordination platform. I took on the backend role while two others handled frontend and one managed UI/UX. At hour six, the frontend developer's laptop crashed, losing two hours of work. Instead of panicking, I immediately paired with them on my laptop while another teammate continued the API integration. I shared my screen, we coded together, and recovered the lost work in 90 minutes. We finished with a working prototype and won third place. The experience taught me that team resilience matters more than individual brilliance.",
    tips: "Highlight how you supported the team during adversity. Mention the concrete outcome."
  },
  {
    question: "How do you handle pressure and tight deadlines?",
    answer: "I handle pressure through a three-step approach: list, prioritize, execute. When I had three assignment submissions and a project demo in the same week, I sat down and mapped every task to its deadline and effort required. I created a time-blocked schedule — mornings for the highest-priority assignment, afternoons for the project, and evenings for the remaining assignments. I also communicated proactively with my team that I would be less available for casual discussions. I delivered everything on time and scored well in all three. The key insight I learned: pressure becomes manageable when you convert anxiety into a plan.",
    tips: "Show a clear system. Give a specific example with measurable outcomes."
  },
  {
    question: "Tell me about a challenge you faced during a project and how you overcame it.",
    answer: "During my internship at a small IT firm, we were building an inventory management system for a retail client. Two weeks before delivery, the client changed their requirement — they wanted barcode scanning support, which was never in the original scope. The team was stressed. I researched browser-based barcode scanning libraries and found QuaggaJS. I built a proof-of-concept in two days, integrated it with our existing React frontend, and presented it to the client. They were impressed and signed off on the feature. The lesson: scope changes are inevitable in client projects, and the best response is to propose solutions quickly rather than push back.",
    tips: "Show adaptability and client-facing maturity. Emphasize solution-oriented thinking."
  },
  {
    question: "Describe a situation where you showed leadership.",
    answer: "In our college coding club, participation in weekly contests was dropping — from 40 members to barely 12. I volunteered to revive it. I analyzed the problem: contests were too hard for beginners and scheduled at inconvenient times. I restructured the contests into three tiers (Beginner, Intermediate, Advanced), moved them to Sunday mornings, and created a leaderboard with monthly prizes funded by small contributions. I also started a 'buddy system' pairing experienced coders with newcomers. Within two months, participation tripled to 35+ students, and three club members qualified for ICPC regionals for the first time. Leadership is about diagnosing problems and building systems, not just giving orders.",
    tips: "Show you diagnosed the root cause. Quantify the improvement. Mention how you motivated others."
  },
  {
    question: "How do you handle criticism of your work?",
    answer: "I view criticism as free mentorship. During a code review in my internship, my senior reviewed my API module and pointed out that I was not handling null responses — my endpoints would crash if a database field was missing. Initially, I felt a bit embarrassed, but I asked him to walk me through a proper approach. He taught me about defensive programming and input validation. I not only fixed the immediate issue but also added null-checking patterns across all my endpoints. In the next review, he specifically appreciated the improvement. I learned that the best engineers are the ones who absorb feedback quickly and visibly improve.",
    tips: "Show maturity and growth mindset. Give a specific before-and-after example."
  },
  {
    question: "Tell me about a time you had to make a quick decision.",
    answer: "During a college fest, the registration website I built was supposed to go live at 9 AM. At 8:45 AM, I discovered a critical bug — duplicate registrations were possible because my unique constraint on email was case-sensitive. I had 15 minutes to fix it before 200 students tried to register. I chose the quickest safe fix: added a LOWER() function to the SQL query before inserting and created a temporary index. It took 10 minutes. The site went live on time and handled 350 registrations that day with zero duplicates. I later refactored it properly, but the lesson was: in production crises, pick the fastest correct fix and iterate later.",
    tips: "Show composure under pressure. Emphasize the tradeoff between speed and completeness."
  },
  {
    question: "Describe a time you went above and beyond for a teammate.",
    answer: "A classmate was struggling with her data structures assignment — specifically, implementing a hash table with chaining. She was frustrated and considering dropping the course. I spent three hours with her over a weekend, drawing diagrams of how buckets and chains work, writing pseudocode together first, and then helping her code it step by step. I did not write the code for her — I guided her through the logic. She submitted it on time and scored 85%. Later, she told me that session made data structures click for her. She went on to ace her placement interview, crediting that foundation. Helping others succeed is one of the most rewarding things I have done.",
    tips: "Show genuine care for others. Emphasize that you empowered, not rescued, the person."
  },
  {
    question: "How do you prioritize multiple tasks?",
    answer: "I use a simple Eisenhower-style matrix — urgent and important first, then important but not urgent, then urgent but not important, and finally neither. Last semester, I had a placement exam, a group project deadline, and a personal certification exam all in the same month. I mapped everything: the placement exam was most urgent and important, so I allocated 3 hours daily. The project was important but had more flexibility, so I contributed 2 hours daily in focused blocks. The certification could be rescheduled, so I deprioritized it and took it two weeks later. I cleared the placement round, delivered a strong project, and still got the certification.",
    tips: "Name a specific framework. Give a real example with time allocation. Show the outcome."
  },
  {
    question: "Tell me about a time you failed. What did you learn?",
    answer: "In my second year, I participated in a coding competition and froze during the second problem. It was a medium-difficulty dynamic programming question, and I kept trying to optimize before even writing the brute-force solution. I wasted 45 minutes and scored zero on that problem. After the contest, I analyzed my approach and realized I was trying to be perfect instead of being progressive. From then on, I always implement the brute force first, verify it against test cases, and then optimize. In my next competition, I applied this approach and climbed from rank 150 to rank 30 in my college. Failure taught me that progress beats perfection.",
    tips: "Be honest about the failure. Show concrete behavioral change. Quantify the improvement."
  },
  {
    question: "How do you deal with a team member who is not contributing?",
    answer: "I believe in addressing the issue with empathy first. During a group project, one member was consistently missing deadlines and not responding to messages. Instead of escalating immediately, I called him and learned he was dealing with family health issues. I spoke to the team lead and we redistributed his tasks while still giving him smaller responsibilities like documentation and testing — things he could do at his own pace. He ended up writing the best documentation in the project. The lesson: underperformance usually has a reason, and a good team leader investigates before accusing.",
    tips: "Show empathy and diplomatic problem-solving. Never badmouth the person."
  },
  {
    question: "Tell me about your most significant achievement.",
    answer: "Building a campus event management platform that is still used by my college two years after I graduated the project. It started as a small idea — my college had no centralized system for event registrations. I built a full-stack application using React, Node.js, and MongoDB. The platform handles event creation, registration, payment processing via Razorpay, and automated email confirmations. It has been used by 5,000+ students across 50+ events. I maintained it for a year after launch, fixed bugs, and trained two juniors to take over. Seeing something I built become part of the college's infrastructure taught me the power of building for real users.",
    tips: "Choose an achievement that shows long-term impact. Quantify the reach."
  },
  {
    question: "How do you stay updated with technology trends?",
    answer: "I follow a structured routine: I read Hacker News and TechCrunch daily for 15 minutes each morning, subscribe to newsletters like JavaScript Weekly and Java Weekly for curated content, and watch at least one technical talk or conference video on YouTube every week. I also maintain a personal Notion page where I log new technologies I learn about and track my learning progress. For hands-on learning, I pick one new tool or library every month and build a small project with it. This month, I explored Redis for caching. Last month, it was Docker containerization. This systematic approach ensures I am always growing technically without getting overwhelmed.",
    tips: "Be specific about your sources. Show a system, not just random browsing."
  },
  {
    question: "Describe a situation where you had to communicate a complex technical concept to a non-technical audience.",
    answer: "During my internship, the business team needed to understand why our application was slow during peak hours. I had to explain server load balancing, database indexing, and caching to people who barely knew what an API was. I used an analogy: I compared the server to a restaurant — if there is only one chef (server) and 100 orders come in at once, the kitchen backs up. Adding more chefs (load balancing), prepping common dishes in advance (caching), and organizing the kitchen layout (database indexing) solves the problem. The business team understood immediately and approved the infrastructure upgrade budget. Technical communication is about meeting the audience where they are.",
    tips: "Use a relatable analogy. Show you can bridge the technical-business gap."
  },
  {
    question: "How do you handle disagreements in a team?",
    answer: "I believe disagreements are healthy when handled respectfully. During a project debate about using MongoDB versus PostgreSQL for our application, I preferred PostgreSQL for its ACID compliance, while a teammate wanted MongoDB for its flexibility. Instead of arguing, I proposed a time-boxed experiment — build a small module with each database and compare performance for our specific use case. After a two-day spike, the results showed that PostgreSQL was 3x faster for our complex join queries. The team unanimously chose PostgreSQL. My teammate and I actually became closer after that because he appreciated that I did not just override his opinion — I let data decide.",
    tips: "Show respect for differing opinions. Emphasize data-driven resolution. Avoid personal attacks."
  },
  {
    question: "Tell me about a time you showed initiative without being asked.",
    answer: "During my internship, I noticed that the team spent 30 minutes every Monday morning manually compiling a status report from Jira tickets, Google Sheets, and Slack messages. Nobody asked me to fix this, but I built a simple Python script using the Jira and Slack APIs that auto-generated a formatted report every Monday at 8 AM and posted it in our Slack channel. The whole thing took me a weekend. The team lead was thrilled and saved about 2 hours every week. I later extended it to include a burndown chart visualization. Proactive improvements like these show that you care about the team's efficiency, not just your assigned tasks.",
    tips: "Show you identified a problem independently. Quantify the time saved. Mention follow-through."
  },
  {
    question: "How do you handle working with people from different backgrounds?",
    answer: "In my final year project, our team of five included students from three different states — Tamil Nadu, Rajasthan, and West Bengal — each with different communication styles and work preferences. One teammate preferred late-night coding sessions while I am a morning person. Another was more comfortable with spoken discussions while I prefer written documentation. I suggested we adopt async communication via a shared Notion workspace for updates and use 15-minute standup calls every morning for blockers. This respected everyone's style while keeping the team aligned. We delivered a strong project and learned from each other's perspectives. Diversity in teams always produces better outcomes.",
    tips: "Show cultural sensitivity. Emphasize adapting processes, not changing people."
  },
  {
    question: "Tell me about a time you had to manage conflicting priorities.",
    answer: "During placement season, I was simultaneously preparing for TCS NQT, studying for semester exams, and maintaining my coding practice on LeetCode. I created a strict daily schedule: 6 AM to 9 AM for aptitude and reasoning (NQT prep), 10 AM to 4 PM for college lectures and lab work, 5 PM to 7 PM for coding practice, and 8 PM to 10 PM for semester subjects. I used weekends for full-length mock NQT tests. The structured approach paid off — I scored in the 98th percentile in the NQT aptitude section and maintained a CGPA of 8.5. The key was not doing everything at once but doing one thing at a time with full focus.",
    tips: "Show time management skills. Give specific time blocks. Quantify the results."
  },
  {
    question: "Describe a time when you had to adapt to a significant change.",
    answer: "When the pandemic hit in 2020, my college shifted to fully online classes overnight. As the class representative, I had to help 60 students adapt. I quickly organized a Zoom orientation session, created a WhatsApp group for quick communication, set up a shared Google Drive for notes and assignments, and started recording lectures for students with poor internet connectivity. I also coordinated with professors to shift submission deadlines. Within two weeks, our class had the highest online attendance rate in the department. The experience taught me that adaptation starts with clear communication and empathy for what others are going through.",
    tips: "Show leadership during change. Focus on helping others adapt, not just yourself."
  },
  {
    question: "Tell me about a time you made a mistake and how you handled it.",
    answer: "During my internship, I accidentally pushed a database migration script to production without testing it on staging first. It dropped a column that had 50,000 records. I immediately notified my team lead within two minutes, and we restored the database from the most recent backup within 15 minutes. We lost only 10 minutes of data. After that, I volunteered to set up a Git pre-push hook that blocks direct pushes to the production branch and requires a staging environment sign-off. The team adopted it as a standard practice. I learned that mistakes are not fatal if you respond fast and build systems to prevent recurrence.",
    tips: "Own the mistake completely. Show immediate corrective action. Highlight the preventive measure."
  },
  {
    question: "How do you handle monotony and repetitive tasks?",
    answer: "I approach repetitive tasks with two strategies: automation and gamification. During data entry work for a college project, I had to migrate 2,000 records from Excel to MySQL. Instead of doing it manually, I wrote a Python script using openpyxl to parse the Excel file and a MySQL connector to insert records in bulk. What would have taken three days was done in 20 minutes. For tasks that cannot be automated, like running manual test cases, I gamify them — I set a personal record for speed and try to beat it each time. Turning mundane work into either an automation challenge or a speed challenge keeps me engaged and productive.",
    tips: "Show you look for efficiency. Mention automation as a mindset, not just a tool."
  },
  {
    question: "Tell me about a time you had to persuade someone.",
    answer: "My project team wanted to use plain HTML, CSS, and JavaScript for our final year project. I believed React would be better for our UI-heavy application because of component reusability. But the team was skeptical — nobody knew React and the learning curve seemed steep. I built a comparison: I created one page in plain JS (took 4 hours, 200 lines) and the same page in React (took 3 hours, 80 lines with reusable components). I also showed them that React had better state management for our form-heavy application. The data convinced the team. We learned React in one week and built the entire project in it. Two team members now list React as their primary skill on their resumes.",
    tips: "Persuade with evidence, not emotion. Show the before-and-after comparison."
  },
  {
    question: "How do you handle a situation where you disagree with your manager?",
    answer: "I respect authority but also believe in intellectual honesty. If I disagree with a technical decision, I present my case with data and let the manager make the final call. During my internship, my lead wanted to store session data in the application server's memory. I believed this would cause issues when we scaled to multiple servers. I prepared a short document comparing in-memory sessions versus Redis-based sessions, including cost analysis and scalability projections. My lead appreciated the thoroughness and agreed to switch. Even if he had not agreed, I would have respected his decision because once a call is made, execution matters more than who was right.",
    tips: "Show respect for hierarchy while demonstrating you can voice concerns professionally."
  },
  {
    question: "Describe a time when you had to build trust with a client or stakeholder.",
    answer: "During a freelance project, a client was initially hesitant to trust a fresher with their e-commerce website. I built trust through transparency: I created a shared Trello board where the client could see every task and its status in real time. I delivered the first milestone three days early with a working prototype. I scheduled weekly 15-minute demo calls to show progress and gather feedback. When I encountered a payment gateway integration issue, I did not hide it — I reported it immediately with a proposed solution and timeline. By the end of the project, the client gave me a five-star review and referred me to two other businesses. Trust is built through consistent delivery and honest communication.",
    tips: "Show proactive communication. Emphasize transparency and consistent delivery."
  },
  {
    question: "Tell me about a time you received negative feedback.",
    answer: "In my third year, a professor reviewed my project code and commented that it was functional but poorly structured — functions were too long, variable names were unclear, and there were no comments. Initially, I was defensive because the code worked. But I took a step back and realized he was right. I refactored the entire codebase over a weekend: broke long functions into smaller ones, renamed variables for clarity, added JSDoc comments, and created a README. The professor was impressed by the improvement and used my refactored code as an example for the next batch. That experience permanently changed how I write code — readability is now my top priority.",
    tips: "Show you absorbed the feedback gracefully. Highlight the visible improvement afterward."
  },
  {
    question: "How do you contribute to a positive work environment?",
    answer: "I believe small consistent actions create positive environments. In my college study group, I started a practice of sharing one useful resource or trick I learned each day in our WhatsApp group — a debugging technique, a shortcut key, a helpful article. This created a culture of sharing where others started doing the same. I also make it a point to publicly appreciate teammates' contributions during group discussions. During project presentations, I always acknowledge individual contributions before talking about the overall result. These habits are not grand gestures, but they compound over time into a supportive and collaborative team culture.",
    tips: "Show that positivity is a habit, not a one-time act. Give specific examples."
  },
  {
    question: "Tell me about a time you had to work with limited resources.",
    answer: "For a college project, we needed a cloud server for deployment but the college only provided shared servers that were unreliable. Our budget was zero. I discovered AWS Educate provides free credits to students. I signed up, set up an EC2 instance with a free-tier t2.micro, configured an RDS database also on the free tier, and deployed our application. I also set up CloudWatch monitoring to stay within the free usage limits. The project ran smoothly for four months on zero cost. When the credits ran low, I migrated the static frontend to Netlify and the backend to Render's free tier. Resource constraints push you to be creative.",
    tips: "Show creativity under constraints. Explain how you found alternatives. Quantify the savings."
  },
  {
    question: "How do you approach problem-solving in general?",
    answer: "I follow a systematic five-step approach: (1) Understand the problem completely — I restate it in my own words. (2) Break it into smaller sub-problems. (3) Solve the easiest sub-problem first to build momentum. (4) Combine solutions and test edge cases. (5) Optimize if needed. When I was building a URL shortener project, I broke it into: generating unique short codes, storing mappings, handling redirects, and tracking analytics. I solved each piece independently and integrated them. This approach also works for non-coding problems — during placement prep, I broke aptitude into quant, logical reasoning, and verbal sections and tackled each systematically.",
    tips: "Describe a repeatable framework. Show it applies to both technical and non-technical problems."
  },
  {
    question: "Tell me about a time you had to take a risk.",
    answer: "In my final year, I decided to skip the campus recruitment drive for a mid-size company that was hiring on my campus — a safe option with a confirmed offer — to focus entirely on preparing for TCS NQT, which was two months later. My parents and friends thought I was being reckless. I spent those two months intensively preparing: solved 150 aptitude problems, practiced 200 coding questions, and gave five mock tests. I scored in the top 1% in the NQT and received a much better role and compensation than the initial offer. Calculated risks, backed by hard work and preparation, have better odds than people think.",
    tips: "Show that the risk was calculated, not reckless. Emphasize the preparation behind the risk."
  },
  {
    question: "How do you handle feedback from peers during code reviews?",
    answer: "I treat code reviews as learning opportunities, not criticism. During my internship, a senior developer pointed out in a review that I was using nested callbacks instead of async/await, making the code hard to read. Instead of just fixing that one instance, I spent the evening refactoring my entire module to use async/await patterns and promises. I then asked the reviewer to re-review the changes. He was impressed and shared my refactored module as a good example in the team standup. Since then, I actively seek out code reviews — I believe the fastest way to improve as a developer is to have experienced people review your code.",
    tips: "Show enthusiasm for code reviews. Highlight that you improve the entire codebase, not just the flagged line."
  },
  {
    question: "Tell me about a situation where you had to balance quality with speed.",
    answer: "During a hackathon with a 24-hour deadline, our team had to build a working prototype of a food donation platform. At hour 18, we had the core features working but the UI looked rough and there were some edge cases in the order matching logic. I made a strategic decision: focus on making the core donation flow bulletproof (quality) and use a clean but simple CSS framework for the UI (speed). We skipped advanced features like push notifications and email verification. The result: a polished core experience with a clean interface. We won because the judges valued a working, reliable product over an ambitious but buggy one. Quality in the critical path always beats quality everywhere.",
    tips: "Show you can make smart tradeoffs. Explain what you chose to prioritize and why."
  },
  {
    question: "Describe a time when you had to manage expectations.",
    answer: "During a freelance project, the client initially asked for a full-featured e-commerce website with payment integration, inventory management, admin dashboard, and analytics — all within a one-month timeline and a modest budget. Instead of overpromising, I had an honest conversation. I proposed a phased approach: Phase 1 (Month 1) would cover product listing, cart, and Razorpay payment integration. Phase 2 (Month 2) would add inventory management and admin dashboard. Phase 3 (Month 3) would include analytics. The client appreciated the honesty and agreed. Phase 1 launched on time and the client saw revenue flowing in, which built confidence for Phase 2. Managing expectations early prevents disappointments later.",
    tips: "Show honesty over overpromising. Explain the phased approach. Highlight the positive outcome."
  },
  {
    question: "How do you handle situations where you don't know the answer?",
    answer: "I believe saying 'I don't know, but I will find out' is a strength, not a weakness. During a technical interview for an internship, the interviewer asked about WebSocket protocol internals — something I had used but never studied at the protocol level. I honestly said, 'I have used WebSocket through Socket.IO in my projects, but I am not deeply familiar with the protocol-level handshake. I would need to research the RFC 6455 specification for a detailed answer.' The interviewer appreciated the honesty and asked me about Socket.IO instead, where I performed well. Pretending to know everything erodes trust faster than admitting a gap and showing willingness to learn.",
    tips: "Show humility and honesty. Demonstrate you have a plan to fill the knowledge gap."
  },
];

export const TCS_HR: QuestionAnswer[] = [
  {
    question: "Tell me about yourself.",
    answer: "I am a recent CS graduate from a reputed engineering college with strong fundamentals in Java, Python, SQL, and web development. During college, I built a student management system using Java Spring Boot and MySQL that our department adopted for tracking 500+ students. I also completed a three-month internship at a local IT services firm where I worked on backend APIs and database optimization — I improved query performance by 40% using indexing and query rewriting. I have solved 200+ problems on LeetCode and regularly participate in coding contests. I am a quick learner, a team player, and I am excited to start my professional career at TCS where I can contribute to enterprise-scale projects while continuously growing.",
    tips: "Keep it under 2 minutes. Structure: education, projects, internship, skills, why TCS."
  },
  {
    question: "Why should TCS hire you?",
    answer: "TCS should hire me because I bring strong technical fundamentals, a demonstrated ability to learn quickly, and genuine enthusiasm for building software. I have hands-on experience with Java, Python, SQL, and web development — skills that are directly applicable to TCS's client projects across industries. My internship experience shows I can deliver production-quality work in a professional environment. Beyond technical skills, I am someone who takes ownership — during my college fest, I independently built the registration system that handled 500+ signups. I am also a collaborative team player who believes in knowledge sharing. Most importantly, I am coachable — I actively seek feedback and implement it immediately, which means I will grow rapidly within TCS's training ecosystem.",
    tips: "Combine technical skills with soft skills. Give specific evidence for each claim."
  },
  {
    question: "Where do you see yourself in 5 years?",
    answer: "In 5 years, I see myself as a senior developer or technical lead at TCS, working on complex client projects involving cloud computing and digital transformation. I want to have deep expertise in at least two technology domains — specifically cloud platforms like AWS or Azure and enterprise application development. I also plan to earn certifications like AWS Solutions Architect or Azure Developer Associate along the way. I am drawn to TCS's structured career progression from ASE to SE to SSE, and I want to follow that path while continuously upskilling. Eventually, I want to be in a client-facing role where I can bridge business requirements with technical solutions.",
    tips: "Be realistic. Show ambition within TCS's career structure. Mention specific certifications."
  },
  {
    question: "What are your strengths?",
    answer: "My three biggest strengths are: (1) Quick learning — I picked up Java Spring Boot in two weeks for a project and delivered a working prototype. This ability to ramp up fast on new technologies is critical in IT services where client requirements change frequently. (2) Problem-solving — I have solved 200+ coding problems on LeetCode and regularly participate in contests. I approach problems methodically: understand the requirement, plan the solution, implement step by step, and test thoroughly. (3) Communication — In group projects, I am usually the person who explains complex technical concepts to teammates in simple language. I believe clear communication is as important as technical skill, especially in a client-facing role at TCS.",
    tips: "Give 3 concrete strengths with brief examples. Be confident but not arrogant."
  },
  {
    question: "What are your weaknesses?",
    answer: "My biggest weakness is that I sometimes over-explain things. When discussing a technical concept or presenting a solution, I tend to go into excessive detail because I want to make sure everyone understands. I realized this during a college presentation when my guide told me I was using 10 minutes to explain something that could be covered in 3. Since then, I have been working on being more concise. I now practice the 'elevator pitch' approach — summarize in 30 seconds first, then offer to go deeper if the listener wants more detail. I am getting better at reading the room and adjusting my communication style accordingly.",
    tips: "Pick a real weakness. Show self-awareness. Most importantly, show active improvement."
  },
  {
    question: "Are you comfortable with night shifts?",
    answer: "Yes, I am comfortable with night shifts. During my college hackathons, I have worked through the night multiple times — from 8 PM to 6 AM — on project deadlines, so I am accustomed to being productive during non-standard hours. I understand that TCS serves global clients across different time zones, and night shifts are sometimes necessary to provide real-time support. I maintain a healthy sleep schedule and take care of my fitness, so I can perform well regardless of the shift timing. I also know that TCS provides proper night shift allowances and transportation, which reflects the company's commitment to employee well-being.",
    tips: "Be honest and positive. Show you understand why night shifts are necessary."
  },
  {
    question: "Are you willing to relocate?",
    answer: "Yes, absolutely. I understand that TCS serves clients across India and globally, and flexibility in location is part of the role. I have lived away from home during college for four years, so relocating is something I am very comfortable with. I am actually excited about the possibility of working in different cities because it exposes me to different project types, client environments, and cultures. If given a choice, I would prefer Bangalore or Hyderabad because of the thriving tech ecosystem there, but I am genuinely flexible about location. My priority is to get assigned to interesting projects where I can learn and contribute, not a specific pin code.",
    tips: "Be enthusiastic and genuine. Show flexibility while having a mild preference."
  },
  {
    question: "Why do you want to work in IT services rather than a product company?",
    answer: "I believe IT services offers a unique advantage for freshers: exposure to diverse technologies, domains, and client environments within a single career. In a product company, I might work on one technology stack for years. At TCS, I could work on a banking project using Java in one year and a healthcare AI project using Python the next. This breadth of exposure builds a versatile skill set that is hard to get elsewhere. I also appreciate the structured training programs like ILP that IT services companies provide — they invest heavily in building your foundation. After gaining 3-5 years of diverse experience, I will be well-positioned to specialize in whatever domain excites me the most.",
    tips: "Show that your choice is deliberate, not a fallback. Highlight the learning breadth."
  },
  {
    question: "Do you have any questions for us?",
    answer: "Yes, I have two questions. First, what does the typical ILP training experience look like for a fresher joining as an Assistant System Engineer, and what are the most common technology tracks that freshers get assigned to? Second, how does TCS support employees who want to pursue certifications or higher education while working? I ask because I am committed to continuous learning and want to understand the growth opportunities available from day one.",
    tips: "Always have questions ready. Ask about training, growth, or team structure — not salary."
  },
  {
    question: "How do you handle work-life balance?",
    answer: "I believe work-life balance is about efficiency during work hours rather than logging a fixed number of hours. During my internship, I noticed that the team that left on time was also the most productive team. I focus on working with deep concentration during office hours — using techniques like time-blocking and minimizing distractions — so I can deliver quality output without consistently working overtime. Outside work, I maintain a routine that includes physical exercise, reading, and coding practice. I understand that there will be crunch periods during critical project phases, and I am fully willing to put in extra hours when needed. But I also believe that sustainable performance requires balance.",
    tips: "Show maturity about balance. Demonstrate you can handle crunch when needed."
  },
  {
    question: "Tell me about your family background.",
    answer: "I come from a middle-class family in Tamil Nadu. My father is a government school teacher and my mother is a homemaker. Growing up in a teacher's household instilled in me the values of discipline, hard work, and continuous learning. I have one younger sibling who is currently in high school. My family has always supported my education and career aspirations, even when I wanted to invest in a coding bootcamp instead of traditional coaching. They taught me that investing in skills and knowledge always pays off in the long run. Being from a modest background has also made me grounded and hungry to build a successful career through merit and hard work.",
    tips: "Be genuine and brief. Show how your background shaped your values."
  },
  {
    question: "What do you know about TCS's ILP program?",
    answer: "TCS's Initial Learning Program, or ILP, is one of the most comprehensive onboarding programs in the Indian IT industry. It is a structured training program that runs for approximately 2-3 months, typically at TCS training centers in cities like Trivandrum, Ahmedabad, or Chennai. The program covers three phases: (1) Generic training on programming fundamentals, database concepts, and software engineering principles. (2) Technology-specific training where freshers learn the stack they will work on — Java, .NET, mainframe, or testing. (3) A final project that simulates a real client scenario. After ILP, freshers are allocated to projects based on business requirements and their training results. I see ILP as a critical foundation-building phase, and I am excited about it.",
    tips: "Show genuine research about the program. Mention specific training locations or phases."
  },
  {
    question: "What is your hobbies?",
    answer: "I have three main hobbies that also contribute to my professional growth. First, competitive programming — I solve coding problems daily on LeetCode and participate in weekly contests on Codeforces. It sharpens my problem-solving skills and keeps me technically sharp. Second, tech blogging — I write about my project experiences and learning journeys on Medium and have published several articles. It helps me consolidate my knowledge and improve my technical communication. Third, cricket — I play in my college cricket team, and it teaches me teamwork, quick decision-making under pressure, and how to handle both wins and losses gracefully. I believe these hobbies make me a well-rounded individual.",
    tips: "Connect hobbies to professional skills. Show you are well-rounded."
  },
  {
    question: "When can you join?",
    answer: "I can join within two to three weeks of receiving the offer letter. I have completed all my degree requirements and do not have any pending backlogs or commitments. I am eager to start the ILP program as soon as possible because I want to begin learning and contributing in a professional environment. If TCS has specific batch start dates, I am happy to align with whatever schedule works for the company. The sooner I can start, the sooner I can begin my professional journey and start adding value to the team. I am also flexible if the company needs me to join at shorter notice.",
    tips: "Be specific and show eagerness. Express flexibility with batch dates."
  },
  {
    question: "Salary expectations?",
    answer: "I understand that TCS follows a structured compensation band for freshers based on the role and NQT score. For the Assistant System Engineer role, I am aware of the industry-standard range and I am comfortable with whatever TCS offers within that band. As a fresher, my priority at this stage is to learn, grow, and build a strong foundation in a professional environment rather than focus solely on the starting salary. I trust TCS to offer fair compensation that is competitive with the market. I am also aware that TCS provides additional benefits like health insurance, provident fund, gratuity, and the invaluable ILP training, which add significant value beyond the base salary.",
    tips: "Show you know the standard range. Express flexibility. Emphasize learning over money."
  },
];

export const TCS_CODING: CodingQuestion[] = [
  {
    problem: "Reverse a String — Write a function to reverse a string without using the built-in reverse() method.",
    difficulty: "Easy",
    approach: "Use two pointers starting from both ends of the string. Swap the characters at the left and right pointers, then move them toward the center until they meet.",
    solution: `function reverseString(s) {
  const arr = s.split('');
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr.join('');
}`,
    complexity: "Time: O(n), Space: O(n) for the array conversion, O(1) extra space"
  },
  {
    problem: "Check for Palindrome — Determine if a given string reads the same forwards and backwards (ignore case and non-alphanumeric characters).",
    difficulty: "Easy",
    approach: "Clean the string by removing non-alphanumeric characters and converting to lowercase. Then use two pointers from both ends, comparing characters as they move inward.",
    solution: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    complexity: "Time: O(n), Space: O(n) for the cleaned string"
  },
  {
    problem: "Find the Factorial of a Number — Calculate the factorial of N using both iteration and recursion.",
    difficulty: "Easy",
    approach: "Iterative approach: initialize result as 1, multiply by each number from 2 to N. Recursive approach: base case when N <= 1 returns 1, otherwise N multiplied by factorial of N-1.",
    solution: `// Iterative
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Recursive
function factorialRec(n) {
  if (n <= 1) return 1;
  return n * factorialRec(n - 1);
}`,
    complexity: "Time: O(n), Space: O(1) iterative, O(n) recursive due to call stack"
  },
  {
    problem: "Print Fibonacci Series — Print the first N numbers in the Fibonacci sequence.",
    difficulty: "Easy",
    approach: "Initialize the first two numbers as 0 and 1. For each subsequent position, the value is the sum of the previous two numbers. Store results in an array and return.",
    solution: `function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result;
}`,
    complexity: "Time: O(n), Space: O(n)"
  },
  {
    problem: "Check for Anagram — Determine if two strings are anagrams of each other.",
    difficulty: "Easy",
    approach: "Create a character frequency map from the first string. Iterate through the second string and decrement frequencies. If all frequencies return to zero and lengths match, the strings are anagrams.",
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) {
    count[c] = (count[c] || 0) + 1;
  }
  for (const c of t) {
    count[c] = (count[c] || 0) - 1;
    if (count[c] < 0) return false;
  }
  return true;
}`,
    complexity: "Time: O(n), Space: O(1) — bounded by alphabet size"
  },
  {
    problem: "Print a Number Pattern — Print a right-angled triangle pattern of stars for N rows. For N=5, output should be a triangle with increasing stars per row.",
    difficulty: "Easy",
    approach: "Use nested loops. The outer loop runs from 1 to N for rows. The inner loop prints i stars for the i-th row. Print a newline after each row.",
    solution: `function printTriangle(n) {
  let result = '';
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      result += '* ';
    }
    result += '\\n';
  }
  return result;
}`,
    complexity: "Time: O(n²), Space: O(1) excluding output string"
  },
  {
    problem: "Find the Second Largest Element — Given an array of integers, find the second largest distinct element.",
    difficulty: "Easy",
    approach: "Initialize two variables: largest and secondLargest to -Infinity. Traverse the array. If current element is greater than largest, update secondLargest to largest and largest to current. Else if current is greater than secondLargest and not equal to largest, update secondLargest.",
    solution: `function secondLargest(arr) {
  let first = -Infinity, second = -Infinity;
  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num;
    }
  }
  return second === -Infinity ? null : second;
}`,
    complexity: "Time: O(n), Space: O(1)"
  },
  {
    problem: "Count Vowels and Consonants — Given a string, count the number of vowels and consonants in it.",
    difficulty: "Easy",
    approach: "Convert the string to lowercase. Iterate through each character. If the character is a vowel (a, e, i, o, u), increment the vowel counter. Otherwise, if it is a letter, increment the consonant counter.",
    solution: `function countVowelsConsonants(s) {
  const vowels = 'aeiou';
  let vowelCount = 0, consonantCount = 0;
  for (const c of s.toLowerCase()) {
    if (vowels.includes(c)) {
      vowelCount++;
    } else if (c >= 'a' && c <= 'z') {
      consonantCount++;
    }
  }
  return { vowels: vowelCount, consonants: consonantCount };
}`,
    complexity: "Time: O(n), Space: O(1)"
  },
  {
    problem: "Sum of Digits — Given a positive integer, find the sum of all its digits.",
    difficulty: "Easy",
    approach: "Use a loop: extract the last digit using modulo 10, add it to the sum, then remove the last digit by dividing by 10. Repeat until the number becomes 0.",
    solution: `function sumOfDigits(n) {
  let sum = 0;
  let num = Math.abs(n);
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  return sum;
}`,
    complexity: "Time: O(d) where d is the number of digits, Space: O(1)"
  },
  {
    problem: "Find the Missing Number — Given an array containing N distinct numbers from 0 to N, find the one number that is missing.",
    difficulty: "Easy",
    approach: "Calculate the expected sum of numbers from 0 to N using the formula N*(N+1)/2. Subtract the actual sum of elements in the array. The difference is the missing number.",
    solution: `function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, num) => acc + num, 0);
  return expectedSum - actualSum;
}`,
    complexity: "Time: O(n), Space: O(1)"
  },
  {
    problem: "Check Armstrong Number — Determine if a number is an Armstrong number (sum of each digit raised to the power of the number of digits equals the number itself).",
    difficulty: "Easy",
    approach: "Count the number of digits. Extract each digit using modulo 10, raise it to the power of the digit count, and sum all such values. If the sum equals the original number, it is an Armstrong number.",
    solution: `function isArmstrong(n) {
  const digits = String(n).split('').map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, d) => acc + Math.pow(d, power), 0);
  return sum === n;
}`,
    complexity: "Time: O(d) where d is the number of digits, Space: O(d)"
  },
  {
    problem: "Rotate an Array — Rotate an array of N elements to the right by K positions.",
    difficulty: "Easy",
    approach: "Calculate the effective rotation as K % N. The elements that should move to the front are the last K elements. Slice the array into two parts: the last K elements and the remaining elements, then concatenate them in reverse order.",
    solution: `function rotateArray(nums, k) {
  const n = nums.length;
  k = k % n;
  if (k === 0) return nums;
  return [...nums.slice(n - k), ...nums.slice(0, n - k)];
}`,
    complexity: "Time: O(n), Space: O(n)"
  },
  {
    problem: "SQL Query — Write a query to find the second highest salary from an Employee table.",
    difficulty: "Easy",
    approach: "Use a subquery to find the maximum salary that is less than the overall maximum salary. Alternatively, use LIMIT and OFFSET to skip the top record.",
    solution: `-- Approach 1: Using subquery
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- Approach 2: Using LIMIT/OFFSET
SELECT DISTINCT salary AS SecondHighestSalary
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET 1;`,
    complexity: "Time: O(n log n) for sorting approach, O(n) for subquery approach"
  },
  {
    problem: "Print Pascal's Triangle — Given N rows, print Pascal's triangle where each element is the sum of the two elements directly above it.",
    difficulty: "Medium",
    approach: "Initialize a 2D array. The first row is [1]. For each subsequent row, the first and last elements are 1, and each middle element is the sum of the two elements above it from the previous row.",
    solution: `function pascalsTriangle(n) {
  const triangle = [];
  for (let i = 0; i < n; i++) {
    triangle[i] = [];
    triangle[i][0] = 1;
    triangle[i][i] = 1;
    for (let j = 1; j < i; j++) {
      triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
    }
  }
  return triangle;
}`,
    complexity: "Time: O(n²), Space: O(n²)"
  },
  {
    problem: "Matrix Spiral Traversal — Given an M x N matrix, return all elements in spiral order (clockwise from outside to inside).",
    difficulty: "Medium",
    approach: "Maintain four boundaries: top, bottom, left, right. Traverse right across the top row, down the right column, left across the bottom row, and up the left column. After each traversal, shrink the corresponding boundary. Repeat until boundaries cross.",
    solution: `function spiralOrder(matrix) {
  const result = [];
  if (!matrix.length) return result;
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}`,
    complexity: "Time: O(M*N), Space: O(1) excluding output"
  },
];

export const INFOSYS_BEHAVIORAL: QuestionAnswer[] = [
  {
    question: "Why do you want to work at Infosys?",
    answer: "Infosys stands out because of its value-driven culture and genuine investment in employee learning. I participated in HackWithInfy during college, and the experience showed me that Infosys identifies and nurtures talent from campuses — the platform was well-designed, the problems were challenging, and the mentorship was excellent. Beyond HackWithInfy, Infosys's Lex platform provides a structured learning path that helps freshers become project-ready after training. I am also impressed by Infosys Topaz, the company's AI-first platform, which demonstrates that Infosys is not just maintaining legacy systems but actively innovating. I want to grow at a company that balances stability with innovation.",
    tips: "Mention HackWithInfy or INFYTQ. Reference specific Infosys platforms like Topaz or Lex."
  },
  {
    question: "Tell me about a time you had to adapt to a completely new environment.",
    answer: "When I started college in a different state, everything was new — the language, food, climate, and teaching style. Within the first week, I realized I was struggling with the fast-paced lectures. I adapted by forming a study group with three batchmates, recording lectures for later review, and visiting professors during office hours for clarification. By the end of the first semester, I was in the top 15% of my class. More importantly, I learned that adaptation is not about changing yourself but about building new systems and habits that work in the new environment. This skill will serve me well at Infosys, where I will be working with diverse teams and client environments.",
    tips: "Show personal growth. Connect the adaptation to professional readiness."
  },
  {
    question: "Describe a project where you demonstrated strong teamwork.",
    answer: "During my final year, our team of four built a hospital appointment booking system. I was responsible for the backend, one teammate handled the frontend, another managed the database design, and the last focused on testing. Midway through, our database designer fell ill for a week. I stepped in to handle basic database tasks while continuing my backend work, staying an extra three hours daily for seven days. I also conducted daily 15-minute sync-ups to keep everyone aligned. We delivered the project on time and received the highest grade in our batch. The experience showed me that teamwork is not about doing your assigned task — it is about doing whatever the team needs to succeed.",
    tips: "Show flexibility and initiative. Highlight how you supported the team beyond your role."
  },
  {
    question: "Tell me about a time you had to learn something completely new under time pressure.",
    answer: "Three weeks before our college tech fest, I was asked to build a real-time quiz platform that could handle 500+ simultaneous users. I had no experience with WebSockets or real-time technologies. I spent the first two days studying Socket.IO documentation and building a minimal chat application as practice. Days 3-5, I built the quiz server with room management, timer synchronization, and score tracking. Days 6-10, I integrated it with a React frontend. During the fest, it handled 600 concurrent users with sub-second latency. The key was breaking the learning into small, buildable milestones — not trying to master everything at once but focusing on what was needed for the next milestone.",
    tips: "Show a structured learning approach. Emphasize delivery under pressure."
  },
  {
    question: "How do you handle conflicts within a team?",
    answer: "I believe most conflicts arise from miscommunication, not genuine disagreements. During a group project, two teammates had a heated debate about using REST APIs versus GraphQL for our backend. Instead of taking sides, I suggested we spend one hour building a small prototype of each approach for our specific use case. The experiment revealed that GraphQL was better for our frontend-heavy application because it reduced the number of API calls from 12 to 3. Both teammates agreed with the data-driven result, and the conflict resolved naturally. I learned that the best way to handle conflicts is to redirect the energy from arguing to experimenting.",
    tips: "Show a constructive conflict resolution approach. Emphasize data over opinions."
  },
  {
    question: "Tell me about a time you showed initiative at work or in college.",
    answer: "In my college department, attendance was tracked manually by professors using paper sheets, which was time-consuming and error-prone. Nobody asked me to solve this, but I proposed building a simple web-based attendance system. I built it using React for the frontend and Node.js with SQLite for the backend. The system used roll number-based login, displayed real-time attendance percentages, and sent automated alerts to students below 75% attendance. My department head was impressed and piloted it with 200 students. Within a semester, three other departments adopted it. The project taught me that initiative is about identifying friction in everyday processes and building simple solutions to eliminate it.",
    tips: "Show you identified a problem independently. Emphasize adoption and scale of the solution."
  },
  {
    question: "Describe a situation where you had to manage your time effectively across multiple responsibilities.",
    answer: "During my third year, I was simultaneously managing my coursework, preparing for HackWithInfy, leading the college coding club, and working on a freelance project. I created a weekly time-blocking system: mornings from 6-9 AM were reserved for coding contest preparation and HackWithInfy practice. College hours were for lectures and labs. Evenings from 5-8 PM were for the freelance project. Weekends were split between club activities and catching up on coursework. I used Google Calendar with color coding and reminders. I successfully cleared HackWithInfy's first round, maintained an 8.2 CGPA, delivered the freelance project on time, and organized two successful club events. The key was treating my time like a resource to allocate, not something that just happens.",
    tips: "Give specific time allocation. Show measurable outcomes across all responsibilities."
  },
  {
    question: "Tell me about a situation where you had to give constructive feedback to someone.",
    answer: "During a group project, a teammate's code consistently had long, untestable functions — some were 100+ lines long. Other team members were complaining privately but not addressing it. I took the initiative to have a one-on-one conversation. Instead of saying your code is bad, I said: 'I noticed your API module has some really complex logic. Would it help if we pair-programmed and broke it into smaller functions? It would make testing easier.' He appreciated the approach and agreed. We spent two hours refactoring his module together. The functions became shorter, more testable, and he learned the single-responsibility principle in the process. Later, he thanked me for helping him improve without making him feel criticized.",
    tips: "Show diplomacy and empathy. Frame feedback as helping, not criticizing."
  },
  {
    question: "How do you handle situations where you have to work with a technology you dislike or find boring?",
    answer: "During my internship, I was assigned to test a legacy COBOL-based banking module. I had zero interest in COBOL or manual testing. But I reframed the challenge: instead of seeing it as boring, I saw it as a puzzle — how can I automate these repetitive test cases? I wrote Python scripts using subprocess to invoke COBOL programs and compared outputs against expected results. What was supposed to be two weeks of manual testing was completed in three days with better coverage. The experience taught me that even boring technologies have interesting problems if you look for them. I applied the same approach at Infosys — finding automation opportunities in any assignment, regardless of the technology.",
    tips: "Show you can find motivation in any situation. Emphasize the automation mindset."
  },
  {
    question: "Tell me about a time you failed in a competitive environment.",
    answer: "In my first attempt at HackWithInfy, I was confident because I had practiced 100+ problems. But during the actual contest, I panicked when I could not solve the first problem in 15 minutes. I spent all my time on it and missed two easier problems that I could have solved. I scored below the qualifying cutoff. After the contest, I analyzed my performance: the first problem was a medium-difficulty graph problem, while the other two were easy array problems. I had wasted time because of ego — I refused to skip a problem. For my second attempt, I adopted a strategy: solve all easy problems first, then medium, then hard. I qualified comfortably in the second round. Failure taught me that contest strategy matters as much as coding skill.",
    tips: "Be honest about the failure. Show clear analysis and behavioral change."
  },
  {
    question: "Describe a time when you had to convince a group to adopt a new approach.",
    answer: "Our college project team was building a mobile app using native Android (Java) with separate codebases for Android and iOS. I proposed using React Native to build a single cross-platform app. The team was resistant because nobody had used React Native before. I built a compelling case: (1) I created a small prototype of our login screen in both Java and React Native — the React Native version took 40% less code. (2) I showed that we could share 80% of the code between platforms. (3) I found three tutorial resources for the team to learn from. The data and the easy-to-adopt resources convinced the team. We switched to React Native, learned it in one week, and finished the project faster than expected.",
    tips: "Show you used evidence and made adoption easy. Do not just claim your idea was better."
  },
  {
    question: "How do you handle working with ambiguous requirements?",
    answer: "When requirements are ambiguous, I start by identifying what I know versus what I do not know, then I design the smallest possible experiment to fill the gaps. During a college project, the guide said, 'Build something innovative for the campus.' That was extremely vague. I created a survey of 100 students asking about their top three campus pain points. The results were clear: (1) finding empty study rooms, (2) tracking assignment deadlines, (3) getting real-time bus timings. I chose the first one because it had the highest demand and a feasible technical solution using IoT sensors. The key lesson: when facing ambiguity, gather data from stakeholders before building.",
    tips: "Show a systematic approach to reducing ambiguity. Emphasize stakeholder consultation."
  },
  {
    question: "Tell me about a time you had to balance quality with speed.",
    answer: "During a 48-hour hackathon, our team was building a disaster response coordination platform. At hour 30, we had the core features working — user registration, incident reporting, and a map view. The UI was functional but not polished, and we had not implemented input validation for all forms. I made a strategic decision: prioritize bulletproofing the core incident reporting flow (the most critical feature) and use a clean CSS framework (Bootstrap) for the UI instead of custom styling. We skipped features like email notifications and analytics. The judges praised our focused, reliable core experience, and we placed second. The lesson: polish the critical path deeply, and keep everything else good enough.",
    tips: "Show smart prioritization. Explain what you chose to focus on and why."
  },
  {
    question: "How do you handle situations where you disagree with a team's technical decision?",
    answer: "I present my case with evidence and respect the team's final decision. During a project, the team chose MongoDB for a system that needed complex multi-table joins for reporting. I believed PostgreSQL would be better because of its strong relational query support. I built a benchmark: I created 10 sample reporting queries in both databases with 100,000 records. PostgreSQL completed them in 2 seconds on average while MongoDB took 18 seconds because of multiple round trips. I presented the data to the team. They acknowledged the results and we used PostgreSQL for the relational data layer and MongoDB only for the document storage needs. The lesson: technical disagreements should be resolved by data, not by opinions or seniority.",
    tips: "Show data-driven decision-making. Emphasize respect for the team's process."
  },
  {
    question: "Tell me about your most challenging academic experience and how you handled it.",
    answer: "My toughest semester was when I took four core CS courses — Data Structures, Operating Systems, Database Systems, and Computer Networks — along with a lab course, all in the same semester. The workload was overwhelming. I adopted a strategy: I created a weekly study calendar with specific topics for each day. For Data Structures, I solved five problems daily. For Operating Systems, I focused on understanding concepts through visual diagrams rather than memorizing. For DBMS, I practiced SQL queries on LeetCode and HackerRank. For Networks, I watched NPTEL lectures at 1.5x speed. I maintained a study group of four people where we discussed difficult concepts. I finished the semester with an 8.4 CGPA, my best semester yet. The experience taught me that consistency and structured study beats last-minute cramming every time.",
    tips: "Show structured preparation. Quantify the improvement. Highlight study strategies."
  },
  {
    question: "How do you handle situations where your work is not recognized?",
    answer: "I focus on the work itself, not the recognition. During a group project, one teammate presented our final demo and received most of the credit from the evaluator, even though I had built the entire backend and database architecture. I did not feel bitter because I knew my contribution was solid, and my teammates knew it too. After the project, I made sure to include detailed contributions in my resume and project portfolio. I also learned to be more visible — sharing progress updates in team channels and presenting my own modules during internal reviews. Recognition follows consistent quality, and I trust that pattern over time. At Infosys, I plan to let my work quality speak for itself while also being proactive about sharing my contributions.",
    tips: "Show maturity. Do not complain. Focus on self-improvement and visibility."
  },
  {
    question: "Describe a time when you had to learn from a mistake made by someone else.",
    answer: "A senior developer at my internship left the company, and I inherited his codebase. I found several issues: hardcoded API keys in the source code, no environment variable configuration, and missing error handling in critical API endpoints. Instead of blaming him, I studied each issue to understand why it happened. The API keys were hardcoded because the project started as a prototype and never got refactored. The missing error handling was because of tight deadlines. I created a refactoring plan: moved all secrets to environment variables, added try-catch blocks with meaningful error messages, and set up ESLint rules to prevent similar issues in the future. The experience taught me that inheriting someone else's code is an opportunity to learn from their constraints and improve the system.",
    tips: "Show empathy for the previous developer. Focus on learning and improving, not blaming."
  },
  {
    question: "How do you handle repetitive tasks that are necessary but not intellectually stimulating?",
    answer: "I approach repetitive tasks with two strategies: automation and gamification. When I had to write 200 test cases for a module during my internship, I first automated 150 of them using a data-driven testing framework — a CSV file with input/output pairs and a simple test runner. For the remaining 50 edge cases that needed manual thought, I gamified them by setting personal speed records and tracking my progress on a spreadsheet. The entire task, originally estimated at five days, was done in two. The broader lesson: any task that feels repetitive is probably a candidate for automation. If it cannot be automated, make it fun by turning it into a challenge.",
    tips: "Show the automation mindset. Give a specific example with quantified time savings."
  },
  {
    question: "Tell me about a time you received recognition for your work.",
    answer: "During my final year, our team's capstone project — a campus navigation app — won the Best Innovation Award at our college tech fest. I was responsible for the backend API, real-time location tracking, and map data processing. The judges specifically appreciated the real-time crowd density feature, which I had built using WiFi access point signal strength data. The recognition felt rewarding because the project had a difficult start — we lost two weeks when our original approach to map data failed and we had to rebuild it. The award validated the persistence and the technical choices we made. More than the trophy, I valued that the app continued to be used by the college for two more years after we graduated.",
    tips: "Choose meaningful recognition. Connect it to a challenge you overcame."
  },
  {
    question: "How do you contribute to knowledge sharing in a team?",
    answer: "I believe knowledge hoarding weakens teams while knowledge sharing strengthens them. During my internship, I started a practice of writing short tech notes whenever I learned something new — even if it was just a useful Git command or a debugging technique. I maintained these in a shared Google Doc that the entire team could access. I also conducted two informal lunch-and-learn sessions: one on async/await patterns in JavaScript and another on Docker basics for deployment. Both sessions had 8-10 attendees. At Infosys, I plan to continue this habit through the Lex platform, internal tech talks, and mentorship programs. A team where everyone teaches everyone grows faster than one where knowledge flows in only one direction.",
    tips: "Show specific examples of knowledge sharing. Emphasize the benefit to the team."
  },
  {
    question: "Describe a situation where you had to step out of your comfort zone.",
    answer: "As an introvert, public speaking has always been challenging for me. When our coding club needed someone to present a workshop on Git and GitHub to 150 students, nobody volunteered. I forced myself to raise my hand because I believed I knew the material well enough to teach it. I prepared for a week — created a 30-slide deck, practiced the demo three times, and wrote down potential questions and answers. On the day, I was nervous for the first five minutes but then settled in when students started asking questions and I could engage in a conversation rather than a monologue. The workshop received a 4.5/5 rating. I learned that comfort zones expand only when you deliberately push them.",
    tips: "Show vulnerability and growth. Emphasize preparation as a way to manage fear."
  },
  {
    question: "How do you handle a situation where a project is not going as planned?",
    answer: "I start by diagnosing the root cause before reacting. During a semester project, we were behind schedule by two weeks with three weeks remaining. Instead of panicking, I called a team meeting and we analyzed why: two features were more complex than estimated, and we had lost time due to environment setup issues. I proposed a recovery plan: (1) cut the two most complex features to a basic version, (2) set up a shared Docker environment to eliminate setup problems, (3) increase daily sync-ups from weekly to every other day. We delivered the project on time with the core features fully working and the complex features in a demo-ready state. The evaluator gave us full marks for the delivered features. Recovery plans need honesty about what went wrong and decisiveness about what to change.",
    tips: "Show calm analysis under pressure. Emphasize the specific recovery actions taken."
  },
  {
    question: "Tell me about a time you helped improve a team process.",
    answer: "In my college coding club, we had a manual process for organizing weekly contests: someone would find a problem, create a contest on Codeforces, announce it on WhatsApp, and then manually track who participated. It was chaotic. I automated the entire pipeline: a Python script that pulled problems from a curated problem bank based on difficulty, created a Codeforces gym contest, sent announcements via a Telegram bot, and auto-updated a Google Sheet with participation and scores. The process went from taking one hour of manual effort to zero minutes. Participation increased by 35% because announcements were timely and consistent. The club has been using this system for over a year now.",
    tips: "Quantify the before-and-after. Show that the improvement was sustained."
  },
  {
    question: "How do you approach working with a difficult client or stakeholder?",
    answer: "I approach difficult interactions with empathy, preparation, and clear communication. During my freelance work, a client was very indecisive — changing requirements every other day. Instead of expressing frustration, I implemented a change request process: every new requirement needed to be submitted in writing with a business justification. I would then estimate the impact on timeline and cost. This formalized the process and helped the client prioritize their actual needs versus nice-to-haves. The project stabilized, and we delivered within two weeks of the original deadline. Difficult stakeholders usually need structure, not confrontation. Providing that structure is part of being a professional.",
    tips: "Show emotional intelligence. Focus on creating systems, not complaining about people."
  },
  {
    question: "Describe a time when you made a significant personal sacrifice for a team or project.",
    answer: "During my final year capstone project, I had planned a vacation with my family during the last two weeks before submission. But our project hit a critical integration issue between the mobile app and the backend API that nobody else could debug. I chose to cancel the trip and stay back to fix it. I spent four days debugging and discovered the issue was a timezone mismatch between the server and the mobile client. After fixing it, I documented the root cause and created a timezone handling guide for the team. My family was initially disappointed but understood when I explained the situation. The lesson: personal sacrifices are justified when the team genuinely needs you and the impact is significant. I would not sacrifice for every issue, but I will for critical ones.",
    tips: "Show that the sacrifice was genuine and meaningful. Emphasize the impact on the project."
  },
  {
    question: "How do you handle situations where you need to work with people who have different working styles?",
    answer: "I believe diversity in working styles is a strength, not a problem. During a group project, I worked with a teammate who was a perfectionist — she would spend hours polishing every detail before showing her work. I am more of an iterate-quickly person who builds fast and refines later. Initially, this caused friction because I wanted quick iterations and she wanted everything perfect before sharing. We found a middle ground: I would build features quickly and share rough drafts, and she would review them and suggest quality improvements. This combination of speed and quality gave us the best of both worlds. We delivered a polished product faster than either of us could have alone. Adaptability in working style is a professional superpower.",
    tips: "Show you value different approaches. Give a specific compromise that worked."
  },
  {
    question: "Tell me about a time you took responsibility for a team failure.",
    answer: "During a college hackathon, our team was disqualified because we submitted our project two minutes past the deadline. The submission portal closed at midnight and we hit submit at 12:02 AM. While it was a collective team decision to keep refining the project until the last minute, I was the team lead and it was my responsibility to manage the timeline. I did not blame my teammates. Instead, I acknowledged my failure to enforce a buffer time. I took the lesson seriously: in my next hackathon, I set a hard stop 30 minutes before the deadline for submission prep. We submitted with 25 minutes to spare and won third place. Accountability starts with accepting that as a leader, the team's failures are your failures.",
    tips: "Take full ownership. Show the concrete behavioral change that followed."
  },
  {
    question: "How do you stay motivated during long, demanding projects?",
    answer: "I stay motivated through three mechanisms: visible progress, small rewards, and remembering the purpose. During a three-month capstone project, I maintained a Kanban board on Trello where moving a card from 'In Progress' to 'Done' gave me a small dopamine hit. I also set small rewards — after completing each major module, I would treat myself to a movie or a dinner with friends. Most importantly, I kept the end goal visible: I had a sticky note on my desk that said 'This app will be used by 5,000 students.' When motivation dipped, that reminder of real impact pulled me back. Motivation is not a feeling — it is a system you build around yourself.",
    tips: "Show self-awareness about motivation. Give specific strategies that worked."
  },
  {
    question: "Tell me about a time you helped a struggling teammate.",
    answer: "A teammate in our project group was consistently submitting code with compilation errors and was visibly stressed. I sensed something was wrong and called him. He confessed that he had never programmed before college and was struggling with basic Java concepts while the rest of us seemed to breeze through. I offered to pair-program with him for one hour daily. I started with fundamentals: variables, loops, conditionals, then moved to object-oriented concepts. After two weeks, his code quality improved dramatically. More importantly, his confidence returned. He started solving problems independently and even contributed a clever algorithm for our project's search feature. Seeing someone grow because of your help is one of the most fulfilling experiences.",
    tips: "Show genuine empathy. Emphasize the person's growth, not your heroism."
  },
  {
    question: "How do you handle a situation where you realize you have made a wrong technical decision?",
    answer: "I believe the best engineers acknowledge mistakes quickly and correct them before they compound. During an internship, I chose to use client-side state management (Redux) for a small application that really only needed server-side state. After building three features, the codebase was bloated with boilerplate. I recognized the mistake, presented a migration plan to my team lead, and rebuilt the state management using simple React hooks and API calls. The codebase shrank by 40%, and features became faster to implement. I also wrote a short internal doc on 'when to use Redux versus hooks' that the team still references. Making wrong decisions is inevitable; persisting with them is a choice.",
    tips: "Show self-correction without excessive self-blame. Emphasize the learning and prevention."
  },
];

export const INFOSYS_HR: QuestionAnswer[] = [
  {
    question: "Tell me about yourself.",
    answer: "I am a fresh CS graduate from SRM University with strong fundamentals in Java, Python, and database management. During college, I developed a library management system using Java and MySQL that manages over 10,000 books and handles 500+ daily transactions. I also participated in HackWithInfy, solving 15 coding challenges in the practice rounds and clearing the first level. I am particularly interested in Infosys's work in digital transformation and cloud services — I have been following the Infosys Topaz AI platform and I find it impressive how Infosys is integrating AI across its service offerings. I am eager to start my career at a company that values innovation and continuous learning, which is exactly what Infosys is known for.",
    tips: "Be concise. Mention HackWithInfy or INFYTQ to show genuine connection to Infosys."
  },
  {
    question: "Why should Infosys hire you?",
    answer: "Infosys should hire me because I bring a combination of solid technical skills, a proven ability to learn fast, and genuine enthusiasm for technology. I have hands-on experience with Java, Python, SQL, and web development, which are core to many of Infosys's client projects. My participation in HackWithInfy demonstrates that I am already engaged with the Infosys ecosystem. Beyond technical skills, I am a strong communicator — I have organized coding workshops in my college and I thrive in collaborative environments. I am also adaptable: I picked up React Native in one week for a college project when we decided to go cross-platform. I will bring energy, a learning mindset, and a commitment to quality to any team at Infosys.",
    tips: "Combine technical skills with soft skills. Reference HackWithInfy naturally."
  },
  {
    question: "Why Infosys specifically and not TCS or Wipro?",
    answer: "What differentiates Infosys is its culture of values-driven innovation. While all IT services companies offer similar technical roles, Infosys's emphasis on learning through Lex, the HackWithInfy platform for talent identification, and the Infosys Topaz AI platform show a company that invests in both people and technology. I participated in HackWithInfy and was genuinely impressed by the quality of the problems and the mentorship. Infosys's global footprint across 56 countries also means diverse project exposure. Additionally, Infosys's founding philosophy under Mr. Narayana Murthy — that good governance and ethics drive long-term success — resonates with my own values. I want to build my career at a company where values and innovation coexist.",
    tips: "Be specific about what differentiates Infosys. Avoid generic answers."
  },
  {
    question: "Where do you see yourself in 5 years?",
    answer: "In 5 years, I see myself as a seasoned developer or tech lead at Infosys, with deep expertise in cloud computing and AI-driven solutions. I want to have worked on multiple client projects across different industries — banking, healthcare, or retail — to build domain knowledge alongside technical skills. I also plan to earn industry certifications like AWS Solutions Architect or Azure AI Engineer along the way. Eventually, I want to move into a role where I can mentor freshers and lead small teams, combining technical leadership with people management. Infosys's structured career progression from Systems Engineer to Technology Lead to Architect gives me a clear roadmap to follow.",
    tips: "Be realistic and specific. Show ambition within Infosys's career structure."
  },
  {
    question: "What are your strengths?",
    answer: "My three biggest strengths are: (1) Quick learning — I picked up React Native in one week for a college project when we decided to switch from native Android. This adaptability is critical in IT services where technologies change frequently. (2) Problem-solving — I have solved 200+ problems on LeetCode and cleared the first round of HackWithInfy. I approach problems methodically, starting with the simplest solution and optimizing from there. (3) Team collaboration — In every group project, I naturally take on a coordination role, ensuring everyone is aligned and blockers are resolved quickly. I believe these three strengths — adaptability, analytical thinking, and teamwork — make me a strong fit for Infosys's project-based work environment.",
    tips: "Give 3 strengths with brief examples. Connect them to the role at Infosys."
  },
  {
    question: "What are your weaknesses?",
    answer: "My biggest weakness is that I tend to take on too many tasks because I find it hard to say no. During my third year, I was simultaneously leading the coding club, managing a freelance project, and preparing for placements. It became overwhelming and my sleep schedule suffered. I learned that saying no is not a sign of weakness but of good judgment. Now, before taking on a new task, I evaluate whether I have the bandwidth to do it well. If not, I either defer it or suggest someone else who might be a better fit. I have gotten much better at this — last semester, I declined two commitments and focused on three key responsibilities, all of which I delivered successfully.",
    tips: "Pick a real weakness. Show a concrete behavioral change as a result."
  },
  {
    question: "Are you willing to work in any technology?",
    answer: "Absolutely. As a fresher, I believe the most valuable career strategy is to be versatile rather than specialize too early. I have a foundation in Java, Python, and web development, but I am equally excited to learn Salesforce, SAP, cloud platforms, or any emerging technology that Infosys works with. Infosys's business spans diverse technology stacks depending on client requirements, and I want to be flexible enough to contribute across projects. My track record of quick learning — picking up Spring Boot in two weeks, React Native in one week — means I can ramp up on any technology. I view every new technology assignment as an investment in my skill set, not a departure from my interests.",
    tips: "Show genuine flexibility. Back it up with evidence of quick learning."
  },
  {
    question: "Are you comfortable with relocation?",
    answer: "Yes, completely. I have been away from home for four years during college, so relocating for work is not an issue at all. I actually enjoy the experience of living in a new city — it broadens your perspective and helps you adapt to different environments. Infosys has Development Centers across India in Bangalore, Hyderabad, Pune, Mysore, and many other cities, and I am happy to work from any of them. I am particularly excited about the possibility of training at the Mysore campus during the initial learning program — I have heard it is one of the best corporate training facilities in the world. After training, I am ready to go wherever the company needs me, including client-site assignments.",
    tips: "Be enthusiastic. Mention the Mysore campus to show Infosys-specific knowledge."
  },
  {
    question: "What do you know about Infosys's services?",
    answer: "Infosys operates across several key service areas: (1) Digital Services including cloud computing, AI/ML, data analytics, and IoT solutions. (2) Business Process Management for automating and optimizing business operations. (3) Application Development and Maintenance for building enterprise applications. (4) Consulting for digital transformation. I am particularly impressed by Infosys Topaz, an AI-first platform using generative AI to accelerate client solutions. Infosys Cobalt, the cloud platform, demonstrates the company's cloud-first strategy. I am also aware of Infosys Aster for marketing automation. The company's partnerships with AWS, Azure, and GCP, combined with its own platforms, show a dual strategy of leveraging ecosystem partnerships while building proprietary solutions.",
    tips: "Know the top 3-4 services. Mention Topaz, Cobalt, or Aster by name."
  },
  {
    question: "What do you know about HackWithInfy?",
    answer: "HackWithInfy is Infosys's flagship coding competition for engineering students across India. It typically has multiple rounds: an initial online coding round with algorithmic problems, followed by intermediate rounds with increasing difficulty, and a final hackathon round where selected teams build a working prototype. The competition tests data structures, algorithms, and problem-solving skills. Top performers receive PPOs (Pre-Placement Offers) from Infosys. What I appreciate about HackWithInfy is that it is not just a hiring tool — it provides learning resources, practice problems, and mentorship throughout the process. I participated in HackWithInfy, solving 15 challenges in the practice rounds and clearing the first qualifying level. The experience gave me a realistic preview of Infosys's technical standards and learning culture.",
    tips: "Show detailed knowledge of HackWithInfy's structure. Mention your participation."
  },
  {
    question: "Do you have any questions for us?",
    answer: "Yes, I have two questions. First, after the Initial Learning Program at Mysore, what determines which technology track and project a fresher gets assigned to — is it based on NQT scores, preferences, or business needs? Second, how does Infosys support employees who want to pursue certifications like AWS or Azure while working? I ask because I am committed to continuous learning from day one, and I want to understand the growth opportunities and support systems available.",
    tips: "Always have questions ready. Ask about training, technology allocation, or growth."
  },
  {
    question: "How do you handle work-life balance?",
    answer: "I believe work-life balance comes from working efficiently during office hours rather than just logging more hours. During my internship, I noticed that the most productive team members were also the ones who left on time because they maintained focus during work hours. I use time-blocking and the Pomodoro technique to stay focused and avoid unnecessary overtime. Outside work, I maintain a routine that includes physical exercise, reading, and competitive programming practice. I understand that there will be crunch periods during go-lives or critical project phases, and I am fully prepared to put in extra hours when needed. But I also believe sustainable performance requires balance — burnt-out engineers do not produce quality work.",
    tips: "Show maturity about balance. Demonstrate you can handle crunch when needed."
  },
  {
    question: "Tell me about your family background.",
    answer: "I come from a middle-class family in Andhra Pradesh. My father runs a small retail business, and my mother is a school teacher. Growing up, I saw my father manage every aspect of his business — from accounting to customer relationships — which instilled in me the value of ownership and hard work. My mother, being a teacher, emphasized the importance of education and continuous learning from an early age. I have one younger sister who is pursuing her engineering degree. My family has always supported my decisions, including my choice to focus on competitive programming and HackWithInfy preparation instead of traditional placement coaching. Their support and values have made me grounded, resilient, and eager to build a meaningful career.",
    tips: "Be genuine and brief. Show how your background shaped your values."
  },
  {
    question: "When can you join?",
    answer: "I can join within one to two weeks of receiving the offer letter. I have completed all my degree requirements and do not have any pending backlogs or obligations. I am eager to begin the Initial Learning Program as soon as possible because I want to start learning in a professional environment and contributing to the team. If Infosys has specific batch start dates for the training program at Mysore, I am happy to align with whatever schedule works for the company. I am also flexible if the company needs me to join at shorter notice. The sooner I can start, the sooner I can begin my professional journey.",
    tips: "Be specific and show eagerness. Express flexibility with batch dates."
  },
  {
    question: "Salary expectations?",
    answer: "I understand that Infosys follows a structured compensation band for freshers based on the role and performance in the selection process. For the Systems Engineer role, I am aware of the industry-standard range and I am comfortable with whatever Infosys offers within that band. As a fresher, my primary focus is on learning, growth, and building a strong technical foundation rather than the starting salary. I trust Infosys to offer fair compensation that is competitive with the market. I am also aware that Infosys provides additional benefits like health insurance, retirement benefits, and the invaluable training through the Lex platform, which add significant value beyond the base salary. I am open to discussing the specifics based on the full compensation package.",
    tips: "Show you know the standard range. Express flexibility. Emphasize learning over money."
  },
  {
    question: "How do you handle stress?",
    answer: "I handle stress through a combination of planning, physical activity, and communication. When I feel overwhelmed, I first write down everything that is causing stress, then categorize each item by urgency and importance. This transforms a vague feeling of anxiety into a concrete action plan. I also maintain a daily exercise routine — even a 30-minute walk helps clear my mind and improve focus. Most importantly, I communicate early. During my final semester, when coursework and placement preparation overlapped, I informed my project team that I might be less available for two weeks and we redistributed responsibilities proactively. I have learned that stress is usually a signal to plan better or communicate earlier, not to suffer in silence.",
    tips: "Show self-awareness. Give a specific strategy. Emphasize proactive communication."
  },
];

export const INFOSYS_CODING: CodingQuestion[] = [
  {
    problem: "Reverse a String — Write a function to reverse a string without using built-in reverse methods.",
    difficulty: "Easy",
    approach: "Use two pointers from both ends of the string. Swap characters at the left and right pointers, then move them toward the center until they meet.",
    solution: `function reverseString(s) {
  const arr = s.split('');
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr.join('');
}`,
    complexity: "Time: O(n), Space: O(n) for the array, O(1) extra"
  },
  {
    problem: "Find the Largest and Second Largest Elements in an Array — Find the two largest distinct elements in a single pass.",
    difficulty: "Easy",
    approach: "Initialize both largest and secondLargest to -Infinity. Traverse the array: if current element is greater than largest, shift largest to secondLargest and update largest. Else if current is between secondLargest and largest, update secondLargest.",
    solution: `function findTwoLargest(arr) {
  let first = -Infinity, second = -Infinity;
  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num;
    }
  }
  return { largest: first, secondLargest: second === -Infinity ? null : second };
}`,
    complexity: "Time: O(n), Space: O(1)"
  },
  {
    problem: "Print a Reverse Number Pattern — Print a pattern where each row has decreasing numbers. For N=5, the pattern decreases from N to 1.",
    difficulty: "Easy",
    approach: "Use nested loops. The outer loop runs from N down to 1 for rows. For each row i, print numbers from i down to 1.",
    solution: `function reversePattern(n) {
  let result = '';
  for (let i = n; i >= 1; i--) {
    for (let j = i; j >= 1; j--) {
      result += j + ' ';
    }
    result += '\\n';
  }
  return result;
}`,
    complexity: "Time: O(n²), Space: O(1) excluding output"
  },
  {
    problem: "Check if a Number is Prime — Determine whether a given positive integer is a prime number.",
    difficulty: "Easy",
    approach: "Check divisibility from 2 up to the square root of the number. If any divisor is found, the number is not prime. Numbers less than 2 are not prime.",
    solution: `function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}`,
    complexity: "Time: O(√n), Space: O(1)"
  },
  {
    problem: "Find the GCD of Two Numbers — Compute the Greatest Common Divisor using the Euclidean algorithm.",
    difficulty: "Easy",
    approach: "Use the Euclidean algorithm: repeatedly replace the larger number with the remainder of dividing the larger by the smaller, until the remainder is zero. The non-zero number at that point is the GCD.",
    solution: `function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}`,
    complexity: "Time: O(log(min(a,b))), Space: O(1)"
  },
  {
    problem: "Count Occurrences of Each Character — Given a string, count the frequency of each character and return as a map.",
    difficulty: "Easy",
    approach: "Create an empty object. Iterate through each character in the string. For each character, increment its count in the object. Return the frequency map.",
    solution: `function charFrequency(s) {
  const freq = {};
  for (const c of s) {
    freq[c] = (freq[c] || 0) + 1;
  }
  return freq;
}`,
    complexity: "Time: O(n), Space: O(k) where k is the number of unique characters"
  },
  {
    problem: "Bubble Sort — Implement the bubble sort algorithm to sort an array of integers in ascending order.",
    difficulty: "Easy",
    approach: "Repeatedly traverse the array, comparing adjacent elements and swapping them if they are in the wrong order. After each pass, the largest unsorted element bubbles to its correct position. Stop when no swaps occur in a pass.",
    solution: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    complexity: "Time: O(n²), Space: O(1)"
  },
  {
    problem: "Find the Duplicate in an Array — Given an array of N+1 integers where each integer is between 1 and N, find the one duplicate number.",
    difficulty: "Easy",
    approach: "Use Floyd's cycle detection algorithm. Treat the array values as pointers to the next index. If there is a duplicate, there must be a cycle. Use a slow pointer (moves one step) and a fast pointer (moves two steps) to detect the cycle, then find the entry point which is the duplicate.",
    solution: `function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
    complexity: "Time: O(n), Space: O(1)"
  },
  {
    problem: "Merge Two Sorted Arrays — Given two sorted arrays, merge them into a single sorted array.",
    difficulty: "Easy",
    approach: "Use two pointers, one for each array. Compare elements at both pointers and append the smaller one to the result. Advance the pointer of the array from which the element was taken. When one array is exhausted, append all remaining elements from the other.",
    solution: `function mergeSorted(arr1, arr2) {
  const result = [];
  let i = 0, j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }
  while (i < arr1.length) result.push(arr1[i++]);
  while (j < arr2.length) result.push(arr2[j++]);
  return result;
}`,
    complexity: "Time: O(n + m), Space: O(n + m)"
  },
  {
    problem: "Linked List — Detect a Cycle in a Linked List — Given the head of a linked list, determine if the list has a cycle.",
    difficulty: "Easy",
    approach: "Use Floyd's tortoise and hare algorithm. Use two pointers — slow moves one node at a time, fast moves two nodes at a time. If there is a cycle, they will eventually meet. If fast reaches null, there is no cycle.",
    solution: `function hasCycle(head) {
  if (!head || !head.next) return false;
  let slow = head;
  let fast = head.next;
  while (slow !== fast) {
    if (!fast || !fast.next) return false;
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
}`,
    complexity: "Time: O(n), Space: O(1)"
  },
  {
    problem: "Reverse a Linked List — Reverse a singly linked list iteratively and return the new head.",
    difficulty: "Easy",
    approach: "Use three pointers: prev (starts as null), current (starts as head), and next. Iterate through the list, reversing each node's next pointer to point to prev. Move all pointers one step forward. When current becomes null, prev is the new head.",
    solution: `function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
    complexity: "Time: O(n), Space: O(1)"
  },
  {
    problem: "Find the Middle of a Linked List — Given the head of a linked list, return the middle node. If there are two middle nodes, return the second one.",
    difficulty: "Easy",
    approach: "Use the slow and fast pointer technique. Slow moves one step at a time, fast moves two steps. When fast reaches the end, slow will be at the middle.",
    solution: `function findMiddle(head) {
  if (!head) return null;
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
    complexity: "Time: O(n), Space: O(1)"
  },
  {
    problem: "Selection Sort — Implement the selection sort algorithm to sort an array of integers in ascending order.",
    difficulty: "Easy",
    approach: "For each position in the array, find the minimum element in the unsorted portion and swap it with the element at the current position. The sorted portion grows from left to right.",
    solution: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
    complexity: "Time: O(n²), Space: O(1)"
  },
  {
    problem: "Find All Duplicates in an Array — Given an array where elements are in range 1 to N, find all elements that appear more than once.",
    difficulty: "Medium",
    approach: "Traverse the array and for each element, mark the index corresponding to its absolute value as negative. If you encounter an already-negative index, that means the element has been seen before — add it to the result.",
    solution: `function findAllDuplicates(nums) {
  const result = [];
  for (const num of nums) {
    const idx = Math.abs(num) - 1;
    if (nums[idx] < 0) {
      result.push(Math.abs(num));
    } else {
      nums[idx] = -nums[idx];
    }
  }
  return result;
}`,
    complexity: "Time: O(n), Space: O(1) excluding output"
  },
  {
    problem: "Linked List — Remove N-th Node From End — Given a linked list, remove the N-th node from the end and return the head.",
    difficulty: "Medium",
    approach: "Use two pointers. Advance the first pointer N steps ahead. Then move both pointers together until the first pointer reaches the end. The second pointer will be right before the node to delete. Handle the edge case where the node to delete is the head.",
    solution: `function removeNthFromEnd(head, n) {
  const dummy = { val: 0, next: head };
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    complexity: "Time: O(L) where L is the list length, Space: O(1)"
  },
];
