import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg">
      <nav className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 font-semibold tracking-tight ">
          <Link
            to="/"
            className="inline-flex items-center gap-2 no-underline text-2xl sm:text-5xl"
          >
            Cinema
          </Link>
        </h2>


        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-base font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            User
          </Link>

        </div>
      </nav>
    </header>
  )
}
