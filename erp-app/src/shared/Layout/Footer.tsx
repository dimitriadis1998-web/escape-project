const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="flex flex-col gap-1 border-t border-gray-700 bg-gray-800 px-6 py-3 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium text-gray-100">
                © {currentYear} Escape ERP
            </p>

            <p>
                Inventory Management System
            </p>
        </footer>
    )
}

export default Footer