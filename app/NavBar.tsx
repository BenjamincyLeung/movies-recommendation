"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Categories } from "./model";

// const API_URL = process.env.API_URL;
interface Props {
  categories: Categories[];
}

const NavBar: React.FC<Props> = ({ categories }) => {
  const { status, data: session } = useSession();

  return (
    <div className="navbar bg-base-100 font-bold text-slate-50 w-full">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Watch List</a>
            </li>
            {/* <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost">
                Categories
              </label>
              <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      className="rounded-t px-4 block whitespace-no-wrap text-slate-50"
                      href={`/categories/${category.category}`}
                    >
                      {category.category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}
            <li>
              <a>Profile</a>
            </li>
            <details className="dropdown cursor-pointer">
              <summary>Categories</summary>
              <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      className="rounded-t px-4 block whitespace-no-wrap text-slate-50"
                      href={`/categories/${category.category}`}
                    >
                      {category.category}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-4xl font-bold">
          Home Page
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-xl">
          <li>
            <a>Watch List</a>
          </li>
          <li>
            <div className="group inline-block relative">
              <button className="rounded inline-flex items-center">
                <span className="mr-1">Categories</span>
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>
              <ul className="absolute z-10 hidden text-gray-700 bg-slate-900	 pt-1 group-hover:block mt-2 rounded-lg">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      className="rounded-t px-4 block whitespace-no-wrap text-slate-50"
                      href={`/categories/${category.category}`}
                    >
                      {category.category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <a>Profile</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {status === "loading" && <div>Loading</div>}
        {status === "authenticated" && (
          <div className="flex place-items-center">
            <p className="mr-2">{session.user!.name}</p>
            <Link href="/api/auth/signout" className="btn mr-2">
              Sign Out
            </Link>
          </div>
        )}
        {status === "unauthenticated" && (
          <div>
            <Link className="btn mr-2" href="/api/auth/signin">
              Sign In
            </Link>
            <button className="btn mr-2">Sign Up</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
