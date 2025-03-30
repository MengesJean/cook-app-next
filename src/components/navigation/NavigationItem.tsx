import { NavItemType } from "@/components/navigation/NavigationItems";
import Link from "next/link";

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
