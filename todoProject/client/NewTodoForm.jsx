import { useState } from 'react';
import Axios from 'axios';

export function NewTodoForm({ onSubmit, setTodos, listId}) {
  const [newItem, setNewItem] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (newItem === '') return;
    const id = onSubmit(newItem);
    if (!id) return;
    setNewItem('');
    Axios.post('http://localhost:5174/api/insert', {
      id,
      newItem,
      listId,
    }).then(() => {
      //alert('Successful Insert!');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
      <div className="form-row">
        <label htmlFor="item">New Item</label>
        <input value={newItem} onChange={(e) => setNewItem(e.target.value)} type="text" id="item" />
      </div>
      <button className="btn">Add</button>

    </form>
  );
}