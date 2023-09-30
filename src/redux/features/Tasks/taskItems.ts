import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; "@reduxjs/toolkit";

export interface Task {
	id: string | number;
	columnId: string | number;
	content: string;
}


const initialState: Task[] = [];

export const taskItems = createSlice({
	name: "taskItems",
	initialState,
	reducers: {
		addTask: (state, action) => {
			state.push(action.payload)
		},
		updateTask: (state, action) => {
			return state.map((task) => {
				if (task.id !== action.payload.id) return task;
				return { ...task, content: action.payload.content };
			});
		},
		moveTaskInSameColumn: (state, action) => {
			return action.payload
		},
		moveTaskOverColumn: (state, action) => {
			return action.payload
		},
		filterTaskOnColumnDelete: (state, action) => {
			return state.filter((t) => t.columnId !== action.payload);
		},
		deleteTask: (state, action) => {
			return state.filter((task) => task.id !== action.payload);
		}
	}
})

export const { addTask, updateTask, moveTaskInSameColumn, moveTaskOverColumn, filterTaskOnColumnDelete, deleteTask } = taskItems.actions

export default taskItems.reducer