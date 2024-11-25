/*
DIFFERENT LISTS OF CONTENT/TEXT THAT WE WILL BE 
USING THROUGHOUT OUR APPLICATION
*/

import {
    nathan,
    alazar,
    benefitIcon1,
    benefitIcon2,
    benefitIcon3,
    benefitIcon4,
    chromecast,
    disc02,
    discordBlack,
    facebook,
    file02,
    homeSmile,
    instagram,
    plusSquare,
    recording01,
    recording03,
    searchMd,
    sliders04,
    telegram,
    twitter,
    yourlogo,
    postgres,
    mysql,
    redis,
    cassandra, 
    influx, 
    mongo, 
    sqlite,
    neo, 
    gavin,
    emptyy,
    polybased
  } from "../../src/assets";
  
  export const navigation = [
    {
      id: "0",
      title: "About",
      url: "#features",
    },
    {
      id: "1",
      title: "Devs",
      url: "#roadmap",
    },
    {
      id: "2",
      title: "Docs",
      url: "https://www.npmjs.com/package/polybase-package",
    }
  ];
  
  export const heroIcons = [homeSmile, file02, searchMd, plusSquare];
  
  export const notificationImages = [nathan, alazar, gavin];
  
  export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];
  
  export const brainwaveServices = [
    "Photo generating",
    "Photo enhance",
    "Seamless Integration",
  ];
  
  export const brainwaveServicesIcons = [
    recording03,
    recording01,
    disc02,
    chromecast,
    sliders04,
  ];
  
  export const roadmap = [
    {
      id: "0",
      title: "Nathan Patterson",
      //text: "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
      imageUrl: nathan,
      linkedin: "https://www.linkedin.com/in/nathan-patterson-aba798251/",
      colorful: true,
    },
    {
      id: "1",
      title: "Alazar Aklilu",
      // text: "Add game-like elements, such as badges or leaderboards, to incentivize users to engage with the chatbot more frequently.",
      // date: "May 2023",
      // status: "progress",
      linkedin: "https://www.linkedin.com/in/alazaraklilu/",
      imageUrl: alazar,
    },
    {
      id: "2",
      title: "Davis Knaub",
      // text: "Allow users to customize the chatbot's appearance and behavior, making it more engaging and fun to interact with.",
      // date: "May 2023",
      // status: "done",
      linkedin: "https://www.linkedin.com/in/davisknaub/",
      imageUrl: emptyy,
    },
    {
      id: "3",
      title: "Gavin Shadinger",
      //text: "Allow the chatbot to access external data sources, such as weather APIs or news APIs, to provide more relevant recommendations.",
      //date: "May 2023",
      //status: "progress",
      linkedin: "https://www.linkedin.com/in/gavin-shadinger/",
      imageUrl: gavin,
      colorful: true,
    },
  ];
  
  // export const collabText =
  // "Polybase is a JavaScript library designed for real-time data synchronization across multiple databases in polyglot environments. It provides a unified interface to connect, manage, and synchronize data between different database types, including MongoDB, Redis, PostgreSQL, Neo4j, and InfluxDB.";
  
  export const collabContent = [
    {
      id: "0",
      title: "Data Synchronization",
    },
    {
      id: "1",
      title: "Unified Interface",
    },
    {
      id: "2",
      title: "CLI Management Tools",
    },
    {
      id: "3",
      title: "Automated Data Mapping",
    },
    {
      id: "4",
      title: "Connection Pooling & Load Balancing",
    },
  ];
  
  export const collabApps = [
    {
      id: "0",
      title: "postgres",
      icon: postgres,
      width: 38,
      height: 48,
    },
    {
      id: "1",
      title: "mysql",
      icon: mysql,
      width: 34,
      height: 36,
    },
    {
      id: "2",
      title: "redis",
      icon: redis,
      width: 32,
      height: 24,
    },
    {
      id: "3",
      title: "cassandra",
      icon: cassandra,
      width: 70,
      height: 70,
    },
    {
      id: "4",
      title: "influx",
      icon: influx,
      width: 34,
      height: 34,
    },
    {
      id: "5",
      title: "mongo",
      icon: mongo,
      width: 40,
      height: 42,
    },
    {
      id: "6",
      title: "sqlite",
      icon: sqlite,
      width: 33,
      height: 34,
    },
    {
      id: "7",
      title: "neo",
      icon: neo,
      width: 36,
      height: 30,
    },
  ];
  
  export const pricing = [
    {
      id: "0",
      title: "Basic",
      description: "AI chatbot, personalized recommendations",
      price: "0",
      features: [
        "An AI chatbot that can understand your queries",
        "Personalized recommendations based on your preferences",
        "Ability to explore the app and its features without any cost",
      ],
    },
    {
      id: "1",
      title: "Premium",
      description: "Advanced AI chatbot, priority support, analytics dashboard",
      price: "9.99",
      features: [
        "An advanced AI chatbot that can understand complex queries",
        "An analytics dashboard to track your conversations",
        "Priority support to solve issues quickly",
      ],
    },
    {
      id: "2",
      title: "Enterprise",
      description: "Custom AI chatbot, advanced analytics, dedicated account",
      price: null,
      features: [
        "An AI chatbot that can understand your queries",
        "Personalized recommendations based on your preferences",
        "Ability to explore the app and its features without any cost",
      ],
    },
  ];
  
  export const benefits = [
    {
      id: "0",
      title: "Data Synchronization",
      text: "Ensures up-to-date and consistent data across multiple databases, reducing latency and improving responsiveness.",
      backgroundUrl: "assets/benefits/card-1.svg",
      iconUrl: benefitIcon1,
      imageUrl: polybased,
    },
    {
      id: "1",
      title: "Unified Interface",
      text: "Provides a single API layer that abstracts away the complexities of each database, simplifying interactions with polyglot environments.",
      backgroundUrl: "assets/benefits/card-2.svg",
      iconUrl: benefitIcon2,
      imageUrl: polybased,
      light: true,
    },
    {
      id: "2",
      title: "CLI Management",
      text: "Includes command-line tools for easier setup, configuration, and monitoring of database connections.",
      backgroundUrl: "assets/benefits/card-3.svg",
      iconUrl: benefitIcon3,
      imageUrl: polybased,
    },
    {
      id: "3",
      title: "Data Mapping",
      text: "Translates and maps data structures between different database types, handling schema discrepancies and data transformation needs.",
      backgroundUrl: "assets/benefits/card-4.svg",
      iconUrl: benefitIcon4,
      imageUrl: polybased,
      light: true,
    },
    {
      id: "4",
      title: "Connection Pooling",
      text: "Manages multiple database connections for optimal performance, ensuring stability under heavy loads.",
      backgroundUrl: "assets/benefits/card-5.svg",
      iconUrl: benefitIcon1,
      imageUrl: polybased,
    },
    {
      id: "5",
      title: "Failover Management",
      text: "Automatically redirects queries if one database is down, ensuring high availability and reliability.",
      backgroundUrl: "assets/benefits/card-6.svg",
      iconUrl: benefitIcon2,
      imageUrl: polybased,
    },
  ];
  
  export const socials = [
    {
      id: "0",
      title: "Discord",
      iconUrl: discordBlack,
      url: "#",
    },
    {
      id: "1",
      title: "Twitter",
      iconUrl: twitter,
      url: "#",
    },
    {
      id: "2",
      title: "Instagram",
      iconUrl: instagram,
      url: "#",
    },
    {
      id: "3",
      title: "Telegram",
      iconUrl: telegram,
      url: "#",
    },
    {
      id: "4",
      title: "Facebook",
      iconUrl: facebook,
      url: "#",
    },
  ];