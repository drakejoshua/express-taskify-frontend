import { forwardRef } from 'react'
import { FaCalendarPlus } from 'react-icons/fa6'

const Logo = forwardRef( function({ className, ...props}, ref) {
    return (
        <div className={ className || "logo flex items-center gap-2 mb-5 mx-auto w-fit" } ref={ref} {...props}>
            <FaCalendarPlus className="logo__icon text-2xl text-amber-500" />

            <span className="logo__text text-xl font-medium tracking-wide">
                Taskify
            </span>
        </div>
    )
})

export default Logo
