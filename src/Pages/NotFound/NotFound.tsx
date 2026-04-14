import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const NotFound = () => {
  const error = useRouteError();

  // This component is used as `errorElement`, so it will show up both for
  // unmatched routes and for render/loader errors. We surface details to make
  // debugging easier during development.
  let title = "Not Found";
  let details: string | null = null;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    details = typeof error.data === "string" ? error.data : null;
  } else if (error instanceof Error) {
    title = "Something went wrong";
    details = error.message;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you’re trying to open doesn’t exist, or an error happened
          while rendering it.
        </p>

        {details && (
          <pre className="mt-4 text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto text-gray-700">
            {details}
          </pre>
        )}
      </div>
    </div>
  );
};

export default NotFound;
