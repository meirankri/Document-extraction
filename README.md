# Node.js API 

This repository hosts a Node.js API built with TypeScript, designed to handle document uploads and extract information from those documents efficiently.

## Overview

The API offers two primary functionalities:

1. **Document Upload**: Users can upload their documents via a designated route.
2. **Information Extraction**: Extracts information from the uploaded documents using Google Document AI.

### Key Functionalities

- **Optimized Information Extraction**: To minimize costs, the API extracts only the first page of each document and combines up to 10 documents into a single PDF before processing. This approach leverages Google Document AI's pricing model, which charges the same rate for processing up to 10 pages as it does for a single page.
  
- **Error Notification**: If the information extraction process fails, an email notification is sent to the user using AWS SES.

- **Hexagonal Architecture**: The project is designed following the hexagonal architecture pattern, ensuring the separation of concerns and enhancing maintainability. This architecture helps in keeping the core business logic isolated from external dependencies.

- **Comprehensive Test Coverage**: The codebase includes extensive tests to ensure the reliability and correctness of the implemented functionalities.

## Technologies and Tools

- **Node.js**: The runtime environment for executing JavaScript code on the server side.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, providing better tooling and error checking.
- **Google Document AI**: A powerful tool for extracting structured information from unstructured documents.
- **AWS SES (Simple Email Service)**: A scalable and cost-effective service for sending email notifications.
- **Hexagonal Architecture**: A design pattern that promotes the separation of concerns and decoupling of the application's core logic from its dependencies.
- **Testing Frameworks**: Various tools and frameworks are used to ensure the application is thoroughly tested and reliable.
