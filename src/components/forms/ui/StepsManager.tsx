"use client";

import { StepType } from "@/types/Step.type";
import { useState } from "react";
import { DraggableItem, DraggableItems } from "./DraggableItems";

export interface StepsManagerProps {
  steps: StepType[];
  onChange: (steps: StepType[]) => void;
  hasErrors?: boolean;
  errorMessage?: string;
}

export default function StepsManager({
  steps,
  onChange,
  hasErrors,
  errorMessage,
}: StepsManagerProps) {
  const [newStepContent, setNewStepContent] = useState("");

  // Ajouter une nouvelle étape
  const handleAddStep = () => {
    if (!newStepContent.trim()) return;

    const newStep: StepType = {
      id: Date.now(), // ID temporaire pour le front
      content: newStepContent.trim(),
      order: steps.length,
    };

    onChange([...steps, newStep]);
    setNewStepContent("");
  };

  // Supprimer une étape
  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    onChange(newSteps.map((step, idx) => ({ ...step, order: idx })));
  };

  // Gérer le changement de contenu d'une étape
  const handleStepContentChange = (index: number, content: string) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      content,
    };
    onChange(newSteps);
  };

  // Gérer le glisser-déposer
  const handleStepsReorder = (newItems: DraggableItem[]) => {
    // Convertir les DraggableItems en StepType
    const newSteps = newItems.map((item, index) => ({
      ...(steps.find(
        (s) => s.id === item.id || s.order === item.id
      ) as StepType),
      order: index,
    }));
    onChange(newSteps);
  };

  // Convertir les étapes en DraggableItem pour le composant DraggableItems
  const draggableSteps = steps.map((step) => ({
    ...step,
    id: step.id || step.order,
  }));

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Étapes de préparation</h3>
        {steps.length > 0 ? (
          <div className="space-y-2 mb-4">
            <DraggableItems
              items={draggableSteps}
              onItemsChange={handleStepsReorder}
              keyExtractor={(item) => item.id}
              renderDragHandle={({ listeners }) => (
                <div className="cursor-grab mr-2 pt-2" {...listeners}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="9" cy="5" r="1" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="15" cy="19" r="1" />
                  </svg>
                </div>
              )}
              renderItem={(item, index) => {
                const step = steps[index];
                return (
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Étape {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      value={step.content}
                      onChange={(e) =>
                        handleStepContentChange(index, e.target.value)
                      }
                      className="w-full p-2 border rounded-md min-h-[100px]"
                    />
                  </div>
                );
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500 italic mb-4">Aucune étape ajoutée.</p>
        )}

        {/* Formulaire d'ajout d'étape */}
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-10">
            <textarea
              placeholder="Contenu de l'étape"
              value={newStepContent}
              onChange={(e) => setNewStepContent(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[80px]"
            />
          </div>
          <div className="col-span-2 flex items-end">
            <button
              type="button"
              onClick={handleAddStep}
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!newStepContent.trim()}
            >
              Ajouter
            </button>
          </div>
        </div>

        {hasErrors && errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
