<!--
 * Author: Panos Bonotis
 * Referenced: Followed the tutorial of Sidharth Ramesh of MedBlocks
 * Date: Jul-2024
 * Description: This script fetches and displays medication requests for a patient using Svelte and FHIR.
 * Dependencies: axios, FHIR R4, Svelte
 -->

<script lang="ts">
    // Import necessary libraries and types
    import axios from "axios";
    import { FHIR_BASE_URL } from '../config';
    import type { Bundle, BundleEntry, MedicationRequest, OperationOutcome } from "fhir/r4";
  
    // Declare access token and patient ID variables
    export let accessToken: string;
    export let patientId: string;
  
    // Function to get medication requests for a patient
    const getMedications = async () => {
        // Make a GET request to fetch MedicationRequest resources
        const medicationRequestResponse = await axios.get<Bundle<MedicationRequest | OperationOutcome>>(`${FHIR_BASE_URL}/MedicationRequest`, {
            params: {
                subject: patientId
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        // Return the response data
        return medicationRequestResponse.data;
    };
  
    // Function to extract MedicationRequest entries from a Bundle
    const getMedicationRequestEntries = (bundle: Bundle<MedicationRequest | OperationOutcome>): BundleEntry<MedicationRequest>[] => {
        if (!bundle?.entry) {
            return [];
        }
        // Filter and return only MedicationRequest entries
        return bundle.entry?.filter((entry) => entry.resource?.resourceType === 'MedicationRequest') as BundleEntry<MedicationRequest>[];
    };
</script>

<!-- HTML template starts here -->
<div class="mt-10 max-w-md mx-auto">
    {#await getMedications()}
        <!-- Loading indicator while the medication requests are being fetched -->
        loading...
    {:then medicationList} 
        <h1 class="text-2xl">
            Medication List
        </h1>
        <!-- Loop through the MedicationRequest entries and display them -->
        {#each getMedicationRequestEntries(medicationList) as medication, i}
            <p class="font-medium">
                {i + 1}. {medication.resource?.medicationReference?.display}
            </p>
            <div class="ml-4">
                {#if medication?.resource?.dosageInstruction?.[0]?.patientInstruction}
                    <p>
                        Dosage: {medication?.resource?.dosageInstruction?.[0]?.patientInstruction}
                    </p>
                {/if}
                {#if medication?.resource?.reasonCode?.[0]?.text}
                    <p>
                        Reason: {medication?.resource?.reasonCode?.[0]?.text}
                    </p>
                {/if}
            </div>
        {/each}
    {/await}
</div>
