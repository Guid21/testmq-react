import { ComponentProps } from "react"
import './button.css'

type TButtonProps = ComponentProps<'button'>

export const Button = (props: TButtonProps) => {
    return <button {...props} className={`custom-button ${props.className ?? ''}`} />
}