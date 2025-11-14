import { Icon } from 'Icon'
import React, { useEffect, useState } from 'react'

import { Component, Entity, EntityId, useForceUpdate, useWorld } from '@gengine/core'
import { ArrowClockwise, Eye, EyeSlash } from '@phosphor-icons/react'

const ComponentView = ({ component }: { component: Component }) => {
    return (
        <div className="ComponentView">
            {component.type}
            <div className="values">
                {Object.entries(component).map(([key, val]) => (
                    <div className="row" key={key}>
                        <div>{key}:</div>
                        <div>{JSON.stringify(val)}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const EntityView = ({ entity }: { entity: Entity }) => {
    const forceUpdate = useForceUpdate()
    const world = useWorld()
    const [autoUpdate, setAutoUpdate] = useState(false)

    useEffect(() => {
        const onEndFrame = () => {
            forceUpdate()
        }

        if (autoUpdate) {
            world?.addEventListener('endframe', onEndFrame)
        }

        return () => {
            world?.removeEventListener('endframe', onEndFrame)
        }
    }, [world, forceUpdate, autoUpdate])

    const components = []
    // @ts-expect-error accessing private member
    for (const [name, component] of entity.components) {
        components.push(component)
    }
    return (
        <div className="EntityView" onClick={forceUpdate}>
            <div className="toolbar">
                <div>Entity</div>
                <div className="tools">
                    <Icon
                        icon={<ArrowClockwise />}
                        onClick={forceUpdate}
                        title="Refresh"
                    />
                    <Icon
                        icon={autoUpdate ? <Eye /> : <EyeSlash />}
                        onClick={() => setAutoUpdate(!autoUpdate)}
                        title={autoUpdate ? 'Auto update on' : 'Auto update off'}
                    />
                </div>
            </div>
            <div className="entityData">
                <p>id: {entity.id}</p>
                <p>name: {entity.name}</p>
                <p>components: {entity.size()}</p>
                {/* @ts-expect-error accessing private member */}
                <p>tags: {[...entity.tags].join(', ')}</p>
                {components.map((c) => (
                    <ComponentView key={c.type} component={c} />
                ))}
            </div>
        </div>
    )
}

const EntityRow = ({
    entity,
    onClick,
    isSelected,
}: {
    entity: Entity
    onClick: () => void
    isSelected?: boolean
}) => (
    <div className={`EntityRow ${isSelected && 'isSelected'}`} onClick={onClick}>
        <div>{entity.id.substring(0, 8)}</div>
        <div>{entity.name}</div>
    </div>
)

export const EntityExplorer = () => {
    const forceUpdate = useForceUpdate()
    const world = useWorld()

    const [selectedEntityId, setSelectedEntityId] = useState<EntityId | null>(null)

    if (!world) {
        return 'No world'
    }

    const entities = []
    // @ts-expect-error accessing private member
    for (const [id, entity] of world.entities.entitiesById) {
        entities.push(
            <EntityRow
                entity={entity}
                key={id}
                onClick={() => setSelectedEntityId(id)}
                isSelected={selectedEntityId === id}
            />,
        )
    }

    const selectedEntity = selectedEntityId && world.entities.getEntity(selectedEntityId)

    return (
        <div className="EntityExplorer">
            <section className="entities">
                <div className="toolbar">
                    <div>Entities ({entities.length})</div>
                    <Icon
                        icon={<ArrowClockwise />}
                        onClick={forceUpdate}
                        title="Refresh"
                    />
                </div>
                <div className="entitiesTable">{entities}</div>
            </section>
            <section>
                {selectedEntity ? (
                    <EntityView entity={selectedEntity} />
                ) : (
                    'Select entity'
                )}
            </section>
        </div>
    )
}
