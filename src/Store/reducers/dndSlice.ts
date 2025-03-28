import { IPriority } from './../../models/dnd/IPriority';
import { IColumn } from './../../models/dnd/IData';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialData from "../../components/Desk/initial-data";
import { IColumns, ITasks } from "../../models/dnd/IData";
import { IResult } from "../../models/dnd/IResult";
import { IDeleteTask } from '../../models/dnd/IDeleteTask';

interface DndState {
    data: {
        tasks: ITasks,
        columns: IColumns,
        columnOrder: string[]
    },
    result: IResult,
    start: IColumn,
    finish: IColumn
}
  
const initialState: DndState = {
    data: initialData,
    result: {
        destination: {
            droppableId: "",
            index: null
        },
        source: {
            index: null, 
            droppableId: ""
        },
        draggableId: "",
    },
    start: {
        id: "",
        title: "",
        taskIds: [],
    },
    finish: {
        id: "",
        title: "",
        taskIds: [],
    },
}

export const dndSlice = createSlice({
    name: 'dnd',
    initialState,
    reducers: {
        setResult: (state, action: PayloadAction<IResult>) => {
            state.result.destination = action.payload.destination
            state.result.source = action.payload.source
            state.result.draggableId = action.payload.draggableId
        },
        setStart: (state, action: PayloadAction<IColumn>) => {
            state.start = action.payload
        },
        setFinish: (state, action: PayloadAction<IColumn>) => {
            state.finish = action.payload
        },
        reorderTaskInOwnStatus: (state) => {
            const newTaskIds = Array.from(state.start.taskIds) // получили массив с тасками taskIds: ["0", "1"]
            newTaskIds.splice(state.result.source.index!, 1) // удалили элемент, который тянули
            newTaskIds.splice(state.result.destination.index!, 0, state.result.draggableId) // вставили этот элемент в новое место

            const Status = state.data.columns[state.start.id] // Status (столбец где произошло изменение) 
            Status.taskIds = newTaskIds // заменили старый массив на новый 
        },
        reorderTaskInDifferentStatus: (state) => {
            const startTaskIds = Array.from(state.start.taskIds) // массив с тасками в стартовом статусе taskIds: ["0", "1"]
            startTaskIds.splice(state.result.source.index!, 1) // // удалили элемент, который тянули

            const finishTaskIds = Array.from(state.finish.taskIds) // массив с тасками в конечном статусе taskIds: ["0", "1"]
            finishTaskIds.splice(state.result.destination.index!, 0, state.result.draggableId) // вставили элемент в новое место

            const startStatus = state.data.columns[state.start.id] // Status (столбец откуда взяли таску)
            const finishStatus = state.data.columns[state.finish.id] // Status (столбец куда вставили таску)

            startStatus.taskIds = startTaskIds // заменили старый массив на новый 
            finishStatus.taskIds = finishTaskIds // заменили старый массив на новый 
        },
        setOpenPriorityСolumn: (state, action: PayloadAction<string>) => {
            const task = state.data.tasks[action.payload]
            task.isOpen = !task.isOpen
        },
        onChangePriority: (state, action: PayloadAction<IPriority>) => {
            const task = state.data.tasks[action.payload.id]
            task.priority = action.payload.index
        },
        deleteTask: (state, action: PayloadAction<IDeleteTask>) => { 
            const deleteArr = state.data.columns[action.payload.column.id].taskIds // массив где произойдёт удаление таски
            const index = deleteArr.indexOf(action.payload.id) // индекс удаляемого элемента в массиве
            deleteArr.splice(index, 1) 

            delete state.data.tasks[action.payload.id] 
        },
    }
})

export const { setResult, setStart, setFinish, reorderTaskInOwnStatus, reorderTaskInDifferentStatus, setOpenPriorityСolumn, onChangePriority, deleteTask } = dndSlice.actions

export default dndSlice.reducer