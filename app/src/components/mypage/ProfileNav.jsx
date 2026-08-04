import { NavLink } from 'react-router-dom';

export default function ProfileNav() {
  return (
    <nav>
      <NavLink to=''>Profile</NavLink>
      <NavLink to=''>My Projects</NavLink>
      <NavLink to=''>Bookmarks</NavLink>
      <NavLink to=''>Interest&Contect</NavLink>
    </nav>
  );
}
