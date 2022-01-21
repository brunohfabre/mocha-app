import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';

export function Sidebar(): JSX.Element {
  const { signOut } = useContext(AuthContext);

  return (
    <div className="bg-blue-300 w-16 flex flex-col">
      <Link to="/" className="w-16 h-16 flex items-center justify-center">
        S
      </Link>

      <ul className="flex-1 flex flex-col">
        <li className="flex">
          <Link
            to="/connections"
            className="flex-1 flex items-center justify-center h-12"
          >
            D
          </Link>
        </li>
        <li className="flex">
          <Link
            to="/connections"
            className="flex-1 flex items-center justify-center h-12"
          >
            D
          </Link>
        </li>
        <li className="flex">
          <Link
            to="/connections"
            className="flex-1 flex items-center justify-center h-12"
          >
            D
          </Link>
        </li>
        <li className="flex">
          <Link
            to="/connections"
            className="flex-1 flex items-center justify-center h-12"
          >
            D
          </Link>
        </li>
      </ul>

      <button
        type="button"
        className="w-16 h-16 flex items-center justify-center"
        onClick={signOut}
      >
        sair
      </button>
    </div>
  );
}
