import { getMyRecipes } from "@/actions/recipes.action";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeCard from "@/components/RecipeCard";
import { RecipeType } from "@/types/Recipe.type";
import { Fragment } from "react";

const Page = async () => {
  const recipes: RecipeType[] | null = await getMyRecipes();
  return (
    <Container>
      <Heading>Mes recettes</Heading>
      {recipes && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {recipes.map((item: RecipeType) => (
            <Fragment key={item.id}>
              <RecipeCard recipe={item} />
            </Fragment>
          ))}
        </div>
      )}
      {!recipes && <div className="">No recipes found</div>}
    </Container>
  );
};

export default Page;
