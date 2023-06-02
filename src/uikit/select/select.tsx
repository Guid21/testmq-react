import { ComponentProps } from "react"
import './select.css'

type TSelectProps = ComponentProps<'select'>

export const Select = (props: TSelectProps) => {
    return <select {...props} className={`custom-select ${props.className ?? ''}`} />
}