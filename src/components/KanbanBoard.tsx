import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

import { useSelector, useDispatch } from "react-redux";
import { addColumn, updateColumnName, moveColumn, deleteColumn as deleteCol, BoardState } from "../redux/features/board/boardColumns";
import { addTask, updateTask as updateTaskItem, deleteTask as delTask, filterTaskOnColumnDelete, moveTaskInSameColumn, moveTaskOverColumn } from "../redux/features/Tasks/taskItems";
import { RootState } from "../redux/store";

function KanbanBoard() {

  const columns = useSelector((state: RootState) => state.boardColumns)
  const tasks = useSelector((state: RootState) => state.taskItems)

  const dispatch = useDispatch()

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div
      className="
        m-auto
        flex
        min-h-[calc(100vh-4rem)]
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[20px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      h-[60px]
      w-[300px]
      min-w-[300px]
      cursor-pointer
      rounded-lg
      bg-light-mainBackgroundColor
      dark:bg-dark-mainBackgroundColor
      border-2
      border-light-columnBackgroundColor
      dark:border-dark-columnBackgroundColor
      p-4
      ring-[#764abc80]
      dark:ring-teal-500
      hover:ring-2 font-bold
      flex
      gap-2
      "
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    dispatch(addTask(newTask))
  }

  function deleteTask(id: Id) {
    dispatch(delTask(id))
  }

  function updateTask(id: Id, content: string) {
    dispatch(updateTaskItem({ id, content }))
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    dispatch(addColumn(columnToAdd))
  }

  function deleteColumn(id: Id) {
    dispatch(deleteCol(id))
    dispatch(filterTaskOnColumnDelete(id))
  }

  function updateColumn(id: Id, title: string) {
    dispatch(updateColumnName({ id, title }))
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");
    modifyColumnPosition(columns, activeId, overId);
  }

  function modifyColumnPosition(columns: BoardState[], activeId: UniqueIdentifier, overId: UniqueIdentifier) {
    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);
    const columnSwapped = arrayMove(columns, activeColumnIndex, overColumnIndex);
    dispatch(moveColumn(columnSwapped))

  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const t = structuredClone(tasks);
      const activeIndex = t.findIndex((t: Task) => t.id === activeId);
      const overIndex = t.findIndex((t: Task) => t.id === overId);
      if (t[activeIndex].columnId != t[overIndex].columnId) {
        t[activeIndex].columnId = t[overIndex].columnId;
        dispatch(moveTaskInSameColumn(arrayMove(t, activeIndex, overIndex - 1)))
      } else {
        dispatch(moveTaskInSameColumn(arrayMove(t, activeIndex, overIndex)))
      }
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const t = structuredClone(tasks);
      const activeIndex = t.findIndex((t: Task) => t.id === activeId);
      t[activeIndex].columnId = overId;
      console.log("DROPPING TASK OVER COLUMN", { activeIndex });
      const movedTasksOverColumn = arrayMove(t, activeIndex, activeIndex);
      dispatch(moveTaskOverColumn(movedTasksOverColumn))
    }
  }
}

function generateId() {
  return crypto.randomUUID()
}

export default KanbanBoard;
