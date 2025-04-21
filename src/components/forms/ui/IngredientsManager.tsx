"use client";

import {
  IngredientFormType,
  IngredientSelectOptionType,
} from "@/types/Ingredient.type";
import { useEffect, useState } from "react";
import { getIngredients } from "../../../actions/ingredients.action";
import { DraggableItem, DraggableItems } from "./DraggableItems";

export interface IngredientsManagerProps {
  ingredients: IngredientFormType[];
  onChange: (ingredients: IngredientFormType[]) => void;
  hasErrors?: boolean;
  errorMessage?: string;
}

export default function IngredientsManager({
  ingredients,
  onChange,
  hasErrors,
  errorMessage,
}: IngredientsManagerProps) {
  const [availableIngredients, setAvailableIngredients] = useState<
    IngredientSelectOptionType[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientQuantity, setNewIngredientQuantity] = useState("");
  const [newIngredientUnit, setNewIngredientUnit] = useState("");
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");
  const [showIngredientsList, setShowIngredientsList] = useState(false);

  // Chargement des ingrédients existants
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await getIngredients();
        if (response && Array.isArray(response)) {
          setAvailableIngredients(
            response.map((ingredient) => ({
              value: ingredient.id,
              label: ingredient.name,
            }))
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement des ingrédients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  // Filtrer les ingrédients en fonction de la recherche
  const filteredIngredients = availableIngredients.filter((ingredient) =>
    ingredient.label.toLowerCase().includes(ingredientSearchQuery.toLowerCase())
  );

  // Ajouter un nouvel ingrédient
  const handleAddIngredient = (
    ingredientId?: number,
    ingredientName?: string
  ) => {
    console.log("handleAddIngredient");
    console.log("ingredientId", ingredientId);
    console.log("ingredientName", ingredientName);
    console.log("newIngredientQuantity", newIngredientQuantity);
    console.log("newIngredientUnit", newIngredientUnit);
    // Valider que tous les champs sont remplis
    if (!newIngredientQuantity || !newIngredientUnit) {
      return;
    }

    // Créer un nouvel ingrédient
    const newIngredient: IngredientFormType = {
      id: Date.now(), // ID temporaire pour le front
      ingredient_id: ingredientId || 0, // Si 0, c'est un nouvel ingrédient à créer côté API
      name: ingredientName || newIngredientName,
      quantity: parseFloat(newIngredientQuantity),
      unit: newIngredientUnit,
      order: ingredients.length,
    };

    // Ajouter à la liste
    onChange([...ingredients, newIngredient]);

    // Réinitialiser les champs
    setNewIngredientName("");
    setNewIngredientQuantity("");
    setNewIngredientUnit("");
    setIngredientSearchQuery("");
    setShowIngredientsList(false);
  };

  // Supprimer un ingrédient
  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    onChange(newIngredients.map((item, idx) => ({ ...item, order: idx })));
  };

  // Gérer le changement de valeur d'un ingrédient
  const handleIngredientChange = (
    index: number,
    field: keyof IngredientFormType,
    value: string | number
  ) => {
    const newIngredients = [...ingredients];
    if (field === "quantity") {
      newIngredients[index] = {
        ...newIngredients[index],
        quantity: parseFloat(value as string),
      };
    } else {
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value,
      };
    }
    onChange(newIngredients);
  };

  // Gérer le glisser-déposer
  const handleIngredientsReorder = (newItems: DraggableItem[]) => {
    // Convertir les DraggableItems en IngredientFormType
    const newIngredients = newItems.map((item, index) => ({
      ...(ingredients.find(
        (i: IngredientFormType) => i.id === item.id || i.order === item.id
      ) as IngredientFormType),
      order: index,
    }));
    onChange(newIngredients);
  };

  // Sélectionner un ingrédient existant
  const handleSelectIngredient = (ingredientId: number, name: string) => {
    setNewIngredientName(name);
    setIngredientSearchQuery(name);
    setShowIngredientsList(false);

    // Ajouter directement l'ingrédient si les autres champs sont remplis
    if (newIngredientQuantity && newIngredientUnit) {
      handleAddIngredient(ingredientId, name);
    }
  };

  // Créer un nouvel ingrédient
  const handleCreateNewIngredient = () => {
    if (newIngredientName) {
      handleAddIngredient(0, newIngredientName);
    }
  };

  // Convertir les ingrédients en DraggableItem pour le composant DraggableItems
  const draggableIngredients = ingredients.map((ingredient) => ({
    ...ingredient,
    id: ingredient.id || ingredient.order,
  }));

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Ingrédients</h3>
        {ingredients.length > 0 ? (
          <div className="space-y-2 mb-4">
            <DraggableItems
              items={draggableIngredients}
              onItemsChange={handleIngredientsReorder}
              keyExtractor={(item) => item.id}
              renderDragHandle={({ listeners }) => (
                <div className="cursor-grab mr-2" {...listeners}>
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
                const ingredient = ingredients[index];
                return (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex-1">
                      <span className="font-medium">{ingredient.name}</span>
                      <div className="flex items-center gap-2 text-sm">
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={ingredient.quantity}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-16 p-1 border rounded-md"
                        />
                        <input
                          type="text"
                          value={ingredient.unit}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "unit",
                              e.target.value
                            )
                          }
                          className="w-20 p-1 border rounded-md"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
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
                );
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500 italic mb-4">Aucun ingrédient ajouté.</p>
        )}

        {/* Formulaire d'ajout d'ingrédient */}
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4 relative">
            <input
              type="text"
              placeholder="Nom de l'ingrédient"
              value={ingredientSearchQuery}
              onChange={(e) => {
                setIngredientSearchQuery(e.target.value);
                setNewIngredientName(e.target.value);
                setShowIngredientsList(true);
              }}
              onFocus={() => setShowIngredientsList(true)}
              className="w-full p-2 border rounded-md"
              disabled={isLoading}
            />
            {showIngredientsList && ingredientSearchQuery.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {isLoading ? (
                  <div className="p-2">Chargement...</div>
                ) : filteredIngredients.length > 0 ? (
                  <>
                    {filteredIngredients.map((ingredient) => (
                      <div
                        key={ingredient.value}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() =>
                          handleSelectIngredient(
                            ingredient.value,
                            ingredient.label
                          )
                        }
                      >
                        {ingredient.label}
                      </div>
                    ))}
                  </>
                ) : (
                  <div
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={handleCreateNewIngredient}
                  >
                    Créer &quot;{ingredientSearchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="col-span-3">
            <input
              type="number"
              placeholder="Quantité"
              value={newIngredientQuantity}
              onChange={(e) => setNewIngredientQuantity(e.target.value)}
              className="w-full p-2 border rounded-md"
              min="0.1"
              step="0.1"
            />
          </div>
          <div className="col-span-3">
            <input
              type="text"
              placeholder="Unité"
              value={newIngredientUnit}
              onChange={(e) => setNewIngredientUnit(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="col-span-2">
            <button
              type="button"
              onClick={() => handleAddIngredient()}
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={
                !newIngredientName ||
                !newIngredientQuantity ||
                !newIngredientUnit
              }
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
