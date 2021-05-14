import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [todos, setTodos] = useState([]);
  const [arr, setArr] = useState([]);
  const [s, setS] = useState('');
  const [input, setInput] = useState('');

  const addTodo = (event) => {
    event.preventDefault();
    todos.push(input); 
    let j = 0;
    for (let i = todos.length - 1; i >= 0; i--) {
      arr[i] = todos[j];
      j++;
    }     
    setInput('');

  }

  const search = arr.filter(i => i.toLowerCase() === input.toLowerCase());
  useEffect(() => {

    setS(search);
  }, [input]);

  return (
    <div className="App">

      <h1>Add Something...</h1>
      <form>
        <input value={input} placeholder="Type here..." onChange={event => setInput(event.target.value)} />
        <button type="submit" onClick={addTodo}>Add</button>
      </form>

      <ul>
        {
          s.length > 0 ?
            search.map(i => (
              <li><h1>{i}</h1></li>
            ))
            :
            arr.map(i => (
              <li><h1>{i}</h1></li>
            ))
        }
      </ul>
    </div>
  );
}


export default App;
