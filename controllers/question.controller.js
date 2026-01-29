const db = require("../config/db");

exports.ask = (req, res) => {
  const userId = req.userId;
  const question = req.body.title;
  const q = question.toLowerCase();

  // 🧠 AI ANSWER ENGINE (30+ TOPICS)
  let aiAnswer = "🤖 AI Generated Answer:\n\n";

  if (q.includes("html")) 
    aiAnswer += "HTML (HyperText Markup Language) is used to structure web pages and define elements like headings, images, forms, and links.";
  else if (q.includes("css")) 
    aiAnswer += "CSS (Cascading Style Sheets) is used to design websites by controlling layout, colors, fonts, and responsiveness.";
  else if (q.includes("javascript"))
     aiAnswer += "JavaScript is a programming language used to create dynamic and interactive web applications.";
  else if (q.includes("node")) 
    aiAnswer += "Node.js allows JavaScript to run on the server side. It is widely used for building scalable backend applications.";
  else if (q.includes("react")) 
    aiAnswer += "React is a JavaScript library used to build fast and reusable user interfaces.";
  else if (q.includes("angular")) 
    aiAnswer += "Angular is a front-end framework by Google used to build dynamic single-page applications.";
  else if (q.includes("vue")) 
    aiAnswer += "Vue.js is a progressive JavaScript framework used to build user interfaces and single-page applications.";
  else if (q.includes("python")) 
    aiAnswer += "Python is a high-level programming language used in web development, AI, automation, and data science.";
  else if (q.includes("java")) 
    aiAnswer += "Java is an object-oriented programming language used for enterprise applications, Android apps, and backend systems.";
  else if (q.includes("c++")) 
    aiAnswer += "C++ is an extension of C that supports object-oriented programming. It is used in game engines and high-performance systems.";
  else if (q.includes(" c ")) 
    aiAnswer += "C is a powerful low-level programming language used in operating systems, embedded systems, and hardware-level programming.";
  else if (q.includes("php")) 
    aiAnswer += "PHP is a server-side scripting language mainly used for backend web development.";
  else if (q.includes("mysql")) 
    aiAnswer += "MySQL is a relational database management system used to store and manage structured data.";
  else if (q.includes("mongodb"))
     aiAnswer += "MongoDB is a NoSQL database used to store data in JSON-like document format.";
  else if (q.includes("sql")) 
    aiAnswer += "SQL (Structured Query Language) is used to manage and query databases.";
  else if (q.includes("database"))
     aiAnswer += "A database is an organized collection of data that allows efficient storage, retrieval, and management.";
  else if (q.includes("ai") || q.includes("artificial intelligence")) 
    aiAnswer += "Artificial Intelligence enables machines to simulate human intelligence like learning, reasoning, and decision making.";
  else if (q.includes("machine learning")) 
    aiAnswer += "Machine learning allows systems to automatically learn and improve from experience without explicit programming.";
  else if (q.includes("deep learning"))
     aiAnswer += "Deep learning is a subset of machine learning that uses neural networks to process complex data.";
  else if (q.includes("cyber") || q.includes("security")) 
    aiAnswer += "Cybersecurity focuses on protecting systems, networks, and data from digital attacks.";
  else if (q.includes("blockchain")) 
    aiAnswer += "Blockchain is a distributed ledger technology used for secure and transparent digital transactions.";
  else if (q.includes("cloud")) 
    aiAnswer += "Cloud computing provides on-demand computing services like storage and servers over the internet.";
  else if (q.includes("devops"))
     aiAnswer += "DevOps is a practice that combines software development and IT operations to automate and speed up deployment.";
  else if (q.includes("api"))
     aiAnswer += "API (Application Programming Interface) allows different software applications to communicate with each other.";
  else if (q.includes("android")) 
    aiAnswer += "Android is a mobile operating system used to develop smartphone and tablet applications.";
  else if (q.includes("ios")) 
    aiAnswer += "iOS is Apple’s mobile operating system used for iPhone and iPad applications.";
  else if (q.includes("data science")) 
    aiAnswer += "Data science involves analyzing large amounts of data to extract meaningful insights.";
  else if (q.includes("iot")) 
    aiAnswer += "IoT (Internet of Things) connects physical devices to the internet for data exchange and automation.";
  else if (q.includes("network"))
     aiAnswer += "Computer networks allow devices to communicate and share resources.";
  else if (q.includes("operating system")) 
    aiAnswer += "An operating system manages computer hardware and software resources.";
  else if (q.includes("compiler")) 
    aiAnswer += "A compiler translates high-level programming code into machine code.";
  else if (q.includes("software testing")) 
    aiAnswer += "Software testing ensures that an application works correctly and meets requirements.";
  else if (q.includes("web development")) 
    aiAnswer += "Web development involves building websites and web applications using frontend and backend technologies.";
  else aiAnswer += "This question relates to software development concepts. A systematic problem-solving approach is recommended.";

  aiAnswer += "\n\n(Generated by AI Answer Engine)";

  // 🔐 CHECK DAILY LIMIT
  db.query(
    "SELECT daily_limit FROM subscriptions WHERE user_id=?",
    [userId],
    (err, sub) => {

      db.query(
        "SELECT COUNT(*) AS count FROM questions WHERE user_id=? AND created_at=CURDATE()",
        [userId],
        (err, qCount) => {

          if (qCount[0].count >= sub[0].daily_limit) {
            return res.status(403).json({ message: "Daily limit reached" });
          }

          // 💾 SAVE QUESTION + AI ANSWER
         // 💾 SAVE QUESTION + AI ANSWER
db.query(
  "INSERT INTO questions (user_id, title, ai_answer, created_at) VALUES (?, ?, ?, CURDATE())",
  [userId, question, aiAnswer],
  () => {
    return res.json({
      message: "Question posted successfully",
      aiAnswer: aiAnswer
    });
  }
);

        }
      );
    }
  );
};
