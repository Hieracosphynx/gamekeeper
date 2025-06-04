<script lang="ts">
  	import type { Writable } from "svelte/store";
	import { type StandardMoveSet, type KingMoveSet, type RookMoveSet, PieceType } from "./utils.ts";
	import { isKing, isRook } from "./utils.ts";

	export let moves: Writable<string[]>;
	export let playerMoveSet: Writable<StandardMoveSet[] | KingMoveSet[] | RookMoveSet[]>;
	
	export let isGameOver: boolean = false;
	export let matchLoser: string;
	export let matchWinner: string;

	export let activePiece: PieceType | undefined = undefined; 
	export let isRecordingPiece: boolean = false;
	export let chessPieceBtnHandler = (piece: PieceType) => { 
		activePiece = piece 
		isRecordingPiece = piece != undefined;
		console.log(piece, isRecordingPiece);
	};
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
				{#if isKing(trail) || isRook(trail) }
					{#if trail.isCastling}
						<p>{trail.player} {trail.piece} castled {trail.castlingType}</p>	
					{/if}
				{/if}
			</section>
		</li>	
	{/each}
</ol>
{#if isGameOver}
	<div>
		<p>{matchLoser} lost the match!</p>
		<p>{matchWinner} won the match!</p>
	</div>
{/if}
<div>
	<div>
		<button on:click={() => chessPieceBtnHandler(PieceType.PAWN)}>{PieceType.PAWN}</button>
		<button on:click={() => chessPieceBtnHandler(PieceType.KNIGHT)}>{PieceType.KNIGHT}</button>
	</div>
	<div>
		<button on:click={() => chessPieceBtnHandler(PieceType.BISHOP)}>{PieceType.BISHOP}</button>
		<button on:click={() => chessPieceBtnHandler(PieceType.ROOK)}>{PieceType.ROOK}</button>
	</div>
	<div>
		<button on:click={() => chessPieceBtnHandler(PieceType.QUEEN)}>{PieceType.QUEEN}</button>
		<button on:click={() => chessPieceBtnHandler(PieceType.KING)}>{PieceType.KING}</button>
	</div>
	{#if isRecordingPiece}
		<p>Active piece: {activePiece}</p>	
	{/if}
</div>
