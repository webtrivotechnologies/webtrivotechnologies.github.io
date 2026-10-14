export type PortfolioProject = {
  title: string;
  category: "Websites" | "Platforms" | "Mobile App" | "Open Source";
  description: string;
  url: string;
  image: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    "title": "Talma",
    "category": "Websites",
    "description": "Talma.cat is a creative agency that specializes in branding, design, and digital solutions, helping businesses build strong identities and grow online.",
    "url": "https://www.talma.cat/",
    "image": "/portfolio/talma.jpg"
  },
  {
    "title": "Rogles Aventura",
    "category": "Websites",
    "description": "Rogles.org is a platform dedicated to supporting and empowering individuals with learning disabilities by offering specialized resources and services.",
    "url": "https://rogles.org/en/",
    "image": "/portfolio/rogles-aventura.jpg"
  },
  {
    "title": "UnderTheThatch",
    "category": "Websites",
    "description": "Under the Thatch offers unique, eco-friendly holiday cottages in the heart of the Welsh countryside, providing a sustainable and charming getaway experience.",
    "url": "https://www.underthethatch.co.uk/",
    "image": "/portfolio/underthethatch.jpg"
  },
  {
    "title": "Psychurch",
    "category": "Websites",
    "description": "Psychurch.org is a platform that combines psychological insights with spiritual practices to offer resources for personal growth, healing, and well-being.",
    "url": "https://psychurch.org/",
    "image": "/portfolio/psychurch.jpg"
  },
  {
    "title": "Best Destination",
    "category": "Websites",
    "description": "Best-Destination.com offers expert travel guides and recommendations to help travelers discover top destinations, plan unforgettable trips, and experience the best of the world’s sights.",
    "url": "https://best-destination.com/",
    "image": "/portfolio/best-destination.jpg"
  },
  {
    "title": "Juneberry",
    "category": "Websites",
    "description": "Juneberry.com offers a curated collection of sustainable, high-quality products designed to enhance everyday life while supporting environmental and social responsibility",
    "url": "https://juneberry.com/",
    "image": "/portfolio/juneberry.jpg"
  },
  {
    "title": "Journal Of Cyber Policy",
    "category": "Websites",
    "description": "The Journal of Cyber Policy is a platform that explores critical issues in cybersecurity, technology policy, and digital risk management.",
    "url": "https://journalofcyberpolicy.com/",
    "image": "/portfolio/journal-of-cyber-policy.jpg"
  },
  {
    "title": "Atlas Gutter Guard",
    "category": "Websites",
    "description": "Atlas Gutter Guard provides customized solutions for gutter protection, offering free estimates through their online measurement tool.",
    "url": "https://measure.atlasgutterguard.com/",
    "image": "/portfolio/atlas-gutter-guard.jpg"
  },
  {
    "title": "Raptor Gutter Guard",
    "category": "Websites",
    "description": "Raptor Gutter Guard offers an online measurement tool to provide free estimates for durable and effective gutter protection systems.",
    "url": "https://measure.raptorgutterguard.com/",
    "image": "/portfolio/raptor-gutter-guard.jpg"
  },
  {
    "title": "Industrial Cipp",
    "category": "Websites",
    "description": "Industrial CIPP specializes in trenchless pipe repair solutions, utilizing cured-in-place pipe (CIPP) technology for industrial and commercial applications.",
    "url": "https://industrialcipp.com/",
    "image": "/portfolio/industrial-cipp.jpg"
  },
  {
    "title": "The Advisors",
    "category": "Websites",
    "description": "The Advisors is a network of independent insurance agencies dedicated to providing personalized insurance solutions and expert guidance.",
    "url": "https://www.theadvisors.org/",
    "image": "/portfolio/the-advisors.jpg"
  },
  {
    "title": "ZuluTails",
    "category": "Websites",
    "description": "ZuluTails is a pet identification platform that uses digital ID tags to help reunite lost pets with their owners quickly and securely.",
    "url": "https://zulutails.com/",
    "image": "/portfolio/zulutails.jpg"
  },
  {
    "title": "FotoEvidence",
    "category": "Websites",
    "description": "FotoEvidence is a platform dedicated to using photography to document social justice issues, human rights violations, and injustices worldwide through powerful visual storytelling.",
    "url": "https://fotoevidence.com/",
    "image": "/portfolio/fotoevidence.jpg"
  },
  {
    "title": "Punt Club",
    "category": "Websites",
    "description": "Punt Club is a platform that helps groups manage shared betting syndicates, simplifying the process of pooling funds and placing bets together.",
    "url": "https://www.puntclub.com/",
    "image": "/portfolio/punt-club.jpg"
  },
  {
    "title": "CommsFactory",
    "category": "Websites",
    "description": "CommsFactory provides professional PR and communication services, specializing in helping businesses gain media exposure and build their brand reputation.",
    "url": "https://commsfactory.net/",
    "image": "/portfolio/commsfactory.jpg"
  },
  {
    "title": "MeshEctares",
    "category": "Websites",
    "description": "MeshEctares is a platform that connects farmers, buyers, and service providers to promote agricultural trade and innovation.",
    "url": "https://meshectares.com/",
    "image": "/portfolio/meshectares.jpg"
  },
  {
    "title": "Gutterglove",
    "category": "Websites",
    "description": "Gutterglove offers high-quality gutter guard solutions designed to protect homes by keeping gutters free from debris while allowing water to flow through efficiently.",
    "url": "https://gutterglove.com/",
    "image": "/portfolio/gutterglove.jpg"
  },
  {
    "title": "Carte Financement",
    "category": "Websites",
    "description": "Carte Financement specializes in personalized financing solutions for real estate and professional projects in France and internationally.",
    "url": "https://cartefinancement.com/",
    "image": "/portfolio/carte-financement.jpg"
  },
  {
    "title": "The Weed Exchange",
    "category": "Websites",
    "description": "The Weed Exchange is an online platform for buying, selling, and trading cannabis-related products and services.",
    "url": "https://theweedexchange.com/",
    "image": "/portfolio/the-weed-exchange.jpg"
  },
  {
    "title": "GitHub - 2FA Plugin",
    "category": "Open Source",
    "description": "Sylius 2FA Plugin adds Two-Factor Authentication (TOTP) for stronger account security. Protect logins with a secondary code via apps like Google Authenticator.",
    "url": "https://github.com/vivanwebsolution/sylius-2fa-plugin",
    "image": "/portfolio/github-2fa-plugin.jpg"
  },
  {
    "title": "Sylius Store - 2FA Plugin",
    "category": "Open Source",
    "description": "Enable free TOTP-based two‑factor authentication for Sylius 2.0 Admin users—adds an extra security step via a one‑time code and QR‑code setup, at no cost.",
    "url": "https://store.sylius.com/products/sylius-2fa-plugin-by-vivan-web-solution",
    "image": "/portfolio/sylius-store-2fa-plugin.jpg"
  },
  {
    "title": "Mautic",
    "category": "Open Source",
    "description": "Worked on Mautic features like Contact Management, Campaign Automation, Forms, Landing Pages, etc. Handled lead generation, engagement, and performance tracking through marketing automation tools.",
    "url": "https://github.com/niravpateljoin/mautic",
    "image": "/portfolio/mautic.jpg"
  },
  {
    "title": "Symfony + JWT",
    "category": "Open Source",
    "description": "This Symfony command generates dummy property data in JSON format and clears the cached property data. It is useful for quickly creating sample data during development or testing.",
    "url": "https://github.com/niravpateljoin/symfony-api",
    "image": "/portfolio/symfony-jwt.jpg"
  },
  {
    "title": "Laravel + Vue JS",
    "category": "Open Source",
    "description": "A Laravel + Vue full-stack application demonstrating API integration, pagination, and user-specific data management with Docker support.",
    "url": "https://github.com/niravpateljoin/favourite_fruits",
    "image": "/portfolio/laravel-vue-js.jpg"
  },
  {
    "title": "Python + AI",
    "category": "Open Source",
    "description": "A Python-based project demonstrating user input handling and logic flow, with optional integration of libraries like NumPy and MongoDB for enhanced functionality and data storage.",
    "url": "https://github.com/niravpateljoin/python-guess-game",
    "image": "/portfolio/python-ai.jpg"
  },
  {
    "title": "Loan Strategy Adviser",
    "category": "Open Source",
    "description": "A Python application that helps suggest optimal loan strategies using rule-based logic. It showcases data-driven decision-making and can be extended with financial calculations or database integration.",
    "url": "https://github.com/niravpateljoin/python-loan-strategy-advisor",
    "image": "/portfolio/loan-strategy-adviser.jpg"
  },
  {
    "title": "Order Management App",
    "category": "Open Source",
    "description": "This project is an Order Management Application built with Symfony (PHP) on the backend and Angular CLI (TypeScript) on the frontend.",
    "url": "https://github.com/niravpateljoin/angularsymfonyapp",
    "image": "/portfolio/order-management-app.jpg"
  },
  {
    "title": "Laravel + React JS",
    "category": "Open Source",
    "description": "This project is a full-stack fruit management application built with Laravel (PHP) for the backend and ReactJS for the frontend. It fetches fruit data from an external API and allows users to view, filter, and favorite fruits.",
    "url": "https://github.com/niravpateljoin/Fruits-Test-Task",
    "image": "/portfolio/laravel-react-js.jpg"
  },
  {
    "title": "React JS",
    "category": "Open Source",
    "description": "A collection of React.js examples demonstrating component-based architecture, state management, and basic UI interactions for learning and reference.",
    "url": "https://github.com/niravpateljoin/react-js-example/tree/main",
    "image": "/portfolio/react-js.jpg"
  },
  {
    "title": "Node JS",
    "category": "Open Source",
    "description": "This project is a Node.js-based Admin Dashboard built using AdminJS, Express, MongoDB, and React. It provides an admin interface for managing users and includes authentication, session management, and a custom dashboard component.",
    "url": "https://github.com/niravpateljoin/nodejs-usermanagement-practical",
    "image": "/portfolio/node-js.jpg"
  },
  {
    "title": "Mini Ticketing System",
    "category": "Open Source",
    "description": "A web-based mini ticketing system with user authentication, ticket management, and status tracking. Built with Vue.js, Node.js, MongoDB, and Docker for easy deployment.",
    "url": "https://github.com/niravpateljoin/nodejs-practical",
    "image": "/portfolio/mini-ticketing-system.jpg"
  },
  {
    "title": "MailChimp",
    "category": "Open Source",
    "description": "A PHP integration with MailChimp API v3, enabling subscription management, audience list handling, and campaign operations through RESTful API calls.",
    "url": "https://github.com/niravpateljoin/MailChimp-API-v3",
    "image": "/portfolio/mailchimp.jpg"
  },
  {
    "title": "Stripe",
    "category": "Open Source",
    "description": "A PHP-based implementation of Stripe payment gateway for handling secure online transactions, including customer checkout and payment processing.",
    "url": "https://github.com/niravpateljoin/stripe-payment",
    "image": "/portfolio/stripe.jpg"
  },
  {
    "title": "Mini Ticket System",
    "category": "Open Source",
    "description": "A full-stack web application for managing support tickets, featuring user authentication, ticket creation, status updates, and admin controls.",
    "url": "https://github.com/niravpateljoin/mini-ticket-system-task",
    "image": "/portfolio/mini-ticket-system.jpg"
  },
  {
    "title": "VueJs",
    "category": "Open Source",
    "description": "A collection of Vue.js examples demonstrating core concepts like component structure, data binding, event handling, and reactive UI development for beginners and learners.",
    "url": "https://github.com/niravpateljoin/vue-js-example",
    "image": "/portfolio/vuejs.jpg"
  },
  {
    "title": "Laravel",
    "category": "Open Source",
    "description": "A Laravel project showcasing essential features such as routing, controllers, Blade templating, and database interactions—ideal for learning and testing Laravel fundamentals.",
    "url": "https://github.com/niravpateljoin/Laravel-Demo-Code",
    "image": "/portfolio/laravel.jpg"
  },
  {
    "title": "Laravel",
    "category": "Open Source",
    "description": "A basic Laravel setup demonstrating core framework features like MVC architecture, routing, migrations, and Blade templates—serving as a starter template or learning resource.",
    "url": "https://github.com/niravpateljoin/laravel",
    "image": "/portfolio/laravel-2.jpg"
  },
  {
    "title": "Symfony",
    "category": "Open Source",
    "description": "A Symfony-based REST API for managing movie records, featuring endpoints to create, retrieve single or multiple movies filtered by user, populated with sample data via fixtures.",
    "url": "https://github.com/niravpateljoin/home-task",
    "image": "/portfolio/symfony.jpg"
  },
  {
    "title": "Symfony",
    "category": "Open Source",
    "description": "A Symfony‑based PHP application providing string utilities like palindrome, anagram, and pangram checks. Includes Docker setup, database migrations, and integration-ready APIs to demonstrate coding tasks for engineering interviews.",
    "url": "https://github.com/niravpateljoin/Jadu-Engineer-Code",
    "image": "/portfolio/symfony-2.jpg"
  },
  {
    "title": "Symfony",
    "category": "Open Source",
    "description": "A Symfony-based time tracking app with start/stop functionality to log work sessions. Uses MySQL and Doctrine for data handling, designed as a coding test assignment.",
    "url": "https://github.com/niravpateljoin/Time-tracking-app",
    "image": "/portfolio/symfony-3.jpg"
  },
  {
    "title": "SwagPOS System",
    "category": "Open Source",
    "description": "A lightweight, mobile-friendly POS system for Shopware 6.6+ and 6.7+, enabling walk-in sales through a standalone interface. Perfect for retail counters, quick order processing, and terminal-based operations.",
    "url": "https://github.com/niravpateljoin/SwagPOS/",
    "image": "/portfolio/swagpos-system.jpg"
  },
  {
    "title": "SwagPromoGenius",
    "category": "Open Source",
    "description": "A Shopware plugin that enables dynamic and customizable promotional offers within the storefront. Designed to enhance marketing strategies by allowing businesses to easily create, manage, and display promotions in real-time.",
    "url": "https://github.com/niravpateljoin/SwagPromoGenius",
    "image": "/portfolio/swagpromogenius.jpg"
  },
  {
    "title": "Smart Ticket Api",
    "category": "Open Source",
    "description": "Smart Ticket API is a backend service for managing support or event tickets, enabling ticket creation, tracking, and updates. It provides structured endpoints for efficient ticket workflow management.",
    "url": "https://github.com/niravpateljoin/smart-ticket-api",
    "image": "/portfolio/smart-ticket-api.jpg"
  },
  {
    "title": "Mutic - 2 Factor Authentication",
    "category": "Open Source",
    "description": "The MauticTwoFactorAuthBundle is a Symfony-based plugin for Mautic that adds two-factor authentication (2FA) to enhance login security and protect user accounts. It provides an additional verification step, making unauthorized access significantly harder.",
    "url": "https://github.com/niravpateljoin/MauticTwoFactorAuthBundle",
    "image": "/portfolio/mutic-2-factor-authentication.jpg"
  },
  {
    "title": "Django Scraping Dashboard",
    "category": "Open Source",
    "description": "ChatGPT said: A Django and Scrapy-based web scraping project with job scheduling, proxy handling, monitoring dashboard, and data export — ideal for large-scale data collection.",
    "url": "https://github.com/niravpateljoin/Python-scraping",
    "image": "/portfolio/django-scraping-dashboard.jpg"
  },
  {
    "title": "Django Ecommerce Store",
    "category": "Open Source",
    "description": "A Django-powered eCommerce website for browsing products, managing carts, and processing orders. It includes user authentication and PayPal payment integration.",
    "url": "https://github.com/niravpateljoin/Django-Ecommerce-Store",
    "image": "/portfolio/django-ecommerce-store.jpg"
  },
  {
    "title": "AppointmentBot",
    "category": "Open Source",
    "description": "Python-AppointmentBot is a FastAPI-based chatbot that manages Google Calendar appointments. It allows users to book, reschedule, or cancel meetings directly through Dialogflow integration.",
    "url": "https://github.com/niravpateljoin/Python-AppointmentBot",
    "image": "/portfolio/appointmentbot.jpg"
  },
  {
    "title": "LUNAcare",
    "category": "Websites",
    "description": "LunaCare is an e-commerce website offering modern menstrual and incontinence care products. It provides reusable period underwear, menstrual cups, and leak-proof swimwear as sustainable alternatives.",
    "url": "https://thelunacare.com/en-us",
    "image": "/portfolio/lunacare.jpg"
  },
  {
    "title": "Africa Unbound",
    "category": "Websites",
    "description": "AfricaUnbound.com is a platform connected to the Africa Unbound initiative, which focuses on leadership development, community discussions, and personal growth programs for young Africans.",
    "url": "https://africaunbound.com/",
    "image": "/portfolio/africa-unbound.jpg"
  },
  {
    "title": "Raj Tours Portal",
    "category": "Platforms",
    "description": "This website appears to be the admin (backend) panel for a tourism website called Raj Tours, where site administrators manage content, bookings, and user data.",
    "url": "https://admin.rajankumartourism.com/",
    "image": "/portfolio/raj-tours-portal.jpg"
  },
  {
    "title": "Fuel Pass IN App (Customer App)",
    "category": "Mobile App",
    "description": "Fuel Pass IN lets users securely manage vehicle registration, access live QR fuel passes, track fuel usage, and receive fuel based on assigned daily quotas.",
    "url": "https://play.google.com/store/apps/details?id=in.fuelpass.app",
    "image": "/portfolio/fuel-pass-in-app-customer-app.jpg"
  },
  {
    "title": "Fuel Pass Operator App (Pump Operator App)",
    "category": "Mobile App",
    "description": "Fuel Pass Operator enables station staff to scan QR codes, verify vehicle eligibility, dispense fuel, monitor transactions, and manage daily fueling operations efficiently.",
    "url": "https://play.google.com/store/apps/details?id=in.fuelpass.operator",
    "image": "/portfolio/fuel-pass-operator-app-pump-operator-app.jpg"
  },
  {
    "title": "TrendCatch Advertiser",
    "category": "Mobile App",
    "description": "TrendCatch Advertiser enables businesses to launch DOOH video campaigns, target locations, monitor proof-of-play, track real-time analytics, and manage advertising from one platform.",
    "url": "https://play.google.com/store/apps/details?id=com.tradecache.trade_cache_flutter_app",
    "image": "/portfolio/trendcatch-advertiser.jpg"
  },
  {
    "title": "Foundation Environmental",
    "category": "Websites",
    "description": "A centralized web application for managing environmental service operations, including customers, quotes, jobsheets, scheduling, generators, maintenance, inventory, safety requirements, and reporting.",
    "url": "https://jrs.foundationenv.com/",
    "image": "/portfolio/foundation-environmental.jpg"
  },
  {
    "title": "AI Growth",
    "category": "Platforms",
    "description": "AI-Growth.de is a platform dedicated to helping businesses harness the power of artificial intelligence to drive growth, innovation, and efficiency in their operations.",
    "url": "",
    "image": "/portfolio/ai-growth.jpg"
  },
  {
    "title": "NSID",
    "category": "Websites",
    "description": "National Sports ID is a platform that verifies youth athletes' ages and grades to ensure fair competition in sports.",
    "url": "",
    "image": "/portfolio/nsid.jpg"
  },
  {
    "title": "Mobio",
    "category": "Platforms",
    "description": "MOBIO Distribution is a UK-based distributor specializing in premium mobile accessories and technology products.",
    "url": "",
    "image": "/portfolio/mobio.jpg"
  },
  {
    "title": "PriceSpy",
    "category": "Platforms",
    "description": "PriceSpy is a comprehensive price comparison website that helps users find the best deals on products across various categories from different retailers.",
    "url": "",
    "image": "/portfolio/pricespy.jpg"
  },
  {
    "title": "Email Signature Rescue",
    "category": "Platforms",
    "description": "The website eSignly provides a platform for secure and efficient electronic signature solutions, allowing users to sign and manage documents online.",
    "url": "",
    "image": "/portfolio/email-signature-rescue.jpg"
  },
  {
    "title": "Munireg",
    "category": "Platforms",
    "description": "The MuniReg website provides municipalities and organizations with tools to manage, track, and address issues related to vacant, abandoned, and foreclosed properties efficiently.",
    "url": "",
    "image": "/portfolio/munireg.jpg"
  },
  {
    "title": "Mitm Pay",
    "category": "Platforms",
    "description": "Mitm Pay is made in Symfony.It is project about the subscription.",
    "url": "",
    "image": "/portfolio/mitm-pay.jpg"
  },
  {
    "title": "The TurboChyll ERP",
    "category": "Platforms",
    "description": "The TurboChyll ERP platform appears to be a management system for engineers, likely providing tools to manage operations, tasks, and data related to engineering workflows efficiently.",
    "url": "",
    "image": "/portfolio/the-turbochyll-erp.jpg"
  },
  {
    "title": "Mobio Admin",
    "category": "Platforms",
    "description": "Mobio Admin is a centralized platform designed for efficiently managing mobile device distribution, inventory, and administrative tasks.",
    "url": "",
    "image": "/portfolio/mobio-admin.jpg"
  },
  {
    "title": "AI Growth Admin",
    "category": "Platforms",
    "description": "AI-Growth.de is a platform dedicated to helping businesses harness the power of artificial intelligence to drive growth, innovation, and efficiency in their operations.",
    "url": "",
    "image": "/portfolio/ai-growth-admin.jpg"
  },
  {
    "title": "Lapsify",
    "category": "Platforms",
    "description": "The website Lapsify appears to be a login page, likely for accessing a specific service or platform. It is difficult to determine its exact nature without more context.",
    "url": "",
    "image": "/portfolio/lapsify.jpg"
  },
  {
    "title": "Wall Street Italia",
    "category": "Websites",
    "description": "Wall Street Italia is a monthly publication that provides in-depth insights on investments, financial advice, savings, insurance, business, and lifestyle to help readers make informed financial decisions.",
    "url": "",
    "image": "/portfolio/wall-street-italia.jpg"
  },
  {
    "title": "4k Custom Rods",
    "category": "Websites",
    "description": "This website has been built using the WordPress default editor, primarily utilizing built-in tools with minimal custom CSS, making it easy for users to update and manage content.",
    "url": "",
    "image": "/portfolio/4k-custom-rods.jpg"
  },
  {
    "title": "Hostel & PG Management Platform",
    "category": "Platforms",
    "description": "An all-in-one web and mobile platform for hostel owners to manage rooms, tenants, bookings, rent, payments, complaints, and daily operations efficiently.",
    "url": "",
    "image": "/portfolio/hostel-pg-management-platform.jpg"
  }
];
