<!--
 * Author: Panos Bonotis
 * Referenced: Followed the tutorial of Sidharth Ramesh of MedBlocks
 * Date: Jul-2024
 * Description: This script fetches and displays patient details from a FHIR server.
 * Dependencies: axios, FHIR R4
 -->

<script lang="ts">
    // Importing the axios library for making HTTP requests
    import axios from "axios";
    // Importing the base URL for the FHIR API from the config file
    import { FHIR_BASE_URL } from "../config";
    // Importing the Patient type from FHIR R4 specification
    import type { Patient } from "fhir/r4";

    // Declaring the access token and patient ID variables
    export let accessToken: string;
    export let patientId: string;

    // Function to get patient details from the FHIR server
    const getPatientDetails = async () => {
        // Making a GET request to the FHIR server to fetch patient details
        const patientResponse = await axios.get<Patient>(`${FHIR_BASE_URL}/Patient/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        // Returning the patient data
        return patientResponse.data;
    }
</script>

<!-- HTML template starts here -->
<div class="mt-10 max-w-md mx-auto">
    {#await getPatientDetails()}
        <!-- Loading indicator while the patient details are being fetched -->
        Loading ...
    {:then patient}
        <!-- Displaying patient details once they are fetched -->
        <h1 class="text-2xl">
            Hello, {patient?.name?.[0]?.given?.[0]}
        </h1>
        <p>Welcome to your record!</p>
        <p class="mt-5">
            <span class="font-semibold">Full name:</span> {patient?.name?.[0]?.text}
        </p>
        <p>
            <span class="font-semibold">Epic Identifier:</span> 
            {patient.identifier?.find(i => i.system === 'urn:oid:1.2.840.114350.1.13.0.1.7.5.737384.0')?.value}
        </p>
        <p>
            <span class="font-semibold">Date of Birth:</span> {patient?.birthDate}
        </p>
        <p>
            <span class="font-semibold">Gender:</span> 
            <span class="capitalize">{patient?.gender}</span>
        </p>
    {/await}
</div>