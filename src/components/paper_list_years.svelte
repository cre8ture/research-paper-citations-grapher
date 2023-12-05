<script>
    import { onMount } from 'svelte';
    import { scholar_json } from "../support/store.js";

    let publicationYears = [];

    async function fetchPublicationYear(paperId) {
        const response = await fetch(`/api/semantic_scholar_years?paperId=${encodeURIComponent(paperId)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch publication year');
        }
        return await response.json();
    }

    async function fetchAllPublicationYears() {
        for (const paper of $scholar_json) {
            try {
                const data = await fetchPublicationYear(paper.paperId);
                publicationYears.push({ paperId: paper.paperId, year: data.year });
            } catch (error) {
                console.error('An error occurred while fetching publication year:', error);
            }
        }
    }

    onMount(() => {
        fetchAllPublicationYears();
    });
</script>

<!-- HTML part of your component -->
<div>
    {#if publicationYears.length === 0}
        <p>Loading publication years...</p>
    {/if}

    {#if publicationYears.length > 0}
        <ul>
            {#each publicationYears as { paperId, year }}
                <li>Paper ID: {paperId} - Publication Year: {year}</li>
            {/each}
        </ul>
    {/if}
</div>
