================================================================================
                          GLUCOKU - MY CARE
               Non-Invasive Smart Glucose Monitoring System
================================================================================

Submitted for: AI In Medicine Hackathon 2025

--------------------------------------------------------------------------------
OVERVIEW
--------------------------------------------------------------------------------

Glucoku is a smart, non-invasive blood glucose monitoring solution that
eliminates the need for painful finger-prick tests. It combines a custom-built
infrared hardware sensor with a machine learning model to predict blood glucose
levels accurately -- and pairs with a React-based web application that serves
as a personal diabetes management companion.

This project was developed with a focus on accessibility, patient comfort, and
data-driven health insights.

--------------------------------------------------------------------------------
THE PROBLEM
--------------------------------------------------------------------------------

Traditional blood glucose monitoring requires daily finger-prick tests, which
are painful, inconvenient, and lead to reduced compliance among diabetic
patients. Continuous Glucose Monitors (CGMs) exist but are expensive and still
invasive. There is a clear need for a non-invasive, affordable, and user-
friendly alternative.

--------------------------------------------------------------------------------
OUR SOLUTION
--------------------------------------------------------------------------------

Glucoku addresses this gap with two integrated components:

  1. HARDWARE - Non-Invasive Glucometer
     - Uses near-infrared (NIR) light spectroscopy to measure blood glucose
       transdermally (through the skin), without any needle or lancet.
     - Infrared light is shone through the fingertip or wrist; the sensor
       measures the absorption spectrum, which correlates to glucose
       concentration in the blood.
     - A trained machine learning model processes the raw optical signals and
       maps them to a blood glucose reading (in mmol/L or mg/dL).
     - The device communicates its reading to the web application for logging
       and analysis.

  2. SOFTWARE - Glucoku Web Application
     - A responsive, mobile-friendly web app built with React and TypeScript.
     - Features a clean dashboard displaying current glucose levels, trends,
       and historical data visualizations using Recharts.
     - Includes a dedicated Scanner page that interfaces with the hardware
       device to receive real-time glucose readings.
     - Provides a Glucose Log for tracking readings over time.
     - Features an AI-powered Chatbot for answering diabetes-related health
       questions and providing personalized guidance.
     - Includes a Health Advice page with curated recommendations based on
       the user's glucose trends.
     - Supports Device Verification to securely pair and authenticate the
       hardware glucometer.
     - Settings page for user profile and preference management.

--------------------------------------------------------------------------------
KEY FEATURES
--------------------------------------------------------------------------------

  - Pain-Free Monitoring   : No finger pricking required. Non-invasive
                             infrared sensor reads glucose through the skin.

  - Real-Time Readings     : Instant glucose level display on the dashboard
                             the moment a scan is performed.

  - AI-Powered Chatbot     : Built-in health assistant to answer questions,
                             interpret readings, and suggest next steps.

  - Trend Analysis         : Visual charts and logs to track glucose levels
                             over days and weeks, helping identify patterns.

  - Personalized Advice    : Context-aware health tips and dietary
                             recommendations based on the user's data.

  - Device Pairing         : Secure verification flow to link the physical
                             glucometer to the user's account.

  - Cross-Platform Web App : Accessible on any browser -- desktop or mobile --
                             with no app store download required.

--------------------------------------------------------------------------------
TECHNOLOGY STACK
--------------------------------------------------------------------------------

  Hardware:
    - Near-Infrared (NIR) Sensor / Photodetector
    - Microcontroller (for signal acquisition and wireless transmission)
    - Machine Learning Model (trained on NIR spectroscopy data to predict
      blood glucose levels non-invasively)

  Web Application:
    - Framework  : React 18 with TypeScript
    - Build Tool : Vite
    - Styling    : Tailwind CSS + shadcn/ui component library
    - Routing    : React Router DOM v6
    - Charts     : Recharts
    - Forms      : React Hook Form + Zod (validation)
    - HTTP       : Axios
    - State      : TanStack React Query

  Deployment:
    - Hosted via GitHub Pages
    - Live URL: https://gordonlamyc.github.io/glucoku-my-care-main

--------------------------------------------------------------------------------
APPLICATION PAGES
--------------------------------------------------------------------------------

  /              -> Dashboard     : Overview of latest glucose reading,
                                    trend charts, and quick-access actions.
  /scanner       -> Scanner       : Connects to the hardware device and
                                    captures a real-time glucose reading.
  /log           -> Glucose Log   : Full history of all recorded readings
                                    with timestamps.
  /chatbot       -> AI Chatbot    : Conversational health assistant powered
                                    by AI.
  /advice        -> Health Advice : Personalized tips and recommendations.
  /settings      -> Settings      : User profile and app preferences.
  /verify-device -> Device Setup  : Pair and verify your Glucoku hardware.

--------------------------------------------------------------------------------
HOW TO RUN LOCALLY
--------------------------------------------------------------------------------

  Prerequisites:
    - Node.js (v18 or above)
    - npm

  Steps:

    1. Clone the repository:
       git clone https://github.com/gordonlamyc/glucoku-my-care-main.git

    2. Navigate into the project directory:
       cd glucoku-my-care-main

    3. Install dependencies:
       npm install

    4. Start the development server:
       npm run dev

    5. Open your browser and go to:
       http://localhost:5173

--------------------------------------------------------------------------------
TEAM
--------------------------------------------------------------------------------

  Glucoku was built for the AI In Medicine Hackathon 2025.

  GitHub Repository : https://github.com/gordonlamyc/glucoku-my-care-main
  Live Demo         : https://gordonlamyc.github.io/glucoku-my-care-main

--------------------------------------------------------------------------------
DISCLAIMER
--------------------------------------------------------------------------------

Glucoku is a prototype developed for hackathon purposes. The hardware sensor
and machine learning model are research-grade and have not been clinically
validated or certified as a medical device. It is not intended for use as a
replacement for FDA/CE-approved glucose monitoring devices. Always consult a
qualified healthcare professional for medical decisions.

================================================================================
                         END OF README - GLUCOKU MY CARE
================================================================================
