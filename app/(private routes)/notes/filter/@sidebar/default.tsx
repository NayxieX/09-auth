import Link from "next/link";
import css from "./SidebarNotes.module.css";
import { tagOptions } from "@/types/note";

const SidebarNotes = () => {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/filter/All" className={css.menuLink}>
          All notes
        </Link>
      </li>

      {tagOptions.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default SidebarNotes;
