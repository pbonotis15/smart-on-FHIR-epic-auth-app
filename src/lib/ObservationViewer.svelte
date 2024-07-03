<!--
 * Author: Panos Bonotis
 * Referenced: Followed the tutorial of Sidharth Ramesh of MedBlocks
 * Date: Jul-2024
 * Description: This script fetches and displays lab results for a patient using Svelte and FHIR.
 * Dependencies: axios, FHIR R4, date-fns, Svelte
 -->

<script lang="ts">
  // Import necessary libraries and types
  import axios from "axios";
  import { FHIR_BASE_URL } from "../config";
  import { formatRelative } from 'date-fns';
  import type { Bundle, BundleEntry, Observation, OperationOutcome } from "fhir/r4";

  // Declare variables for access token, patient ID, category, and title
  export let accessToken: string;
  export let patientId: string;
  export let category: string = 'laboratory';
  export let title: string = 'Lab Results';

  // Function to get lab results for a patient
  const getLabResults = async () => {
      // Make a GET request to fetch Observation resources of the specified category
      const labObservationResponse = await axios.get<Bundle<Observation | OperationOutcome>>(`${FHIR_BASE_URL}/Observation`, {
          params: {
              subject: patientId,
              category,
              sort: '-date'
          },
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      });
      // Return the response data
      return labObservationResponse.data;
  };

  // Function to display observation details
  const getObservationDisplay = (observation: Observation | undefined) => {
      if (!observation) {
          return '';
      }
      // Check if the observation is a blood pressure measurement
      const isBp = observation.code?.coding?.find(a => a.code === '55284-4');
      if (isBp) {
          // Extract systolic and diastolic values
          const systolicComponent = observation.component?.find(a => a.code?.coding?.find(b => b.code === '8480-6'));
          const systolic = systolicComponent?.valueQuantity?.value;
          const diastolicComponent = observation.component?.find(a => a.code?.coding?.find(b => b.code === '8462-4'));
          const diastolic = diastolicComponent?.valueQuantity?.value;
          return `${systolic}/${diastolic}`;
      }
      // Display value with or without unit
      if (!observation?.valueQuantity?.unit) {
          return observation?.valueQuantity?.value;
      }
      return `${observation?.valueQuantity?.value} ${observation?.valueQuantity?.unit}`;
  };

  // Function to extract and sort Observation entries from a Bundle
  const getObservationEntries = (bundle: Bundle<Observation | OperationOutcome>): BundleEntry<Observation>[] => {
      if (!bundle?.entry) {
          return [];
      }
      // Filter and return only Observation entries, sorted by effective date in descending order
      const results = bundle.entry?.filter((entry) => entry.resource?.resourceType === 'Observation') as BundleEntry<Observation>[];
      return results.sort((a, b) => {
          if (a?.resource?.effectiveDateTime && b?.resource?.effectiveDateTime) {
              return new Date(b?.resource?.effectiveDateTime).getTime() - new Date(a?.resource?.effectiveDateTime).getTime();
          }
          return 0;
      });
  };
</script>

<!-- HTML template starts here -->
<div class="mt-10 max-w-md mx-auto">
  {#await getLabResults()}
      <!-- Loading indicator while the lab results are being fetched -->
      loading...
  {:then labResults} 
      <h1 class="text-2xl">
          {title}
      </h1>
      <!-- Loop through the Observation entries and display them -->
      {#each getObservationEntries(labResults) as observation, i}
          <p>
              <span class="font-medium">
                  {observation.resource?.code?.text}
                  {#if observation?.resource?.effectiveDateTime}
                      ({formatRelative(new Date(observation?.resource.effectiveDateTime), new Date())})
                  {/if}
                  :
              </span>
              {getObservationDisplay(observation.resource)}
          </p>
          <div class="ml-4">
          </div>
      {/each}
  {/await}
</div>
