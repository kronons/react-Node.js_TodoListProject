import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

export function TodoItem ({ item, index, toggleTodo, modifyTodo, deleteTodo, listId} ){

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);  

  function handleEdit() {
      setEditing(true);
    }
  
    function handleCancel() {
      setNewTitle(item.title);
      setEditing(false);
    }
  
    function handleSubmit(e) {
      e.preventDefault();
      if (newTitle.trim() === '') {
        setNewTitle(item.title);
        setEditing(false);
        return;
      }
      modifyTodo(item.id, newTitle);
      setEditing(false);
    }

    if (item.listId !== listId) {
        return null; // do not render this item if it doesn't belong to the list
    }

  return(
    
    <Draggable 

        key={item.id} 
        draggableId={ 'draggable-'+ item.id }
        index={index}
    >

        {(provided, snapshot)=> (
            <li  
                ref= {provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>

                <label> 
                    <input type="checkbox" 
                        checked={item.completed}
                        onChange={e => toggleTodo(item.id, e.target.checked)}
                    />
                    {item.title}
                </label>
            
                {editing ? (
                    <form className='modifyForm' onSubmit={handleSubmit}>
                        <input id="modifyInput" type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                        <button id="saveModifyButton" type="submit">Save</button>
                        <button id="cancelModifyButton" type="button" onClick={handleCancel}>Cancel</button>
                    </form>
                ) : (
                    <>
                        <button 
                            onClick= {handleEdit }
                            className="btn btn-modify">
                                M
                        </button>
                        <button 
                            onClick={ () => deleteTodo(item.id) }
                            className="btn btn-danger">
                                X
                        </button>
                    </>
                )}
            </li>
        )}
      </Draggable>
  );
}