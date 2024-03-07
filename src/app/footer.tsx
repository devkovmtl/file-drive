import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="h-40 bg-gray-100 mt-12 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div>FileDrive</div>
        <p>
          Made with ❤️ by{' '}
          <a
            className="text-primary underline hover:text-primary-foreground"
            href="https://github.com/devkovmtl"
            target="_blank"
            rel="noopener noreferrer"
          >
            devkovmtl
          </a>
        </p>
        <Link
          className="text-blue-900 hover:text-blue-500"
          href="/privacy-policy"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-blue-900 hover:text-blue-500"
          href="/terms-of-service"
        >
          Terms of Service
        </Link>
        <Link className="text-blue-900 hover:text-blue-500" href="/about">
          About
        </Link>
      </div>
    </footer>
  );
}
