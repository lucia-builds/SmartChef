export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
}

export function isRecipe(value: unknown): value is Recipe {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const recipe = value as Record<string, unknown>;

  return (
    typeof recipe.name === "string" &&
    typeof recipe.description === "string" &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.every((ingredient) => typeof ingredient === "string") &&
    Array.isArray(recipe.steps) &&
    recipe.steps.every((step) => typeof step === "string")
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseRecipes(value: string | string[] | undefined): Recipe[] {
  const serialized = firstParam(value);

  if (!serialized) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    return Array.isArray(parsed) ? parsed.filter(isRecipe) : [];
  } catch {
    return [];
  }
}

export function parseRecipe(value: string | string[] | undefined): Recipe | null {
  const serialized = firstParam(value);

  if (!serialized) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    return isRecipe(parsed) ? parsed : null;
  } catch {
    return null;
  }
}