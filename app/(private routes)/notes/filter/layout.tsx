import React from "react";

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};
const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <div>
      {sidebar}
      {children}
    </div>
  );
};
export default NotesLayout;
