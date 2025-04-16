import { Link } from "@/lib/routing";

export default function Benefits() {
  return (
    <section id="benefits" className="py-16 md:py-24 bg-[#dad7cd]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">Benefits of Batana Oil</h2>
          <p className="text-neutral-800">Discover why this ancient beauty secret has been treasured for centuries</p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-16">
          <img 
            src="/images/batana-benefits.jpg" 
            alt="Batana Oil Benefits" 
            className="w-full rounded-lg mx-auto shadow-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3a5a40] bg-opacity-10 text-[#588157] mb-6">
              <i className="fas fa-wind text-2xl"></i>
            </div>
            <h3 className="font-display font-semibold text-xl mb-4">Hair Revitalization</h3>
            <p className="text-neutral-600">Strengthens hair follicles, prevents breakage, and adds natural shine without weighing hair down. Ideal for all hair types, especially dry or damaged hair.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3a5a40] bg-opacity-10 text-[#588157] mb-6">
              <i className="fas fa-magic text-2xl"></i>
            </div>
            <h3 className="font-display font-semibold text-xl mb-4">Skin Renewal</h3>
            <p className="text-neutral-600">Rich in omega-3, 6, and 9 fatty acids to deeply moisturize and improve skin elasticity. Helps reduce the appearance of fine lines and promotes a natural, healthy glow.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3a5a40] bg-opacity-10 text-[#588157] mb-6">
              <i className="fas fa-seedling text-2xl"></i>
            </div>
            <h3 className="font-display font-semibold text-xl mb-4">100% Natural</h3>
            <p className="text-neutral-600">No additives, preservatives or chemicals. Just pure, cold-pressed oil from American palm fruit. Sustainable harvesting practices protect both the environment and traditional knowledge.</p>
          </div>
        </div>
        

      </div>
    </section>
  );
}
