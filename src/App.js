import React, { useState, useEffect } from 'react';
import './App.scss';
import { FaUser } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
  const [posts, setPosts] = useState(savedPosts);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTextareaValue, setEditTextareaValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    if (event.key === 'Enter') {
      handleAddPost();
    }
  };

  const handleEditTextareaChange = (event) => {
    setEditTextareaValue(event.target.value);
  };

  const handleAddPost = () => {
    if (inputValue.trim() !== '') {
      const newPost = {
        content: inputValue,
        date: new Date().toLocaleString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }),
        completed: false,
      };

      if (editingIndex !== null) {
        const updatedPosts = [...posts];
        updatedPosts[editingIndex] = newPost;
        setPosts(updatedPosts);
        setEditingIndex(null);
        setIsEditing(false);
      } else {
        setPosts([...posts, newPost]);
      }

      setInputValue('');
    }
  };

  const handleDeletePost = (index) => {
    const taskTitle = posts[index].content;
    const confirmationMessage = `Are you sure you want to delete the task "${taskTitle}"?`;

    const shouldDelete = window.confirm(confirmationMessage);

    if (shouldDelete) {
      const updatedPosts = posts.filter((_, i) => i !== index);
      setPosts(updatedPosts);
      setEditingIndex(null);
      setIsEditing(false);

      // Muestra una notificación con Toastify
      toast.success(`Task "${taskTitle}" deleted successfully!`,{
        position: toast.POSITION.TOP_CENTER,
      })
      ;
     
    }
  };

  const handleEditPost = (index) => {
    setEditingIndex(index);
    setIsEditing(true);
    setEditTextareaValue(posts[index].content);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsEditing(false);
    setInputValue('');
    setEditTextareaValue('');
  };

  const handleUpdatePost = () => {
    if (editTextareaValue.trim() !== '') {
      const updatedPosts = [...posts];
      updatedPosts[editingIndex] = {
        content: editTextareaValue,
        date: new Date().toLocaleDateString(),
        completed: updatedPosts[editingIndex].completed,
      };
      setPosts(updatedPosts);
      setEditingIndex(null);
      setIsEditing(false);
      setEditTextareaValue('');

      // Muestra una notificación con Toastify
      toast.success('Task updated successfully!');
    }
  };

  const handleToggleComplete = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].completed = !updatedPosts[index].completed;
    setPosts(updatedPosts);
  };


  const completedTasks = posts.filter(post => post.completed);
  const showInline = completedTasks.length > 5;

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="container">
        <div className="added">
          <FaUser />
          <h1 className="todo">Todo app </h1>
          <div className="inside-input">
            <input
              className="input-add"
              type="text"
              placeholder="What to do"
              maxLength="250"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputChange}
            />
            <button className="add-post" onClick={handleAddPost}>
              {isEditing ? 'Add' : 'Add'}
            </button>
          </div>
          {posts.map((post, index) => (
            <div key={index} 
            className={`post-container ${post.completed ? 'completed' : ''} ${showInline ? 'inline' : ''}`}>
              {isEditing && index === editingIndex ? (
                <div>
                  <textarea
                    value={editTextareaValue}
                    onChange={handleEditTextareaChange}
                    className="edit-textarea"
                  />
                  <button className="save-post" onClick={handleUpdatePost}>
                    Guardar
                  </button>
                  <button className="cancel-edit" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="checkbox"
                    checked={post.completed}
                    onChange={() => handleToggleComplete(index)}
                  />
                  <p className="post"> {post.content}</p>
                </div>
              )}
              <div className="info">
                <div className="edit-dele">
                  <FiEdit className="edit" onClick={() => handleEditPost(index)} />
                  <RiDeleteBin5Line className="delete" onClick={() => handleDeletePost(index)} />
                </div>
                <div className="date">{post.date}</div>
              </div>
            </div>
          ))}
          <p>Total Tasks: {posts.length}</p>
        </div>

        <div className="list">
          {/* Aquí puedes mostrar la lista de posts si decides almacenarlos en un array */}
        </div>
      </div>
      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
}

export default App;
