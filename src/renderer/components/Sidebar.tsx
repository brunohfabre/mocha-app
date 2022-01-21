import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';

export function Sidebar(): JSX.Element {
  const { signOut } = useContext(AuthContext);

  return (
    <div className="bg-blue-300 w-12 flex flex-col">
      <Link to="/" className="w-12 h-12 flex items-center justify-center">
        LG
      </Link>

      <ul className="flex-1 flex flex-col py-2">
        <li className="flex">
          <Link
            to="/connections"
            className="flex-1 flex items-center justify-center h-10 hover:bg-blue-400"
          >
            D
          </Link>
        </li>
        <li className="flex">
          <Link
            to="/connections"
            className="flex-1 flex items-center justify-center h-10 hover:bg-blue-400"
          >
            R
          </Link>
        </li>
        <li className="flex">
          <Link
            to="/connections"
            className="flex-1 flex items-center justify-center h-10 hover:bg-blue-400"
          >
            N
          </Link>
        </li>
      </ul>

      <button
        type="button"
        className="w-12 h-12 flex items-center justify-center"
        onClick={signOut}
      >
        sair
      </button>
    </div>
  );
}
