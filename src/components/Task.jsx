import { ContextMenu } from 'radix-ui'
import { FaCircleCheck, FaPencil, FaTrash } from 'react-icons/fa6'

function Task({ task, onEditTask, onDeleteTask, onToggleTaskCompletion }) {
  return (
    <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
            <div className="dashboard--tasklist__task bg-gray-800 p-5 rounded-md flex justify-between items-center
                hover:bg-amber-500 group" tabIndex={0}>
                <div className="dashboard--tasklist__task-detail flex flex-col gap-1">
                    <span className="dashboard--tasklist__task--objective text-2xl 
                        font-medium group-hover:text-black"
                    >
                        { task.text }
                    </span>

                    <span className="dashboard--tasklist__task--date text-sm 
                        uppercase group-hover:text-black"
                    >
                        { new Date(task.date).toLocaleString() }
                    </span>
                </div>

                <FaCircleCheck className='dashboard--tasklist__task--complete-icon
                    text-2xl cursor-pointer group-hover:text-black'
                    onClick={() => onToggleTaskCompletion(task)}/>
            </div>
        </ContextMenu.Trigger>

        <ContextMenu.Portal>
            <ContextMenu.Content className='bg-gray-700 p-3 rounded-md w-fit'>
                <ContextMenu.Item className='text-white px-3 py-2 rounded-sm 
                    hover:bg-white hover:text-gray-800 
                    focus:outline-none flex gap-2 items-center text-sm'
                    onClick={() => onEditTask(task)}>
                    <FaPencil/> <span>Edit Task</span>
                </ContextMenu.Item>
                <ContextMenu.Item className='text-white px-3 py-2 rounded-sm 
                    hover:bg-white hover:text-gray-800 
                    focus:outline-none flex gap-2 items-center text-sm'
                    onClick={() => onDeleteTask(task)}>
                    <FaTrash/> <span>Delete Task</span>
                </ContextMenu.Item>
                <ContextMenu.Item className='text-white px-3 py-2 rounded-sm 
                    hover:bg-white hover:text-gray-800 
                    focus:outline-none flex gap-2 items-center text-sm'
                    onClick={() => onToggleTaskCompletion(task)}>
                    <FaCircleCheck/> <span>Mark as complete</span>
                </ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Portal> 
    </ContextMenu.Root>
  )
}

export default Task
