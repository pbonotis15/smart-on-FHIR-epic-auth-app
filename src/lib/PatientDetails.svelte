<script lang="ts">
    import axios from "axios";
    import { FHIR_BASE_URL } from "../config";
    import type { Patient } from "fhir/r4";
    
    export let accessToken: string
    export let patientId: string

    const getPatientDetails = async () => {
        const patientResponse = await axios.get<Patient>(`${FHIR_BASE_URL}/Patient/${patientId}`,{
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        return patientResponse.data
    }
</script>

{#await getPatientDetails()}
    Loading ...
{:then patient}
    {JSON.stringify(patient)} 
    <p>Hello, {patient?.name?.[0]?.given?.[0]}</p>
{/await}