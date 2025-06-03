<script lang="ts">
  	import type { Writable } from "svelte/store";
	import { type StandardMoveSet, type KingMoveSet, type RookMoveSet, isKingOrRook } from "./utils.ts";

	export let moves: Writable<string[]>;
	export let playerMoveSet: Writable<StandardMoveSet[] | KingMoveSet[] | RookMoveSet[]>;
</script>

<ol>
	{#each $moves as move}
		<li>{move}</li>		
	{/each}
</ol>
<ol>
	{#each $playerMoveSet as trail}
		<li>
			<section>
				<p>{trail.player}</p>
				<p>{trail.piece}</p>
				<p>{trail.move}</p>
				{#if trail.take}
					<p>{trail.player} {trail.piece} has taken {trail.capturedPiece}</p>
				{/if}
				{#if isKingOrRook(trail) }
					{#if trail.isCastling}
						<p>{trail.player} {trail.piece} castled {trail.castlingType}</p>	
					{/if}
				{/if}
			</section>
		</li>	
	{/each}
</ol>
