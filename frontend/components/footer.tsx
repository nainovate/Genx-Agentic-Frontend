export default function Footer() {
    return (
        <footer className="">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-1">
                © {new Date().getFullYear()} Powered by{" "}
                <a href="https://www.nainovate.ai/" className="text-highlighted-foreground hover:underline" target="_blank">
                    Nainovate
                </a>.
            </div>
        </footer>
    );
};