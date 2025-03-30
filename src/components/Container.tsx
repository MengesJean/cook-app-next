type ContainerProps = {
  children: React.ReactNode;
  size?:
    | "max-w-sm"
    | "max-w-md"
    | "max-w-lg"
    | "max-w-xl"
    | "max-w-2xl"
    | "max-w-3xl"
    | "max-w-4xl"
    | "max-w-5xl"
    | "max-w-6xl"
    | "max-w-7xl";
};

const Container = ({ children, size = "max-w-6xl" }: ContainerProps) => {
  return <div className={`${size} mx-auto px-2 py-4`}>{children}</div>;
};

export default Container;
