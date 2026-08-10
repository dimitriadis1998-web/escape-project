import {Link} from "react-router";


const NotFoundPage = () => {
    return (
        <section className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
            <h1 className="text-7xl font-extrabold text-purple-600">404</h1>
             <h2 className="mt-4 text-2xl font-bold text-gray-800">Page Not Found</h2>
             <p className="mt-2 text-sm text-gray-500">
                 The page you are looking for does not exist.
             </p>
            <Link className="mt-6 rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700"
                to="/">
                Back to Dashboard
            </Link>
        </section>
    )


}
export default NotFoundPage