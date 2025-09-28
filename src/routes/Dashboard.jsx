import Logo from '../components/Logo.jsx'
import { FaArrowRotateRight, 
    FaChevronDown, 
    FaCircleArrowDown, 
    FaCircleCheck, 
    FaCirclePlus, 
    FaClipboardList, 
    FaMagnifyingGlass, 
    FaPencil, 
    FaPlus, 
    FaRegEye, 
    FaRegEyeSlash, 
    FaSpinner, 
    FaTrash, 
    FaTriangleExclamation } from 'react-icons/fa6'
import { ContextMenu, 
    DropdownMenu, 
    Select, 
    unstable_PasswordToggleField as PasswordToggleField,
    Form
 } from 'radix-ui'
import {
    DialogComponent, 
    useDialogProvider
 } from '../providers/DialogProvider.jsx'
import { useState } from 'react'
import Task from '../components/Task.jsx'
import { useEffect } from 'react'
import { useUserProvider } from '../providers/UserProvider.jsx'
import { useTasksProvider } from '../providers/TasksProvider.jsx'
import { useToastProvider } from '../providers/ToastProvider.jsx'
import useDebounce from '../hooks/useDebounce.js'


function Dashboard() {
    // Dialog Provider - for showing dialogs from anywhere
    const { showDialog, hideDialog } = useDialogProvider()

    const { showToast } = useToastProvider()

    // UI state variables

    // update email dialog state
    const [ newEmail, setNewEmail ] = useState("")
    const [ isUpdateEmailDialogOpen, setIsUpdateEmailDialogOpen ] = useState(false)
    
    // update password dialog state
    const [ newPassword, setNewPassword ] = useState("")
    const [ isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen ] = useState(false)
    
    // update photo dialog state
    const [ newPhoto, setNewPhoto ] = useState("")
    const [ isUpdatePhotoDialogOpen, setIsUpdatePhotoDialogOpen ] = useState(false)
    const [ isUpdating, setIsUpdating ] = useState(false)
    
    // create task dialog state
    const [ isCreateTaskDialogOpen, setIsCreateTaskDialogOpen ] = useState(false)
    const currentDate = new Date()
    const [ newTaskObjective, setNewTaskObjective ] = useState("")
    const [ newTaskDate, setNewTaskDate ] = useState( currentDate )
    
    // edit task dialog state
    const [ isEditTaskDialogOpen, setIsEditTaskDialogOpen ] = useState(false)
    const [ taskToEdit, setTaskToEdit ] = useState( { text: "", date: new Date() } )

    // task list state variables
    const [ isTasksLoading, setIsTasksLoading ] = useState(false)
    const [ tasksLoadingError, setTasksLoadingError ] = useState(null)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ sort, setSort ] = useState("text")
    const [ order, setOrder ] = useState("ASC")
    const [ limit, setLimit ] = useState(5)
    const [ totalTasks, setTotalTasks ] = useState( )
    const debounceSearchTerm = useDebounce( searchTerm, 300 )

    // user auth context provider
    const { user, setUser, refreshToken } = useUserProvider()

    // tasks context provider
    const { tasks, getTasks, addTask, updateTask, deleteTask } = useTasksProvider()


    // fetchTasks() - fetches tasks from the server
    // based on the current filter and search criteria
    async function fetchTasks( limit, sort, order, searchTerm ) {
        if ( user !== "loading" && user !== "logout" ) {
            try {
                // reset task loading state
                setIsTasksLoading( true )
                setTasksLoadingError( null )

                // fetch tasks from server
                const { status, error, totalTasks } = await getTasks({ limit, sort, order, searchTerm })

                // check if fetch from server was successful 
                // and update state accordingly
                if ( status === "error" ) {
                    setTasksLoadingError( error )
                } else {
                    setTotalTasks( totalTasks )
                }
            } catch( error ) {
                setTasksLoadingError( error )
            } finally {
                setIsTasksLoading( false )
            }
        }
    }

    // fetch tasks on mount and whenever the filter or search criteria changes
    useEffect( function() {
        fetchTasks( limit, sort, order, debounceSearchTerm )
    }, [ limit, order, sort, debounceSearchTerm ])

    
    // dialog UI functions

    // handleTaskDelete() - handles the deletion of a task
    // by showing a confirmation dialog and calling the deleteTask function
    // from the tasks context provider
    function handleTaskDelete( task ) {
        const dialogId = showDialog(
            "Delete Task", 
            "Are you sure you want to delete this task?",
            <>
                <div className="dashboard--delete-dialog__button-group
                    flex gap-2 mt-6">
                    <button className="dashboard--delete-dialog__button-group--cancel-btn
                        bg-gray-500 text-white py-2 px-8 flex-grow rounded-md" 
                        onClick={() => { hideDialog( dialogId )}}>
                        <span className='dashboard--delete-dialog__button-group--btn-text
                            font-medium'>
                            Cancel
                        </span>
                    </button>
                    
                    <button className="dashboard--delete-dialog__button-group--delete-btn
                        bg-red-600 text-white py-2 px-8 flex-grow rounded-md flex 
                        items-center gap-2 justify-center hover:bg-amber-600" 
                        onClick={() => innerDeleteTask( task )}>
                        <FaTrash className='dashboard--delete-dialog__button-group--btn-icon'/>
                        <span className='dashboard--delete-dialog__button-group--btn-text
                            font-medium'>
                            Delete
                        </span>
                    </button>
                </div>
            </>
        )

        async function innerDeleteTask( task ) {
            try {
                const { status, error } = await deleteTask( task._id )

                if ( status == 'success' ) {
                    showToast("Task deleted successfully", "success")
                } else {
                    showToast(`Error deleting task: ${ error }`, "error")
                }
            } catch( err ) {
                showToast(`Error deleting task: ${ err.message }`, "error")
            } finally {
                hideDialog( dialogId )
            }
        }
    }
    
    // handleTaskMarkAsComplete() - handles marking a task as complete
    // by showing a confirmation dialog and calling the deleteTask function
    // from the tasks context provider
    function handleTaskMarkAsComplete( task ) {
        const dialogId = showDialog(
            "Mark As Complete", 
            "Are you sure you completed this task?",
            <>
                <div className="dashboard--delete-dialog__button-group
                    flex gap-2 mt-6">
                    <button className="dashboard--delete-dialog__button-group--cancel-btn
                        bg-gray-500 text-white py-2 px-8 flex-grow rounded-md" 
                        onClick={() => { hideDialog( dialogId )}}>
                        <span className='dashboard--delete-dialog__button-group--btn-text
                            font-medium'>
                            Cancel
                        </span>
                    </button>
                    
                    <button className="dashboard--delete-dialog__button-group--delete-btn
                        text-white py-2 px-8 flex-grow rounded-md flex 
                        items-center gap-2 justify-center bg-amber-600" 
                        onClick={() => innerDeleteTask( task )}>
                        <FaCircleCheck className='dashboard--delete-dialog__button-group--btn-icon
                            text-xl'/>
                        <span className='dashboard--delete-dialog__button-group--btn-text
                            font-medium'>
                            Mark Done
                        </span>
                    </button>
                </div>
            </>
        )

        async function innerDeleteTask( task ) {
            try {
                const { status, error } = await deleteTask( task._id )

                if ( status == 'success' ) {
                    showToast("Task completed successfully", "success")
                } else {
                    showToast(`Error deleting task: ${ error }`, "error")
                }
            } catch( err ) {
                showToast(`Error deleting task: ${ err.message }`, "error")
            } finally {
                hideDialog( dialogId )
            }
        }
    }

    // handleTaskEdit() - opens the edit task dialog and sets the task to edit
    function handleTaskEdit( task ) {
        // set task-to-edit data before opening the dialog 
        // in order to avoid rendering issues with dialog fields
        setTaskToEdit({...task, date: new Date( task.date )})
        setIsEditTaskDialogOpen( true )
    }

    // submitTaskEdit() - handles the submission of the edit task form
    // and closes the edit task dialog
    async function submitTaskEdit(e) {
        // prevent default form submission behaviour
        e.preventDefault()

        try {
            // make request to update task on backend
            const { status, error } = await updateTask( taskToEdit._id, { 
                text: taskToEdit.text,
                date: taskToEdit.date
            } )

            // if any errors during request, show error toast with error message
            if ( status == "error" ) {
                return showToast(`Error editing task: ${ error }`, "error")
            }

            // if no errors, show success toast with confirmation message
            showToast("Task updated successfully", "success")
        } catch( err ) {
            // if any errors during execution, show error toast with error message
            showToast(`Error editing task: ${ err.message }`, "error")
        } finally {
            // close task edit dialog irregardless of error or success status
            setIsEditTaskDialogOpen(false)
        }
    }

    // handleTaskCreate() - handles the creation of new tasks 
    // from the create task dialog and closes the dialog
    async function handleTaskCreate(e) {
        // prevent default form submission behaviour
        e.preventDefault()

        try {
            // make request to create new task on backend
            const { status, error } = await addTask( newTaskObjective, newTaskDate )

            // if any errors encountered, show error toast with error message
            if ( status == 'error' ) {
                return showToast(`Error creating task: ${ error }`, "error")
            }

            // if no errors, show success toast
            showToast("Task created successfully", "success")
        } catch( err ) {
            // show error toast with error during execution
            showToast(`Error creating task: ${ err.message }`, "error")
        } finally {
            // close the task creation dialog irregardless of any errors or 
            // not
            setIsCreateTaskDialogOpen( false )
        }
    }

    // loadMoreTasks() - increases the task fetch limit to load more tasks
    // when the user clicks the "load more" button
    function loadMoreTasks() {
        setLimit( limit + 5 )
    }

    // handleLogout() - handles user logout by clearing user data
    // from user context provider state and logging out on backend
    async function handleLogout() {
        // import backend URL from env
        const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

        try {
            // make request to logout endpoint
            const response = await fetch( `${ backendURL }/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken: `${user.refreshToken}`
                })
            });

            // convert response to json
            const data = await response.json();

            // if any errors during logout, show error toast with error message
            // else show success toast and reset user provider state
            if (data.status === "error") {
                showToast(`Error logging out: ${ data.error.message }`, "error")
            } else {
                showToast("Logged out successfully", "success")
                
                // reset user provider state
                setUser("logout");
            }
        } catch( err ) {
            // show error toast with error during execution
            showToast(`Error logging out: ${ err.message }`, "error")
        }

    }

    // handleUpdateEmail() - handles updating the user's email
    // from the update email dialog and closes the dialog
    async function handleUpdateEmail() {
        // create formdata to send to backend
        const formData = new FormData()

        formData.append( "email", newEmail )

        try {
            // import backend URL from env
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

            // make request to update user endpoint
            const response = await fetch( `${ backendURL }/auth/update-user`, {
                method: "PUT",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${user.accessToken}`
                }
            });

            // show updating state on update email button
            setIsUpdating( true )

            // check if response is ok, convert to json and update user fields
            // else check for 401 error, refresh token and retry, if not show error toast
            if ( response.ok ) {
                // convert response to json
                const respJson = await response.json()

                // update user context provider state with new email
                setUser( { ...user, ...respJson.data } )
                
                // show success toast
                showToast("Email updated successfully", "success")
            
            } else {
                if ( response.status === 401 ) {
                    // refresh token due to 401 error
                    await refreshToken()

                    // retry updating email after refreshing token
                    return handleUpdateEmail()
                } else {
                    // convert response to json
                    const respJson = await response.json()

                    // show error toast with error message from response
                    return showToast(`Error updating email: ${ respJson.error.message }`, "error")
                }
            }
        } catch( err ) {
            // show error toast with error during execution
            showToast(`Error updating email: ${ err.message }`, "error")
        } finally {
            // close the update email dialog irregardless of any errors or
            // not
            setIsUpdateEmailDialogOpen( false )
            setNewEmail( "" )
            setIsUpdating( false )
        }
    }

    // handleUpdatePassword() - handles updating the user's password
    // from the update password dialog and closes the dialog
    async function handleUpdatePassword() {
        // create formdata to send to backend
        const formData = new FormData()

        formData.append( "password", newPassword )

        try {
            // import backend URL from env
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

            // make request to update user endpoint
            const response = await fetch( `${ backendURL }/auth/update-user`, {
                method: "PUT",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${user.accessToken}`
                }
            });

            // show updating state on update password button
            setIsUpdating( true )

            // check if response is ok, convert to json and update user fields
            if ( response.ok ) {
                // convert response to json
                const respJson = await response.json()

                // update user context provider state with new password
                setUser( { ...user, ...respJson.data } )

                // show success toast
                showToast("Password updated successfully", "success")

            } else {
                if ( response.status === 401 ) {
                    // refresh token due to 401 error
                    await refreshToken()

                    // retry updating password after refreshing token
                    return handleUpdatePassword()

                } else {
                    // convert response to json
                    const respJson = await response.json()

                    // show error toast with error message from response
                    return showToast(`Error updating password: ${ respJson.error.message }`, "error")
                }
            }
        } catch( err ) {
            // show error toast with error during execution
            showToast(`Error updating password: ${ err.message }`, "error")
        } finally {
            // close the update password dialog irregardless of any errors or
            // not
            setIsUpdatePasswordDialogOpen( false )
            setIsUpdating( false )
            setNewPassword( "" )
        }
    }

    // handleUpdatePhoto() - handles updating the user's profile photo
    // from the update photo dialog and closes the dialog
    async function handleUpdatePhoto() {
        // create formdata to send to backend
        const formData = new FormData()

        formData.append( "photo", newPhoto )

        try {
            // import backend URL from env
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

            // make request to update user endpoint
            const response = await fetch( `${ backendURL }/auth/update-user`, {
                method: "PUT",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${user.accessToken}`
                }
            });

            // show updating state on update photo button
            setIsUpdating( true )

            // check if response is ok, convert to json and update user fields
            if ( response.ok ) {
                // convert response to json
                const respJson = await response.json()

                // update user context provider state with new profile URL
                setUser( { ...user, ...respJson.data } )

                // show success toast
                showToast("Profile photo updated successfully", "success")

            } else {
                if ( response.status === 401 ) {
                    // refresh token due to 401 error
                    await refreshToken()

                    // retry updating photo after refreshing token
                    return handleUpdatePhoto()
                } else {
                    // convert response to json
                    const respJson = await response.json()

                    // show error toast with error message from response
                    return showToast(`Error updating photo: ${ respJson.error.message }`, "error")
                }
            }
        } catch( err ) {
            // show error toast with error during execution
            showToast(`Error updating photo: ${ err.message }`, "error")
        } finally {
            // close the update photo dialog irregardless of any errors or
            // not
            setIsUpdatePhotoDialogOpen( false )
            setIsUpdating( false )
            setNewPhoto( "" )
        }
    }

  return (
    <div className="background h-screen w-full bg-black text-white overflow-auto">
        <div className="dashboard max-w-lg min-w-[250px] h-full px-6 py-8 md:py-6 mx-auto">
            {/* topbar */}
            <div className="dashboard--topbar flex justify-between items-center mb-3">
                <Logo className="flex items-center gap-2 text-2xl"/>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="dashboard--topbar__menu-button" asChild>
                        <img src={ user.profileURL } alt="" className="dashboard--topbar__avatar w-10 h-10 rounded-full"/>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="dashboard--topbar__menu-content
                            bg-gray-800 rounded-md shadow-md py-3 px-3 w-48 " 
                            sideOffset={8} side="bottom" align='end'>
                                <DropdownMenu.Item className="dashboard--topbar__menu-item text-white px-3 py-2 rounded-sm
                                    hover:bg-white hover:text-gray-800 focus:outline-none"
                                    onClick={ () => setIsUpdateEmailDialogOpen( true ) }>
                                    Update Email
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="dashboard--topbar__menu-item text-white px-3 py-2 
                                    rounded-sm hover:bg-white hover:text-gray-800 focus:outline-none"
                                    onClick={ () => setIsUpdatePasswordDialogOpen( true ) }>
                                    Update Password
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="dashboard--topbar__menu-item text-white px-3 py-2 
                                    rounded-sm hover:bg-white hover:text-gray-800 focus:outline-none"
                                    onClick={ () => setIsUpdatePhotoDialogOpen( true ) }>
                                    Update Photo
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="dashboard--topbar__menu-item text-white px-3 py-2 
                                    rounded-sm hover:bg-white hover:text-gray-800 focus:outline-none"
                                    onClick={ handleLogout }>
                                    Logout
                                </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            {/* filter bar */}
            <div className="dashboard--filterbar flex items-center gap-2">
                <div className="dashboard--filterbar__searchbar flex-grow flex bg-gray-700 items-center py-1.5 px-2.5 rounded-md
                    gap-2">
                        <FaMagnifyingGlass className='dashboard--filterbar__searchbar--icon'/>

                        <input type="text" 
                            className="dashboard--filterbar__searchbar--input flex-grow placeholder:text-gray-300 focus:outline-0" 
                            placeholder='Search for a task'
                            value={ searchTerm } onChange={ (e) => setSearchTerm( e.target.value ) }/>
                </div>

                <Select.Root value={`${sort}-${ order.toLowerCase() }`} 
                    onValueChange={ (value) => {
                        const [newSort, newOrder] = value.split('-')
                        setSort( newSort )
                        setOrder( newOrder.toUpperCase() )
                    }
                }>
                    <Select.Trigger className="dashboard--filterbar__select--trigger flex items-center bg-gray-700 p-2 text-sm rounded-sm
                        gap-2">
                        <Select.Value placeholder="Sort By" className='dashboard--filterbar__select-trigger--value'/>
                        <Select.Icon className='dashboard--filterbar__select-trigger--icon'>
                            <FaChevronDown/>
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content className="dashboard--filterbar__select--content
                            bg-gray-700 p-3 rounded-sm">
                            <Select.Viewport className='dashboard--filterbar__select--viewport'>
                                <Select.Item value='text-asc' className='dashboard--filterbar__select--item 
                                    text-white px-3 py-2 rounded-sm hover:bg-white hover:text-gray-800 focus:outline-none'>
                                    <Select.ItemText>
                                        Name (A-Z)
                                    </Select.ItemText>
                                </Select.Item>
                                <Select.Item value='text-desc' className='dashboard--filterbar__select--item
                                    text-white px-3 py-2 rounded-sm hover:bg-white hover:text-gray-800 focus:outline-none'>
                                    <Select.ItemText>
                                        Name (Z-A)
                                    </Select.ItemText>
                                </Select.Item>

                                <Select.Separator className='dashboard--filterbar__select--separator'/>

                                <Select.Item value='date-asc' className='dashboard--filterbar__select--item
                                    text-white px-3 py-2 rounded-sm hover:bg-white hover:text-gray-800 focus:outline-none'>
                                    <Select.ItemText>
                                        Date (New-Old)
                                    </Select.ItemText>
                                </Select.Item>
                                <Select.Item value='date-desc' className='dashboard--filterbar__select--item
                                    text-white px-3 py-2 rounded-sm hover:bg-white hover:text-gray-800 focus:outline-none'>
                                    <Select.ItemText>
                                        Date (Old-New)
                                    </Select.ItemText>
                                </Select.Item>
                            </Select.Viewport>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            </div>

            {/* task list */}
            { ( !isTasksLoading && !tasksLoadingError && tasks.length != 0  ) && 
                <div className="dashboard--tasklist mt-4 flex flex-col gap-3 pb-10">
                { 
                    tasks.map( function( task ) {
                        return <Task 
                            key={ task._id }
                            task={ task }
                            onEditTask={handleTaskEdit}
                            onDeleteTask={handleTaskDelete}
                            onToggleTaskCompletion={handleTaskMarkAsComplete}
                        />
                    })
                }

                { totalTasks > tasks.length && <button className="dashboard--tasklist__load-more-button w-full py-3 px-3
                    font-medium flex justify-center
                    text-amber-500 capitalize gap-2 rounded-md
                    items-center"
                    onClick={ () => loadMoreTasks() }
                >
                    load more
                </button>}
            </div>}

            {/* task-list loading state UI */}
            { isTasksLoading && <div className="dashboard--tasklist__loading flex gap-2 justify-center items-center mt-8">
                <FaSpinner className='animate-spin text-2xl' />
                <span className='text-lg capitalize'>Loading tasks...</span>
            </div>}
            
            {/* task-list empty UI */}
            { ( !isTasksLoading && !tasksLoadingError && tasks.length == 0 ) && <div className="dashboard--tasklist__empty flex flex-col gap-4 justify-center items-center mt-8">
                <FaClipboardList className='text-4xl text-gray-400' />
                <span className='text-lg capitalize'>You haven't created any tasks yet</span>
            </div>}

            {/* task-list loading error state UI */}
            { tasksLoadingError && <div className="dashboard--tasklist__loading-error mt-8 flex flex-col items-center">
                <div className="dashboard--tasklist__loading-error--info flex gap-4 justify-center items-center">
                    <FaTriangleExclamation className='text-2xl' />
                    <span className='text-lg capitalize'>Error Loading Tasks</span>
                </div>

                <button className="dashboard--tasklist__loading-error--retry-btn flex gap-2 items-center
                    bg-amber-800 py-1.5 px-3 rounded-md mt-5"
                    onClick={ () => fetchTasks( limit, sort, order, searchTerm ) }>
                    <FaArrowRotateRight className='dashboard--tasklist__loading-error--retry-icon '/>

                    <span className='dashboard--tasklist__loading-error--retry-icon capitalize'>
                        retry
                    </span>
                </button>
            </div>}

            {/* add task button */}
            <button className="dashboard--add-button h-16 w-16 rounded-full flex justify-center 
                items-center bg-amber-500 hover:bg-amber-600 fixed bottom-8 left-3/5"
                onClick={ () => setIsCreateTaskDialogOpen( true )}>
                <FaPlus className='dashboard--add-button-icon text-2xl'/>
            </button>
        </div>

        {/* update email dialog */}
        <DialogComponent 
            title={<span>Update Email</span>} 
            description={"Enter your new email below"}
            open={isUpdateEmailDialogOpen} 
            handleOpenChange={() => setIsUpdateEmailDialogOpen(false)}
            content={
                <>
                    <div className="dashboard--update-email-dialog__input-group">
                        <input type="email" 
                            className="dashboard--update-email-dialog__input-group--input
                                w-full bg-gray-700 text-white py-2 px-3 rounded-md focus:outline-amber-500"
                            placeholder='New Email' value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                    </div>
                    <div className="dashboard--update-email-dialog__button-group
                        flex gap-2 mt-6">
                        <button className="dashboard--update-email-dialog__button-group--cancel-btn
                            bg-gray-500 text-white py-2 px-8 flex-grow rounded-md"
                            onClick={() => { setIsUpdateEmailDialogOpen( false )}}>
                            <span className='dashboard--update-email-dialog__button-group--btn-text
                                font-medium'>
                                Cancel
                            </span>
                        </button>
                        <button className="dashboard--update-email-dialog__button-group--update-btn
                            bg-amber-600 text-white py-2 px-8 flex-grow rounded-md flex 
                            items-center gap-2 justify-center hover:bg-amber-700 disabled:bg-amber-900
                            disabled:cursor-not-allowed"
                            onClick={handleUpdateEmail} disabled={ isUpdating || newEmail.trim() === ""}>
                            <FaCircleArrowDown className='dashboard--update-email-dialog__button-group--btn-icon'/>
                            <span className='dashboard--update-email-dialog__button-group--btn-text
                                font-medium'>
                                {isUpdating ? "Updating..." : "Update"}
                            </span>
                        </button>
                    </div>
                </>
            }
        />

        {/* update password dialog */}
        <DialogComponent 
            title={<span>Update Password</span>} 
            description={"Enter your new password below"}
            open={isUpdatePasswordDialogOpen} 
            handleOpenChange={() => setIsUpdatePasswordDialogOpen(false)}
            content={
                <>
                    <div className="dashboard--update-password-dialog__input-group">
                        <PasswordToggleField.Root>
                            <div className='dashboard--update-password-dialog__password-field
                                mt-4 bg-gray-900 py-2 px-3 rounded-md focus:outline-amber-500 flex items-center
                                gap-2 w-full
                            '>
                                <PasswordToggleField.Input className='dashboard--update-password-dialog__password-field--input
                                    flex-grow focus:outline-0 text-white'
                                    placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                                <PasswordToggleField.Toggle className='dashboard--update-password-dialog__password-field--toggle
                                    cursor-pointer text-gray-400'>
                                    <PasswordToggleField.Icon
                                        visible={<FaRegEye/>} hidden={<FaRegEyeSlash/>}/>
                                </PasswordToggleField.Toggle>
                            </div>
                        </PasswordToggleField.Root>
                    </div>
                    <div className="dashboard--update-password-dialog__button-group
                        flex gap-2 mt-6">
                        <button className="dashboard--update-password-dialog__button-group--cancel-btn
                            bg-gray-500 text-white py-2 px-8 flex-grow rounded-md"
                            onClick={() => { setIsUpdatePasswordDialogOpen( false )}}>
                            <span className='dashboard--update-password-dialog__button-group--btn-text
                                font-medium'>
                                Cancel
                            </span>
                        </button>
                        <button className="dashboard--update-password-dialog__button-group--update-btn
                            bg-amber-600 text-white py-2 px-8 flex-grow rounded-md flex 
                            items-center gap-2 justify-center hover:bg-amber-700 disabled:bg-amber-900
                            disabled:cursor-not-allowed"
                            onClick={handleUpdatePassword} disabled={ isUpdating || newPassword.trim() === "" }>
                            <FaCircleArrowDown className='dashboard--update-password-dialog__button-group--btn-icon'/>
                            <span className='dashboard--update-password-dialog__button-group--btn-text
                                font-medium'>
                                { isUpdating ? "Updating..." : "Update" }
                            </span>
                        </button>
                    </div>
                </>
            }
        />

        {/* update photo ( with preview ) dialog */}
        <DialogComponent 
            title={<span>Update Photo</span>} 
            description={"Choose a new profile photo"}
            open={isUpdatePhotoDialogOpen} 
            handleOpenChange={() => setIsUpdatePhotoDialogOpen(false)}
            content={
                <>
                    <div className="dashboard--update-photo-dialog__input-group">
                        <input type="file" accept="image/*" onChange={(e) => setNewPhoto(e.target.files[0])} 
                            className='bg-gray-700 rounded-md p-2 text-white w-full'/>
                    </div>
                    {newPhoto && (
                        <div className="dashboard--update-photo-dialog__preview
                            mt-4">
                            <img src={URL.createObjectURL(newPhoto)} alt="Preview" className='
                            w-full h-full object-cover rounded-md' />
                        </div>
                    )}
                    <div className="dashboard--update-photo-dialog__button-group flex gap-2 mt-6">
                        <button className="dashboard--update-photo-dialog__button-group--cancel-btn
                            bg-gray-500 text-white py-2 px-8 flex-grow rounded-md"
                            onClick={() => { setIsUpdatePhotoDialogOpen( false )}}>
                            <span className='dashboard--update-photo-dialog__button-group--btn-text
                                font-medium'>
                                Cancel
                            </span>
                        </button>
                        <button className="dashboard--update-photo-dialog__button-group--update-btn
                            bg-amber-600 text-white py-2 px-8 flex-grow rounded-md flex 
                            items-center gap-2 justify-center hover:bg-amber-700 disabled:bg-amber-900
                            disabled:cursor-not-allowed"
                            onClick={handleUpdatePhoto} disabled={isUpdating || !newPhoto}>
                            <FaCircleArrowDown className='dashboard--update-photo-dialog__button-group--btn-icon'/>
                            <span className='dashboard--update-photo-dialog__button-group--btn-text
                                font-medium'>
                                { isUpdating ? "Updating..." : "Update" }
                            </span>
                        </button>
                    </div>
                </>
            }
        />

        {/* create task dialog */}
        <DialogComponent
            title={"Create New Task"}
            description={"create a new task by filling the details below"}
            open={isCreateTaskDialogOpen}
            handleOpenChange={ () => setIsCreateTaskDialogOpen(false) }
            content={
                <>
                    <Form.Root className='dashboard--create-task-dialog__form flex flex-col
                        gap-2'
                        onSubmit={handleTaskCreate}>
                        {/* objective input */}
                        <Form.Field className='dashboard--create-task-dialog__form--objective-field
                            flex flex-col gap-2'>
                            <Form.Label className='dashboard--create-task-dialog__form--objective-label
                                text-white font-medium'>
                                Objective:
                            </Form.Label>

                            <Form.Control asChild>
                                <input type="text" 
                                    className="dashboard--create-task-dialog__form--objective-input
                                        w-full bg-gray-700 text-white py-2 px-3 rounded-md focus:outline-amber-500"
                                    placeholder='Task Objective' required
                                    value={ newTaskObjective } 
                                    onChange={ (e) => setNewTaskObjective(e.target.value) }/>
                            </Form.Control>

                            <Form.Message match="valueMissing" className='dashboard--create-task-dialog__form--objective-error
                                text-amber-500 text-sm mt-1'>
                                Please enter the task objective
                            </Form.Message>
                        </Form.Field>

                        {/* date/deadline input */}
                        <Form.Field className='dashboard--create-task-dialog__form--date-field
                            flex flex-col gap-2'>
                            <Form.Label className='dashboard--create-task-dialog__form--objective-label
                                text-white font-medium'>
                                Deadline:
                            </Form.Label>

                            <Form.Control asChild>
                                <input type="datetime-local" 
                                    className="dashboard--create-task-dialog__input-group--input
                                        w-full bg-gray-700 text-white py-2 px-3 rounded-md 
                                        focus:outline-amber-500"
                                    value={ newTaskDate.toISOString().slice( 0, 16 ) }
                                    onChange={ (e) => setNewTaskDate( new Date( e.target.value + "Z" ) ) }
                                    min={currentDate.toISOString().slice(0, 16)}
                                    />
                            </Form.Control>

                            <Form.Message match="valueMissing" className='text-amber-500 text-sm mt-1'>
                                Please enter the task deadline
                            </Form.Message>

                            <Form.Message match="rangeUnderflow" className='text-amber-500 text-sm mt-1'>
                                Deadline cannot be in the past
                            </Form.Message>
                        </Form.Field>

                        <div className="dashboard--create-task-dialog__button-group mt-4 flex gap-2">
                            <button className="dashboard--create-task-dialog__button-group--cancel-btn
                                bg-gray-500 text-white py-2 px-4 rounded-md flex-grow"
                                type='button'
                                onClick={() => { setIsCreateTaskDialogOpen( false )}}>
                                Cancel
                            </button>

                            <Form.Submit className="dashboard--create-task-dialog__button-group--create-btn
                                bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 flex gap-2
                                justify-center items-center flex-grow">
                                <FaCirclePlus className='dashboard--create-task-dialog__button-group--create-icon
                                    text-lg'/>
                                
                                Create Task
                            </Form.Submit>
                        </div>
                    </Form.Root>
                </>
            }
        />
        
        {/* edit task dialog */}
        <DialogComponent
            title={"Edit Task"}
            description={"edit the task by filling the details below"}
            open={isEditTaskDialogOpen}
            handleOpenChange={ () => setIsEditTaskDialogOpen(false) }
            content={
                <>
                    <div className="dashboard--edit-task-dialog__input-group flex flex-col gap-4">
                        <Form.Root className='dashboard--edit-task-dialog__form flex flex-col
                            gap-2'
                            onSubmit={submitTaskEdit}>
                            {/* objective input */}
                            <Form.Field className='dashboard--edit-task-dialog__form--objective-field
                                flex flex-col gap-2'>
                                <Form.Label className='dashboard--edit-task-dialog__form--objective-label
                                    text-white font-medium'>
                                    Objective:
                                </Form.Label>

                                <Form.Control asChild>
                                    <input type="text" 
                                        className="dashboard--edit-task-dialog__form--objective-input
                                            w-full bg-gray-700 text-white py-2 px-3 rounded-md focus:outline-amber-500"
                                        placeholder='Task Objective'
                                        value={ taskToEdit.text }
                                        onChange={ (e) => setTaskToEdit({ 
                                            ...taskToEdit, text: e.target.value }) }
                                    />
                                </Form.Control>

                                <Form.Message match="valueMissing" className='dashboard--edit-task-dialog__form--objective-error
                                    text-amber-500 text-sm mt-1'>
                                    Please enter the task objective
                                </Form.Message>
                            </Form.Field>

                            {/* date/deadline input */}
                            <Form.Field className='dashboard--edit-task-dialog__form--date-field
                                flex flex-col gap-2'>
                                <Form.Label className='dashboard--edit-task-dialog__form--objective-label
                                    text-white font-medium'>
                                    Deadline:
                                </Form.Label>

                                <Form.Control asChild>
                                    <input type="datetime-local" 
                                        className="dashboard--edit-task-dialog__input-group--input
                                            w-full bg-gray-700 text-white py-2 px-3 rounded-md 
                                            focus:outline-amber-500"
                                        value={ 
                                            taskToEdit.date.toISOString().slice(0, 16)
                                        }
                                        onChange={ (e) => setTaskToEdit({ ...taskToEdit, date: new Date( e.target.value + "Z" ) })}
                                    />
                                </Form.Control>

                                <Form.Message match="valueMissing" className='text-amber-500 text-sm mt-1'>
                                    Please enter the task deadline
                                </Form.Message>
                            </Form.Field>

                            <div className="dashboard--edit-task-dialog__button-group mt-4 flex gap-2">
                                <button className="dashboard--edit-task-dialog__button-group--cancel-btn
                                    bg-gray-500 text-white py-2 px-4 rounded-md flex-grow"
                                    type='button'
                                    onClick={() => { setIsCreateTaskDialogOpen( false )}}>
                                    Cancel
                                </button>

                                <Form.Submit type="submit" className="dashboard--edit-task-dialog__button-group--edit-btn
                                    bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 flex gap-2
                                    justify-center items-center flex-grow">
                                    <FaPencil className='dashboard--edit-task-dialog__button-group--edit-icon
                                        text-lg'/>
                                    
                                    Edit Task
                                </Form.Submit>
                            </div>
                        </Form.Root>
                    </div>
                </>
            }
        />

    </div>
  )
}

export default Dashboard
