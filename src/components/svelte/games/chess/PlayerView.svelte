<script lang="ts">
  import type { Writable } from "svelte/store";

	export let move;
	export let chessPiece;
	export let moves: Writable<string[]>;
</script>

<p>Hi</p>
<p>{$move}</p>
<p>{$chessPiece}</p>

<ol>
	{#each $moves as move}
		<li>{move}</li>		
	{/each}
</ol>
