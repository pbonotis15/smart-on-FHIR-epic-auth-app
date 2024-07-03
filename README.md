# Svelte FHIR App authenticating and connecting to EPIC

## Referenced
Followed the tutorial of Sidharth Ramesh of MedBlocks

## Description
This Svelte application integrates with FHIR and SMART on FHIR to provide an interface for viewing patient details, medication requests, and lab results. The app handles OAuth2 authorization flow and interacts with the FHIR server to fetch and display data.
## File Descriptions

# src/config.ts
Configuration file for the FHIR and SMART on FHIR integration. Contains constants for client ID, FHIR base URL, SMART URLs, and local storage keys.

# src/App.svelte
Main Svelte component that handles the OAuth2 authorization flow and displays patient details. It includes components for patient details, medication details, and lab results.

# src/lib/MedicationDetails.svelte
Fetches and displays medication requests for a patient using FHIR R4. It uses the axios library to make HTTP requests.

# src/lib/ObservationViewer.svelte
Fetches and displays lab results for a patient using FHIR R4. It uses the axios library to make HTTP requests and displays observation details.

# src/lib/PatientDetails.svelte
Fetches and displays patient details from the FHIR server. It uses the axios library to make HTTP requests.

## Usage Guide
1. Open the app in your browser (usually at http://localhost:5173/).
2. Click the "Sign in with Epic" button to initiate the OAuth2 authorization flow.
3. Enter the provided credentials to sign in.
4. View the patient details, medication requests, and lab results.

## Setup Instructions

# Dependencies
- Svelte
- Axios
- pkce-challenge
- date-fns
- FHIR R4

### Prerequisites
- Node.js and npm installed
- A FHIR server (e.g., Epic's FHIR server) with OAuth2 support

### Installation
1. Clone the repository:
    ```sh
    git clone 'current repo'
    cd svelte-fhir-app
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `config.ts` file in the `src` directory with your FHIR and OAuth2 credentials. Use the provided `config.ts` as a reference.

4. Start the development server:
    ```sh
    npm run dev
    ```

### Build for Production
To build the app for production, run:
```sh
npm run build
