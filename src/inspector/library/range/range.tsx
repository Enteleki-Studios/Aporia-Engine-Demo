import {
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import { useControlled } from '@core/react'
import { clamp } from '@core/utils'

import './range.scss'

type RangeProps = {
    value?: number
    defaultValue?: number
    min: number
    max: number
    children?: ReactNode
    disabled?: boolean
    onChange?: (nextValue: number) => void
}

type DragState = {
    origin: [number, number]
    lastPosition: [number, number]
}

export const Range = ({
    value,
    defaultValue,
    min,
    max,
    children,
    onChange,
}: RangeProps) => {
    const [valState, setValState] = useControlled<number>({
        controlledValue: value,
        defaultValue,
    })

    const dragRef = useRef<HTMLDivElement>(null)

    const [isDragging, setIsDragging] = useState(false)

    const dragState = useRef<DragState>({
        origin: [0, 0],
        lastPosition: [0, 0],
    })

    const handleInputClick = useCallback((e: ReactMouseEvent) => {
        e.stopPropagation()
    }, [])

    const handleMouseDown = useCallback((e: ReactMouseEvent) => {
        dragState.current.origin = [e.clientX, e.clientY]
        dragState.current.lastPosition = [e.clientX, e.clientY]
        setIsDragging(true)
    }, [])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation()

            if (isDragging) {
                const distance: [number, number] = [
                    e.clientX - dragState.current.lastPosition[0],
                    e.clientY - dragState.current.lastPosition[1],
                ]

                setValState((prev) => {
                    // TODO replace scale with Y distance
                    const scale = 0.5
                    const nextValue = clamp((prev ?? 0) + distance[0] * scale, min, max)

                    onChange?.(nextValue)

                    return nextValue
                })

                dragState.current.lastPosition = [e.clientX, e.clientY]
            }
        },
        [isDragging, setValState, min, max, onChange],
    )

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    const percentFilled = (((valState ?? 0) - min) / (max - min)) * 100

    return (
        <div className="Range" ref={dragRef} onMouseDown={handleMouseDown}>
            <div className="fillBar" style={{ width: `${percentFilled}%` }} />
            <div className="contentWrapper">
                <div className="label">{children}</div>
                <input type="text" value={valState} onClick={handleInputClick} />
            </div>
        </div>
    )
}
