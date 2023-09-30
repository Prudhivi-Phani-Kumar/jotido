import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface BoardState {
	id: string | number;
	title: string;
}

const initialState: BoardState[] = []

export const boardColumns = createSlice({
	name: "boardColumns",
	initialState,
	reducers: {
		addColumn: (state, action) => {
			state.push(action.payload)
		},
		updateColumnName: (state, action) => {
			return state.map((col) => {
				if (col.id !== action.payload.id) return col;
				return { ...col, title: action.payload.title };
			});
		},
		moveColumn: (state, action) => {
			return action.payload
		},
		deleteColumn: (state, action) => {
			return state.filter((col) => col.id !== action.payload);
		}
	}
})

export const { addColumn, updateColumnName, moveColumn, deleteColumn } = boardColumns.actions

export default boardColumns.reducer