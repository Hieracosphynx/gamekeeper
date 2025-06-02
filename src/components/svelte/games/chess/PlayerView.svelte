<script lang="ts">
  	import type { Writable } from "svelte/store";
	import type { PlayerMoveType } from "./utils.ts";

	export let move;
	export let chessPiece;
	export let moves: Writable<string[]>;
	export let playersAndMoves: Writable<PlayerMoveType[]>;
</script>

<p>Hi</p>
<p>{$move}</p>
<p>{$chessPiece}</p>
<ol>
	{#each $moves as move}
		<li>{move}</li>		
	{/each}
</ol>
<ol>
	{#each $playersAndMoves as trail}
		<li>
			<section>
				<p>{trail.player}</p>
				<p>{trail.move}</p>
			</section>
		</li>	
	{/each}
</ol>
