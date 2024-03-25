import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = () => {
  return (
    <div className="join justify-end">

      <div className="ml-6 hidden p-2 text-gray-400 hover:text-gray-500 lg:block">
        <span className="sr-only">Search</span>
        <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
      </div>

      {/* <input className="input w-full bg-white input-sm input-bordered join-item" placeholder="Search" />
      <div className="dropdown dropdown-hover join-item">
        <label tabIndex={0} className="w-[7rem] px-1 btn btn-sm bg-white text-lime-700 border-gray-300 rounded-none text-sm">Category <RiArrowDownSLine /></label>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow border border-gray-300 bg-base-100 rounded-lg w-52">
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
      <button className="btn btn-sm bg-lime-700 text-white font-semibold hover:bg-white hover:text-lime-700 join-item rounded-r-lg capitalize">Search</button> */}
    </div >
  );
}

export default SearchBar;