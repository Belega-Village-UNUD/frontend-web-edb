import { RiArrowDownSLine } from "react-icons/ri"

const SearchBar = () => {
  return (
    <div className="join w-[30rem]">
      <input className="input w-full bg-white input-sm input-bordered join-item" placeholder="Search" />
      <div className="dropdown dropdown-hover join-item">
        <label tabIndex={0} className="w-[7rem] px-1 btn btn-sm bg-white text-lime-700 border-gray-300 rounded-none text-sm">Category <RiArrowDownSLine /></label>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow border border-gray-300 bg-base-100 rounded-lg w-52">
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
      <button className="btn btn-sm bg-lime-700 text-white font-semibold hover:bg-white hover:text-lime-700 join-item rounded-r-lg capitalize">Search</button>
    </div >
  );
}

export default SearchBar;