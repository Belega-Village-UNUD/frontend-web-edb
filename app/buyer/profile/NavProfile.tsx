import { Component, useState } from "react";
import AccountProfile from "./account/page";

const NavProfile = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  interface Components {
    [key: string]: JSX.Element
  }

  const components: Components = {
    Profile: <AccountProfile />,
    // Address: ,
    // ChangePassword: ,
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white">
        <ul className="menu w-56 h-full">
          <li>
            <details open>
              <summary className="font-semibold">Akun Saya</summary>
              <ul>
                <li>
                  <button onClick={() => setActiveComponent('Profile')}>Profile</button>
                </li>
                <li><a>Alamat</a></li>
                <li><a>Ubah Password</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="flex-grow p-4">
        {activeComponent && components[activeComponent]}
      </div>
    </div>
  );
}

export default NavProfile;