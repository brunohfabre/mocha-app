import { useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';

export function Header(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const { title } = usePageTitle();

  const showBackButton =
    location.pathname.split('/').filter((item) => Boolean(item)).length > 1;

  function handleNavigateBack(): void {
    navigate(-1);
  }

  return (
    <div className="w-full h-12 bg-red-300 flex justify-between items-center pr-4">
      <div className="flex items-center">
        {showBackButton && (
          <button
            type="button"
            onClick={handleNavigateBack}
            className="w-12 h-12 flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        <span className={!showBackButton ? 'pl-4' : ''}>{title}</span>
      </div>

      {/* <span>project_name ⌄</span> */}
    </div>
  );
}
