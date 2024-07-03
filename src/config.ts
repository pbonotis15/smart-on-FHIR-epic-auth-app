/*
 * Author: Panos Bonotis
 * Referenced: Followed the tutorial of Sidharth Ramesh of MedBlocks
 * Date: Jul-2024
 * Description: Configuration file for the FHIR and SMART on FHIR integration.
 * Contains constants for client ID, FHIR base URL, SMART URLs, and local storage keys.
 */

// Client ID for the application
export const CLIENT_ID = "776a8610-3d70-45e0-968d-e0175d594c29";

// Base URL for the FHIR server
export const FHIR_BASE_URL = "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4";

// URL for SMART on FHIR authorization endpoint
export const SMART_AUTH_URL = "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize";

// URL for SMART on FHIR token endpoint
export const SMART_TOKEN_URL = "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token";

// Redirect URI for the application
export const REDIRECT_URI = "http://localhost:5173/";

// Key for storing the code verifier in local storage
export const CODE_VERIFIER_LOCAL_STORAGE_KEY = "smart_code_verifier";

// Key for storing the token response in local storage
export const TOKEN_RESPONSE_LOCAL_STORAGE_KEY = "smart_token_response";