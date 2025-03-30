import SwitchTheme from "../SwitchTheme";
import UserProfileButton from "../UserProfileButton";
import NavigationItems from "./NavigationItems";

const Navigation = () => {
  return (
    <div className="shadow">
      <div className="max-w-6xl mx-auto px-2 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Recipes</div>
        <div className="flex space-x-4 items-center">
          <NavigationItems />
          <UserProfileButton />
          <SwitchTheme />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
