import { useContext, createContext, useReducer } from 'react'
import { useUserProvider } from './UserProvider.jsx';


const TasksContext = createContext();

export function useTasksProvider() {
  return useContext(TasksContext);
}


function TasksProvider({ children }) {
    const TaskActionTypes = {
        GET_TASKS: 'GET_TASKS',
        ADD_TASK: 'ADD_TASK',
        UPDATE_TASK: 'UPDATE_TASK',
        DELETE_TASK: 'DELETE_TASK',
        TOGGLE_TASK_COMPLETION: 'TOGGLE_TASK_COMPLETION'
    }

    const { user, refreshToken } = useUserProvider();
    const [ tasks, dispatch ] = useReducer(tasksReducer, [])
    

    function tasksReducer(state, action) {
        // task manipulation logic here
        switch(action.type) {
            case TaskActionTypes.GET_TASKS: {
                return [...action.payload];
            }

            case TaskActionTypes.ADD_TASK: {
                return [ action.payload, ...state ];
            }

            case TaskActionTypes.UPDATE_TASK: {
                return state.map( function( task ) {
                    if ( task._id === action.payload._id ) {
                        return { ...task, ...action.payload };
                    }
                    return task;
                });
            }

            case TaskActionTypes.DELETE_TASK: {
                return state.filter( function( task ) {
                    return task._id !== action.payload;
                });
            }

            default: {
                return state;
            }
        }
    }

    async function getTasks({ limit, sort, order, searchTerm } = { limit: 5, sort: "text", order: "ASC", searchTerm: ""}, retries = 0) {
        // get backend URL from env
        const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

        // get user access token
        const accessToken = user.accessToken;

        // fetch tasks from backend
        try {
            // make fetch request
            const response = await fetch(`${backendURL}/api/tasks?limit=${limit}&sort=${sort}&order=${order}&filter=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            
            // check if response is ok and dispatch action to update tasks state
            // else return error message
            if ( response.ok ) {
                // convert response to json
                const respJson = await response.json();

                dispatch({ type: TaskActionTypes.GET_TASKS, payload: respJson.data.tasks });

                return { status: "success", totalTasks: respJson.data.totalTasks };
            } else {
                if ( response.status != 401 ) {
                    // convert response to json
                    const respJson = await response.json();

                    return { 
                        error: respJson.error.message,
                        status: "error"
                    };
                } else {
                    await refreshToken()

                    if ( retries >= 1 ) {
                        return { 
                            error: "Failed to fetch tasks after multiple attempts.",
                            status: "error"
                        };
                    } else {
                        return await getTasks({ limit, sort, order, searchTerm }, retries + 1)
                    }
                }
            }
        } catch( error ) {
            return { 
                error: error.message,
                status: "error"
            };
        }
    }

    async function addTask( objective, dueDate ) {
        // get backend URL from env
        const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

        // get user access token
        const accessToken = user.accessToken;

        // make fetch request to add task to backend
        try {
            // make POST request with task data and access token in headers
            const response = await fetch(`${backendURL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: objective, date: dueDate })
            });

            // check if response is ok and dispatch action to add task to state
            // else return error message
            if (response.ok) {
                // convert response to json
                const respJson = await response.json();

                dispatch({ type: TaskActionTypes.ADD_TASK, payload: respJson.data });
                return { status: "success" };
            } else {
                if ( response.status != 401 ) {
                    // convert response to json
                    const respJson = await response.json();

                    return {
                        error: respJson.error.message,
                        status: "error"
                    };
                } else {
                    await refreshToken()

                    return addTask( objective, dueDate )
                }
            }
        } catch (error) {
            return {
                error: error.message,
                status: "error"
            };
        }
    }

    async function updateTask( taskId, updatedData ) {
        // get backend URL from env
        const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

        // get user access token
        const accessToken = user.accessToken;

        // make fetch request to update task in backend
        try {
            // make PUT request with updated task data and access token in headers
            const response = await fetch(`${backendURL}/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            // check if response is ok and dispatch action to update task in state
            // else return error message
            if (response.ok) {
                // convert response to json
                const respJson = await response.json();

                dispatch({ type: TaskActionTypes.UPDATE_TASK, payload: respJson.data });
                return { status: "success" };
            } else {
                if ( response.status != 401 ) {
                    // convert response to json
                    const respJson = await response.json();
                
                    return {
                        error: respJson.error.message,
                        status: "error"
                    };
                } else {
                    await refreshToken()

                    return updateTask( taskId, updatedData )
                }
            }
        } catch (error) {
            return {
                error: error.message,
                status: "error"
            };
        }
    }

    async function deleteTask( taskId ) {
        // get backend URL from env
        const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

        // get user access token
        const accessToken = user.accessToken;

        // make fetch request to delete task from backend
        try {
            // make DELETE request with access token in headers
            const response = await fetch(`${backendURL}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // check if response is ok and dispatch action to delete task from state
            // else return error message
            if (response.ok) {
                dispatch({ type: TaskActionTypes.DELETE_TASK, payload: taskId });
                return { status: "success" };
            } else {
                if ( response.status != 401 ) {
                    // convert response to json
                    const respJson = await response.json();

                    return {
                        error: respJson.error.message,
                        status: "error"
                    };
                } else {
                    await refreshToken()

                    return deleteTask( taskId )
                }
            }
        } catch (error) {
            return {
                error: error.message,
                status: "error"
            };
        }
    }

  return (
    <TasksContext.Provider value={{ 
        tasks, 
        getTasks, 
        addTask, 
        updateTask, 
        deleteTask 
    }}>
        { children }
    </TasksContext.Provider>
  )
}

export default TasksProvider
