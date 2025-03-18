import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-dark-olive text-beige">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cricket Manager</h3>
            <p className="text-olive text-sm">
              A comprehensive web application for managing cricket tournaments, teams, players, and statistics.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tournaments" className="text-olive hover:text-beige transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-olive hover:text-beige transition-colors">
                  Teams
                </Link>
              </li>
              <li>
                <Link href="/players" className="text-olive hover:text-beige transition-colors">
                  Players
                </Link>
              </li>
              <li>
                <Link href="/statistics" className="text-olive hover:text-beige transition-colors">
                  Statistics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-olive hover:text-beige transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-olive hover:text-beige transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-olive hover:text-beige transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-olive hover:text-beige transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-olive hover:text-beige transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-olive/20 mt-8 pt-8 text-center text-sm text-olive">
          <p>&copy; {new Date().getFullYear()} Cricket Tournament Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

