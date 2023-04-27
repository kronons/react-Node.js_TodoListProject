import { useEffect, useState } from "react";
import { NewTodoForm } from "./NewTodoForm";
import { TodoList } from "./TodoList";
import "./styles.css";
import Axios  from "axios";
import { Login } from "./login-register-form/src/Login";
import { Register } from "./login-register-form//src/Register";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState({
    access: localStorage.access ? true : false,
    username: '',
    list_id: '',
});

  const [listId, setListId] = useState();

  const [showLogin, setShowLogin] = useState(true);

  const [currentForm, setCurrentForm] = useState('login');
  
  const toggleForm = (formName) => {
    if (formName === "register") {
      setShowLogin(false);
    }
    setCurrentForm(formName);
  }

  const [todos, setTodos] = useState([])

    /* Used to get local variables
  const [todos, setTodos] = useState(()=> {
  
  
  const localvalue = localStorage.getItem("ITEMS")
    if(localvalue == null) return []
  
    return JSON.parse(localvalue)
  })

  /*
  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])
*/

useEffect(() => {
  console.log('isLoggedIn:', isLoggedIn);
  if (isLoggedIn.access) {
    console.log('Fetching todos...');
    Axios.get(`http://localhost:5174/api/get?listId=${isLoggedIn.list_id}`).then((response) => {
      if(response.data.Status === "Success") {
        console.log(response.data.todos);
        setTodos(response.data.todos);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}, [isLoggedIn]);

function addTodo(title) {
  const id = crypto.randomUUID();
  setTodos(currentTodos => {
    return [
      ...currentTodos,
      { id, title, completed: false},  
    ]
  })
  return id;
}

function toggleTodo(id, completed) {
  setTodos(currentTodos => {
    const updatedTodos = currentTodos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed }
      }
      return todo
    })
    deleteTodo(id)
    return updatedTodos
  })
}

  function modifyTodo(id, newTitle) {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        Axios.post("http://localhost:5174/api/modify", {
          newItem: newTitle,
          id: id,
        }).then(() => {
          //alert("Successful Modification!")
        });
        return { ...todo, title: newTitle }
      }
      return todo
    })
    setTodos(updatedTodos)
  }
  
  function deleteTodo(id) {
    Axios.post("http://localhost:5174/api/delete", {
      id: id,
    }).then(() => {
      //alert("Successful Deletion!")
    });
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id))
  }

  function logout () {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowLogin(true); 
  }

  return (
    <div className="App2">
      {isLoggedIn ? (
        <>
          <nav className="nav">
            <h1>Todo List</h1>
            <button onClick={logout} className="logout">
              Log Out
            </button>
          </nav>
  
          <NewTodoForm
            onSubmit={addTodo}
            setTodos={setTodos}
            listId={listId}
          />
  
          <TodoList
            todos={todos}
            toggleTodo={toggleTodo}
            modifyTodo={modifyTodo}
            deleteTodo={deleteTodo}
            listId={listId}
          />
        </>
      ) : (
        showLogin !== false ? (
          <Login
            onFormSwitch={toggleForm}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setShowLogin={setShowLogin}
            setListId={setListId}
          />
        ) : (
          <Register
            onFormSwitch={toggleForm}
            setShowLogin={setShowLogin}
            UID={localStorage.access}
          />
        )
      )}
    </div>
  );
}