import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
axios.get('/api/taskitems')
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/taskitems');
            setTasks(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to fetch tasks. Please check your API connection.');
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            const response = await axios.post('/api/taskitems', { title: newTaskTitle, isComplete: false });
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
        } catch (err) {
            console.error('Error adding task:', err);
            setError('Failed to add task. Please try again.');
        }
    };

    const toggleTask = async (task) => {
        try {
            const updatedTask = { ...task, isComplete: !task.isComplete };
            await axios.put(`/api/taskitems/${task.id}`, updatedTask);
            setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
        } catch (err) {
            console.error('Error toggling task:', err);
            setError('Failed to update task. Please try again.');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`/api/taskitems/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Failed to delete task. Please try again.');
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (filter === 'active') return !task.isComplete;
            if (filter === 'completed') return task.isComplete;
            return true;
        });
    }, [tasks, filter]);

    const taskStats = useMemo(() => {
        return {
            total: tasks.length,
            active: tasks.filter(t => !t.isComplete).length,
            completed: tasks.filter(t => t.isComplete).length
        };
    }, [tasks]);

    return (
        <div className="app-container">
            <div className="glass-panel">
                <h1 className="app-title">Quantum Task Orchestrator</h1>
                <div className="task-stats">
                    <span>Total: {taskStats.total}</span>
                    <span>Active: {taskStats.active}</span>
                    <span>Completed: {taskStats.completed}</span>
                </div>
                <form onSubmit={addTask} className="task-form">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Enter a new quantum task"
                        className="task-input"
                    />
                    <button type="submit" className="btn add-btn">Synthesize Task</button>
                </form>
                <div className="filter-controls">
                    <button onClick={() => setFilter('all')} className={`btn filter-btn ${filter === 'all' ? 'active' : ''}`}>All</button>
                    <button onClick={() => setFilter('active')} className={`btn filter-btn ${filter === 'active' ? 'active' : ''}`}>Active</button>
                    <button onClick={() => setFilter('completed')} className={`btn filter-btn ${filter === 'completed' ? 'active' : ''}`}>Completed</button>
                </div>
                {isLoading ? (
                    <div className="loading-spinner"></div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <ul className="task-list">
                        {filteredTasks.map((task) => (
                            <li key={task.id} className={`task-item ${task.isComplete ? 'completed' : ''}`}>
                                <label className="task-label">
                                    <input
                                        type="checkbox"
                                        checked={task.isComplete}
                                        onChange={() => toggleTask(task)}
                                        className="task-checkbox"
                                    />
                                    <span className="task-title">{task.title}</span>
                                </label>
                                <button onClick={() => deleteTask(task.id)} className="btn delete-btn">Disintegrate</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;