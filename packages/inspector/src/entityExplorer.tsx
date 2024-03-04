import React, { useState } from 'react'
import { ArrowsClockwise } from '@phosphor-icons/react'

import { EntityId, Entity, Component, useWorld, useForceUpdate } from '@gengine/core'
import { Icon } from 'Icon'

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

    const components = []
    // @ts-expect-error accessing private member
    for (const [name, component] of entity.components) {
        components.push(component)
    }
    return (
        <div className="EntityView" onClick={forceUpdate}>
            <div className="toolbar">
                <div>
                    Entity {entity.name && `(${entity.name})`}
                </div>
                <Icon icon={<ArrowsClockwise />} onClick={forceUpdate} />
            </div>
            <p>id: {entity.id}</p>
            <p>components: {entity.size()}</p>
            {components.map((c) => (
                <ComponentView key={c.type} component={c} />
            ))}
        </div>
    )
}

const EntityRow = ({ entity, onClick, isSelected }: { entity: Entity, onClick: () => void, isSelected?: boolean }) => (
    <div className={`EntityRow ${isSelected && 'isSelected'}`} onClick={onClick}>
        <div>{entity.id.substring(0, 8)}</div>
        <div>{entity.name}</div>
    </div>
)

export const EntityExplorer = () => {
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
            />
        )
    }

    const selectedEntity = selectedEntityId && world.entities.getEntity(selectedEntityId)

    return (
        <div className="EntityExplorer">
            <section className="entities">
                {entities}
            </section>
            <section>
                {selectedEntity ? <EntityView entity={selectedEntity} /> : 'Select entity'}
            </section>
        </div>
    )
}
