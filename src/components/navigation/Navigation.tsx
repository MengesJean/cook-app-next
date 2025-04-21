import SwitchTheme from "@/components/SwitchTheme";
import UserProfileButton from "@/components/UserProfileButton";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import NavigationItems from "@/components/navigation/NavigationItems";

const Navigation = () => {
  return (
    <div className="shadow">
      <div className="max-w-6xl mx-auto px-2 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Recipes</div>

        {/* Navigation pour desktop */}
        <div className="hidden lg:flex space-x-4 items-center">
          <NavigationItems />
          <UserProfileButton />
          <SwitchTheme />
        </div>

        {/* Navigation pour mobile */}
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Navigation;
