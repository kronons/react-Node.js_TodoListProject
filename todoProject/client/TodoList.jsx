import { TodoItem } from "./TodoItem";
import { DragDropContext, Droppable} from 'react-beautiful-dnd';

export function TodoList({ todos, toggleTodo, modifyTodo, deleteTodo, listId }) {
    
    return (
    <DragDropContext onDragEnd = {(param) => {
        const srcI = param.source.index;
        const desI = param.destination.index;
        todos.splice(desI, 0, todos.splice(srcI,1)[0]);
    }}>
        <Droppable droppableId="list">
        {(provided) => (
            <ul className="list" {...provided.droppableProps} ref={provided.innerRef}>
            {todos.length === 0 && "No Todos"}
            {todos.map((item, index) => {
                return (
                    <TodoItem
                    key         ={item.id}
                    item        ={item}
                    index       ={index}
                    toggleTodo  ={toggleTodo}
                    modifyTodo  ={modifyTodo}
                    deleteTodo  ={deleteTodo}
                    listId      ={listId}
                    />

                );
            })}
            {provided.placeholder}
            </ul>
        )}
        </Droppable>
    </DragDropContext>
  );
}