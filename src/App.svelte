<!--
 * Author: Panos Bonotis
 * Referenced: Followed the tutorial of Sidharth Ramesh of MedBlocks
 * Date: Jul-2024
 * Description: This script handles the OAuth2 authorization flow and displays patient details using Svelte.
 * Dependencies: axios, pkce-challenge, svelte
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { CLIENT_ID, FHIR_BASE_URL, REDIRECT_URI, SMART_AUTH_URL, SMART_TOKEN_URL, CODE_VERIFIER_LOCAL_STORAGE_KEY, TOKEN_RESPONSE_LOCAL_STORAGE_KEY } from './config';
  import axios from 'axios';
  import pkceChallenge from "pkce-challenge";
  import PatientDetails from './lib/PatientDetails.svelte';
  import MedicationDetails from './lib/MedicationDetails.svelte';
  import ObservationViewer from './lib/ObservationViewer.svelte';

  // Token response type
  let tokenResponse: {
      access_token: string,
      id_token: string,
      patient: string,
      scope: string
  };

  // Loading state
  let loading = true;

  // Helper function to get seconds from a date
  const getSecs = (date: Date) => {
      return Math.round((date).getTime() / 1000);
  };

  // Generate a PKCE code challenge and verifier
  const generateCodeChallenge = async () => {
      const { code_challenge, code_verifier } = await pkceChallenge();
      localStorage.setItem(CODE_VERIFIER_LOCAL_STORAGE_KEY, code_verifier);
      return code_challenge;
  };

  // Generate the redirect URL for the authorization request
  const generateRedirectUrl = (codeChallenge: string) => {
      const authorizationUrl = new URL(SMART_AUTH_URL);
      authorizationUrl.searchParams.set('client_id', CLIENT_ID);
      authorizationUrl.searchParams.set('scope', 'openid fhirUser');
      authorizationUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authorizationUrl.searchParams.set('response_type', 'code');
      authorizationUrl.searchParams.set('aud', FHIR_BASE_URL);
      authorizationUrl.searchParams.set('code_challenge', codeChallenge);
      authorizationUrl.searchParams.set('code_challenge_method', 'S256');

      return authorizationUrl.href;
  };

  // Make a request to exchange the authorization code for a token
  const makeTokenRequest = async (code: string, codeVerifier: string) => {
      const tokenRequestForm = new FormData();
      tokenRequestForm.set('grant_type', 'authorization_code');
      tokenRequestForm.set('code', code);
      tokenRequestForm.set('redirect_uri', REDIRECT_URI);
      tokenRequestForm.set('client_id', CLIENT_ID);
      tokenRequestForm.set('code_verifier', codeVerifier);
      const tokenGeneratedAt = getSecs(new Date());

      const response = await axios.postForm(SMART_TOKEN_URL, tokenRequestForm);
      tokenResponse = response.data;
      localStorage.setItem(TOKEN_RESPONSE_LOCAL_STORAGE_KEY, JSON.stringify({ ...tokenResponse, issued_at_in_secs: tokenGeneratedAt }));
      console.log(response);
  };

  // onMount lifecycle hook to handle initialization
  onMount(async () => {
      console.log("onMount is called");
      const code = new URL(window.location.href).searchParams.get('code');
      const codeVerifier = localStorage.getItem(CODE_VERIFIER_LOCAL_STORAGE_KEY);
      const tokenResponseString = localStorage.getItem(TOKEN_RESPONSE_LOCAL_STORAGE_KEY);
      if (tokenResponseString) {
          const tokenResponseTemp = JSON.parse(tokenResponseString);
          const { issued_at_in_secs } = tokenResponseTemp;
          const expires_in_secs = issued_at_in_secs + tokenResponseTemp.expires_in;
          const now_in_secs = getSecs(new Date());
          if (now_in_secs >= expires_in_secs) {
              localStorage.removeItem(TOKEN_RESPONSE_LOCAL_STORAGE_KEY);
          } else {
              tokenResponse = tokenResponseTemp;
          }
      }
      if (!tokenResponse) {
          if (code && codeVerifier) {
              await makeTokenRequest(code, codeVerifier);
              localStorage.removeItem(CODE_VERIFIER_LOCAL_STORAGE_KEY);
          }
      }
      loading = false;
  });

  // Initiate the authorization request
  const initiateAuthorizationRequest = async () => {
      const codeChallenge = await generateCodeChallenge();
      const redirectUrl = generateRedirectUrl(codeChallenge);
      console.log(redirectUrl);
      window.location.href = redirectUrl;
  };
</script>

<main>
  {#if loading}
      Loading ...
  {:else}
      {#if tokenResponse}
          <PatientDetails accessToken={tokenResponse.access_token} patientId={tokenResponse.patient} />
          <MedicationDetails accessToken={tokenResponse.access_token} patientId={tokenResponse.patient} />
          <ObservationViewer accessToken={tokenResponse.access_token} patientId={tokenResponse.patient} />
          <ObservationViewer title="Vital Signs" category='vital-signs' accessToken={tokenResponse.access_token} patientId={tokenResponse.patient} />
      {:else}
          <div class="flex justify-center my-20">
              <button on:click={initiateAuthorizationRequest} class="p-3 bg-black rounded-md text-white">Sign in with Epic</button>
          </div>
      {/if}
  {/if}
</main>