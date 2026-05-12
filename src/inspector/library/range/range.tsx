import {
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import { useControlled } from '@enteleki-studios/aporia-engine-core/react'
import { clamp } from '@enteleki-studios/aporia-engine-core/utils'

import './range.scss'

type RangeProps = {
    value?: number
    defaultValue?: number
    min: number
    max: number
    step?: number
    children?: ReactNode
    onChange?: (nextValue: number) => void
}

type DragState = {
    origin: [number, number]
    lastPosition: [number, number]
    elementWidth: number
}

// TODO: Add support for text input

export const Range = ({
    value,
    defaultValue,
    min,
    max,
    step = 0.1,
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
        elementWidth: 1,
    })

    const range = max - min
    const precision = step.toString().split('.')[1]?.length ?? 0

    const handleMouseDown = useCallback((e: ReactMouseEvent) => {
        dragState.current.origin = [e.clientX, e.clientY]
        dragState.current.lastPosition = [e.clientX, e.clientY]
        dragState.current.elementWidth = e.currentTarget.clientWidth
        setIsDragging(true)
    }, [])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation()

            if (isDragging) {
                // TODO: The "remainder" of the drag distance should carry over to the next drag event

                const distance = e.clientX - dragState.current.lastPosition[0]

                // Moving the cursor vertically makes dragging more precise
                const scale = Math.max(
                    1,
                    Math.abs(dragState.current.origin[1] - e.clientY) / 10,
                )

                const relativeValueChange = distance / dragState.current.elementWidth
                const valueChange = range * (relativeValueChange / scale)
                const steps = Math.trunc(valueChange / step)
                const changeRespectingStep = steps * step

                if (changeRespectingStep) {
                    dragState.current.lastPosition = [e.clientX, e.clientY]
                }

                setValState((prev) => {
                    const nextValue = Number(
                        clamp((prev ?? 0) + changeRespectingStep, min, max).toFixed(
                            precision,
                        ),
                    )

                    onChange?.(nextValue)

                    return nextValue
                })
            }
        },
        [isDragging, setValState, min, max, step, onChange, range, precision],
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

    const percentFilled = (((valState ?? 0) - min) / range) * 100
    const valString = valState?.toFixed(precision)

    return (
        <div className="Range" ref={dragRef} onMouseDown={handleMouseDown}>
            <div className="fillBar" style={{ width: `${percentFilled}%` }} />
            <div className="contentWrapper">
                <div className="label">{children}</div>
                <div className="value">{valString}</div>
            </div>
        </div>
    )
}
