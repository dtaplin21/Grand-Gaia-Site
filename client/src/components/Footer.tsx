import { Link } from "@/lib/routing";

export default function Footer() {
  return (
    <footer className="bg-[#344e41] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="font-display font-bold text-xl mb-6">PURE BATANA</h3>
            <p className="text-neutral-200 mb-6">Bringing the traditional beauty wisdom of Honduras to modern skincare routines.</p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-6">Customer Care</h4>
            <ul className="space-y-3">
              <li>
                <Link className="text-neutral-200 hover:text-white transition-colors" href="/contact-simple">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#3a5a40] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-neutral-300">© {new Date().getFullYear()} Pure Batana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
