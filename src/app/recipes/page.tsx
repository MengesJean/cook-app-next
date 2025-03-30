import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeCard from "@/components/RecipeCard";
import { Fragment } from "react";
import { getPublicRecipes } from "../../../actions/recipes.action";
import { RecipeType } from "../../../types/Recipe.type";

const Page = async () => {
  const recipes = await getPublicRecipes();
  return (
    <Container>
      <Heading tag={"h1"}>Recipes</Heading>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {recipes.map((item: RecipeType) => {
          return (
            <Fragment key={item.id}>
              <RecipeCard recipe={item} />
            </Fragment>
          );
        })}
      </div>
    </Container>
  );
};

export default Page;
