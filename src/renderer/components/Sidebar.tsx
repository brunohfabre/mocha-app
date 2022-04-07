import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';

export function Sidebar(): JSX.Element {
  const navigate = useNavigate();
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
            to="/rest"
            className="flex-1 flex items-center justify-center h-10 hover:bg-blue-400"
          >
            R
          </Link>
        </li>
        <li className="flex">
          <Link
            to="/notes"
            className="flex-1 flex items-center justify-center h-10 hover:bg-blue-400"
          >
            N
          </Link>
        </li>
      </ul>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="flex items-center justify-center py-4">
          <div className="w-8 h-8 bg-green-300" />
          {/* <button
            type="button"
            className="flex items-center justify-center py-4"
            onClick={signOut}
          >
            <div className="w-8 h-8 bg-red-500" />
          </button> */}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="bg-red-100 py-2 w-40">
          <DropdownMenu.Item
            className="cursor-pointer hover:bg-red-200"
            onClick={() => navigate('/profile')}
          >
            profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer hover:bg-red-200"
            onClick={signOut}
          >
            signout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
