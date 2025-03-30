import Link from "next/link";
import { NavItemType } from "./NavigationItems";

type NavigationItemProps = {
  navItem: NavItemType;
};

// Item de navigation standard
const NavigationItem = ({ navItem }: NavigationItemProps) => {
  return (
    <li>
      <Link
        href={navItem.slug}
        className="hover:text-primary transition-colors"
      >
        {navItem.name}
      </Link>
    </li>
  );
};
export default NavigationItem;
