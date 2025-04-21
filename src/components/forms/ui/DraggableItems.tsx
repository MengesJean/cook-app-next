"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

// Importez le hook depuis le bon chemin (relatif)
import { useHasMounted } from "../../../hooks/useHasMounted";

export type DraggableItem = Record<string, unknown> & {
  id: number | string;
};

type DragHandleProps = {
  listeners: SyntheticListenerMap | undefined;
  isDragging: boolean;
};

type SortableItemProps = {
  id: number | string;
  children: ReactNode;
  renderDragHandle?: (props: DragHandleProps) => ReactNode;
};

const SortableItem = ({
  id,
  children,
  renderDragHandle,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {renderDragHandle ? (
        <div className="flex items-center">
          {renderDragHandle({ listeners, isDragging })}
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <div {...listeners}>{children}</div>
      )}
    </div>
  );
};

type DraggableItemsProps<T extends DraggableItem> = {
  items: T[];
  onItemsChange: (items: T[]) => void;
  keyExtractor?: (item: T) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  renderDragHandle?: (props: DragHandleProps) => ReactNode;
};

export function DraggableItems<T extends DraggableItem>({
  items,
  onItemsChange,
  keyExtractor = (item) => item.id,
  renderItem,
  renderDragHandle,
}: DraggableItemsProps<T>) {
  // Track mounting state to avoid hydration errors
  const hasMounted = useHasMounted();

  // Configuration des capteurs pour le drag and drop - toujours définir avant les conditions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Augmenter la distance requise avant de considérer qu'un déplacement commence
      activationConstraint: {
        distance: 8, // 8px de mouvement minimum pour commencer le drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Gérer la fin d'un glisser-déposer
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(
        (item) => keyExtractor(item) === active.id
      );
      const newIndex = items.findIndex(
        (item) => keyExtractor(item) === over.id
      );

      const newItems = arrayMove(items, oldIndex, newIndex);
      onItemsChange(newItems);
    }
  };

  // Lors du rendu côté serveur ou du premier rendu côté client
  if (!hasMounted) {
    return (
      <div>
        {items.map((item, index) => (
          <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  // Rendu côté client avec drag and drop
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => keyExtractor(item))}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <SortableItem
            key={keyExtractor(item)}
            id={keyExtractor(item)}
            renderDragHandle={renderDragHandle}
          >
            {renderItem(item, index)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
