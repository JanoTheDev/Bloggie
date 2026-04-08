import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200 dark:text-neutral-800">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-neutral-100">Page not found</h1>
        <p className="mt-2 text-gray-500 dark:text-neutral-400">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="mt-6 inline-block px-6 py-2.5 text-sm font-medium bg-gray-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-neutral-200 transition-colors">
          Go home
        </Link>
      </div>
    </div>
  );
}
