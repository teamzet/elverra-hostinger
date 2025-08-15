import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Briefcase, Building, Users, Search, Plus, ChevronDown, Info, UserCheck, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import CountrySelector from './CountrySelector';
import { useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('/lovable-uploads/elverra-global-logo-new.jpeg');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        // Try to get the uploaded logo from API
        const response = await fetch('/api/files/logo');
        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            setLogoUrl(data.url);
          }
        } else {
          console.log('Logo API not accessible, using default logo');
        }
      } catch (error) {
        console.log('Error fetching logo, using default:', error);
      }
    };

    fetchLogo();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoUrl} 
              alt="Elverra Global" 
              className="h-10 w-auto object-contain"
              onError={() => setLogoUrl('/lovable-uploads/elverra-global-logo-new.jpeg')}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              style={{ fontSize: '15px' }}
            >
              Home
            </Link>
            
            {/* About Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium" style={{ fontSize: '15px' }}>
                  About
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center">
                    About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/ebooks" className="flex items-center">
                    
                    E-Book Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/about/contact">
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about/projects">
                    Projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about/partners">
                    Partners
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about/news">
                    News
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/team">
                    Team Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about/changing-lives">
                    Empowerment and Progress
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/terms">
                    Terms of Use
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/privacy">
                    Privacy Policy
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium" style={{ fontSize: '15px' }}>
                  Services
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/services">
                    All Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/services/o-secours">
                    Ô Secours
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services/credit-system">
                    Credit System
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services/hire-purchase">
                    Hire Purchase
                  </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link to="/services/payday-advance">
                     Payday Advance
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link to="/services/online-store">
                     Online Store
                   </Link>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>

             {/* Shop Menu Item */}
             <Link 
               to="/shop" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              style={{ fontSize: '15px' }}
             >
               {/* Shop */}
             </Link>

            {/* Jobs Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-purple-600 font-medium" style={{ fontSize: '15px' }}>
                  Jobs
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/jobs" className="flex items-center">
                    
                    Browse Jobs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/job-center" className="flex items-center">
                    
                    Job Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/job-dashboard/employee" className="flex items-center">
                    
                    Employee Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/job-dashboard/employer" className="flex items-center">
                    
                    Employer Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/post-job" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Job
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Our Affiliates Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-purple-600 font-medium" style={{ fontSize: '15px' }}>
                  Our Affiliates
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/affiliates/members">
                    
                    Member Affiliates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/affiliates/merchants">
                    
                    Merchant Partners
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/affiliates/distributors">
                    Distributors
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/affiliate-program">
                    <Settings className="h-4 w-4 mr-2" />
                    Join Affiliate Program
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="/discounts" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              style={{ fontSize: '15px' }}
            >
              Discounts
            </Link>

            <Link 
              to="/project-requests" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              style={{ fontSize: '15px' }}
            >
              Projects
            </Link>

            <Link 
              to="/competitions" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              style={{ fontSize: '15px' }}
            >
              Events
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <CountrySelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-account" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/register">Join Now</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                to="/about/contact" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link 
                to="/about/projects" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                Projects
              </Link>
              <Link 
                to="/about/partners" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                Partners
              </Link>
              <Link 
                to="/about/news" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                News
              </Link>
              <Link 
                to="/services" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Services
              </Link>
               <Link 
                 to="/services/o-secours" 
                 className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                 onClick={toggleMenu}
               >
                 Ô Secours
               </Link>
               <Link 
                 to="/shop" 
                 className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                 style={{ fontSize: '15px' }}
                 onClick={toggleMenu}
               >
                 Shop
               </Link>
              <Link 
                to="/ebook-library" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                E-Book Library
              </Link>
              <Link 
                to="/jobs" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Browse Jobs
              </Link>
              <Link 
                to="/job-center" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Job Center
              </Link>
              <Link 
                to="/post-job" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Post a Job
              </Link>
              <Link 
                to="/affiliates/members" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Member Affiliates
              </Link>
              <Link 
                to="/affiliates/merchants" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Merchant Partners
              </Link>
              <Link 
                to="/affiliates/distributors" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Distributors
              </Link>
              <Link 
                to="/affiliate-dashboard" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Affiliate Dashboard
              </Link>
              <Link 
                to="/discounts" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Discounts
              </Link>
              <Link 
                to="/competitions" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                style={{ fontSize: '15px' }}
                onClick={toggleMenu}
              >
                Competitions
              </Link>
              
              {!user && (
                <div className="flex flex-col space-y-2 px-2 pt-4 border-t">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login" onClick={toggleMenu}>Login</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link to="/register" onClick={toggleMenu}>Join Now</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;