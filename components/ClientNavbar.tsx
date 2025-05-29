'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function ClientNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk mobile menu

  const activeClass = "text-[#FD7E14] border-b-2 border-[#FD7E14]";
  const inactiveClass = "text-gray-900 hover:text-[#FD7E14]";

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.65208 23.3198C6.69156 23.7511 4.83387 24.4373 3.88532 23.6154C3.2261 23.0442 3.26276 21.6041 3.30965 20.8169C3.45856 18.3249 4.87502 15.8671 6.37255 13.9356C8.1629 11.627 10.8424 9.86529 13.7624 9.76677C15.979 9.69195 18.1627 10.5816 19.8934 11.9684C21.6242 13.3552 22.9319 15.2119 23.9363 17.1891C24.4264 18.1538 24.8572 19.1852 24.8736 20.2672C24.8899 21.3492 24.4115 22.4965 23.4604 23.0126C22.6979 23.4263 21.7561 23.3777 20.931 23.1096C20.1059 22.8417 19.3624 22.3753 18.5984 21.964C17.1892 21.2055 15.6256 20.6149 14.0283 20.7119C11.7189 20.8526 9.76294 22.372 7.65208 23.3198Z" fill="black"/>
              <path d="M5.46221 11.1433C5.74581 13.4806 3.97017 14.7522 2.15663 12.995C1.04446 11.9175 0.178717 10.0007 0.0235771 8.4595C-0.0544918 7.6828 0.0405378 6.80508 0.62618 6.28903C1.18738 5.79443 2.06484 5.79168 2.73454 6.12516C3.40424 6.45864 3.89535 7.06797 4.2812 7.70899C4.90999 8.75381 5.3153 9.93258 5.46221 11.1433Z" fill="black"/>
              <path d="M12.1677 4.84918C12.5413 6.42228 12.0976 8.85015 9.97228 8.67157C7.42818 8.45781 7.13261 4.06774 7.40772 2.25869C7.51074 1.58026 7.77437 0.822767 8.41414 0.574842C8.85462 0.403988 9.36768 0.535183 9.75653 0.80381C10.1451 1.07219 10.432 1.46154 10.6996 1.85088C11.3329 2.77349 11.909 3.7602 12.1677 4.84918Z" fill="black"/>
              <path d="M21.0142 3.82031C21.0372 2.77798 20.8047 1.68377 20.1203 0.897339C19.4359 0.110913 18.2262 -0.268956 17.3023 0.214173C16.3433 0.715511 15.9904 1.89877 15.8322 2.96904C15.6172 4.42241 15.2703 7.09322 16.3318 8.31763C16.9963 9.0841 17.9927 8.68528 18.7547 8.24255C20.2495 7.37357 20.978 5.47647 21.0142 3.82031Z" fill="black"/>
              <path d="M27.2735 13.3564C25.7768 14.7681 22.7174 14.3306 22.9875 11.8955C23.1701 10.2484 24.2912 8.5513 25.3074 7.28748C25.9272 6.51677 26.8341 5.7725 27.7996 5.98725C28.5653 6.1576 29.0921 6.91335 29.226 7.68631C29.3597 8.45926 29.1769 9.24943 28.9691 10.0059C28.6331 11.2286 28.1962 12.4864 27.2735 13.3564Z" fill="black"/>
            </svg>
            <span className="ml-2 text-l font-bold text-[#000000]">Pet Clinic</span>
          </div>

          {/* Hamburger button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8 h-10">
            <NavLink href="/dashboard-user" pathname={pathname} label="Dashboard" />
            <NavLink href="/hewan-peliharaan" pathname={pathname} label="Kelola Hewan Peliharaan" />
            <NavLink href="/doctor/visits" pathname={pathname} label="Daftar Kunjungan" />
            <NavLink href="/vaccines-client" pathname={pathname} label="Daftar Vaksinasi" />
            <NavLink href="/detail-klien" pathname={pathname} label="Detail Data" />
            <NavLink href="/doctor/pet_treatments" pathname={pathname} label="Daftar Perawatan Hewan" />
            </div>
            
            {/* Logout Button */}
            <div className="hidden md:flex items-center">
            <Link
              href="/logout"
              className="px-5 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Logout
            </Link>
          </div>
          </div>
          

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col space-y-4 mt-4">
            <NavLink href="/dashboard-user" pathname={pathname} label="Dashboard" />
            <NavLink href="/hewan-peliharaan" pathname={pathname} label="Kelola Hewan Peliharaan" />
            <NavLink href="/doctor/visits" pathname={pathname} label="Daftar Kunjungan" />
            <NavLink href="/vaccines-client" pathname={pathname} label="Daftar Vaksinasi" />
            <NavLink href="/detail-klien" pathname={pathname} label="Detail Data" />
            <NavLink href="/doctor/pet_treatments" pathname={pathname} label="Daftar Perawatan Hewan" />
            <Link
              href="/logout"
              className="px-5 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

// Component helpers
function NavLink({ href, pathname, label }: { href: string; pathname: string; label: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center h-full px-1 ${pathname === href ? "text-[#FD7E14] border-b-2 border-[#FD7E14]" : "text-gray-900 hover:text-[#FD7E14]"}`}
    >
      {label}
    </Link>
  );
}
