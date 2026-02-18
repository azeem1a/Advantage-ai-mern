SRS – Software Requirements Specification

Project: Automated Social Media Campain Studio (Ad Creative Generator)

Product Brand Name : AdVantage Gen

1. Introduction
 
1.1 Purpose

This document describes the functional and non-functional requirements of the AdVantage Gen system. It is intended for developers, reviewers, and stakeholders to understand the system behavior and constraints.


1.2 Scope
AdVantage Gen is a MERN stack web application that generates AI-powered ad creatives and manages campaign history.


2. System Architecture
Frontend and backend are fully separated
Backend follows STRICT MVC architecture
Controllers are thin
Services handle all business and AI logic
MongoDB is used for persistence


3. Functional Requirements

FR-1: Prompt Input
The system shall allow users to input:
Base prompt
Brand tone
Target platform

FR-2: Prompt Enhancement
The system shall enhance the base prompt into a detailed marketing prompt using an AI service.


FR-3: Multi-Modal Generation
The system shall execute:
Image generation
Caption and hashtag generation
in parallel using asynchronous processing.

FR-4: Image Generation
The system shall attempt to generate images using Hugging Face. If generation fails, the system shall use a fallback image without crashing.

FR-5: Branding Overlay
The system shall overlay:
Brand logo
CTA button
on the generated image using Sharp.


FR-6: Campaign Persistence
The system shall save every generated campaign with:
Prompts
Image path
Caption
Hashtags
Tone
Platform
Timestamp

FR-7: Campaign History
The system shall allow users to:
View campaign history
Download ad creatives
Delete campaigns
Remix campaigns


FR-8: Remix Feature
The system shall allow users to regenerate a campaign by slightly modifying the original prompt.


4. Non-Functional Requirements


NFR-1: Stability
The system shall never crash due to:
AI API failure
Rate limits
Missing environment variables


NFR-2: Performance
The system shall handle multiple requests without blocking or server crashes.


NFR-3: Error Handling
All errors shall be:
Caught safely
Logged clearly
Returned as human-readable messages


NFR-4: Security
Environment variables shall be used for secrets
No API keys shall be hardcoded


NFR-5: Maintainability
Clean folder structure
Meaningful file naming
Centralized logging and error handling


5. External Interface Requirements
Frontend Interface
Web browser-based UI
Responsive design
Clear loading and error states
Backend Interface
REST APIs
JSON-based communication


6. Constraints
No deployment required
Free-tier AI services may have limitations
Demo fallback mode is intentionally designed


7. Assumptions
Users provide valid prompts
AI services may be unavailable at times
System prioritizes stability over live AI generation


8. Conclusion
AdVantage Gen is designed as a production-ready, stable AI ad creative system that balances real-world AI limitations with strong architecture and user experience.
