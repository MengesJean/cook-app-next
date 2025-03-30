type HeadingProps = {
  tag?: keyof typeof headings;
  children: React.ReactNode;
  className?: string;
};

const headings = {
  h1: "font-bold text-4xl mb-4",
  h2: "font-semibold text-3xl mb-3",
  h3: "font-semibold text-2xl mb-3",
  h4: "text-md text-xl mb-2",
  h5: "font-bold text-md mb-2",
  h6: "font-bold mb-2",
};

const Heading = ({ tag = "h1", children, className = "" }: HeadingProps) => {
  const Component = tag;
  const headingClass = headings[tag] || "";

  return (
    <Component className={`${headingClass} ${className}`}>{children}</Component>
  );
};

export default Heading;
