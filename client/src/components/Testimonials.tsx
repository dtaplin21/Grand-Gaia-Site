import { Link } from "@/lib/routing";
import { Button } from "@/components/ui/button";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      text: "After just two weeks of using Batana Oil on my dry, damaged hair, I noticed incredible improvement in texture and shine. It's become the only hair product I'll ever need.",
      author: "Sarah K.",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 2,
      text: "I've struggled with sensitive skin my entire life. Pure Batana is the first oil that moisturizes deeply without causing breakouts. It's truly miraculous.",
      author: "Michael T.",
      image: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 3,
      text: "The scent is subtle and natural, and the oil absorbs beautifully into my skin without feeling greasy. I love that it's ethically sourced too!",
      author: "Jennifer L.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <section id="reviews" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3a5a40] mb-4">What Our Customers Say</h2>
          <p className="text-neutral-800">Real experiences from our community of Batana Oil users</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
              <div className="flex text-yellow-500 mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                {testimonial.id === 3 ? <i className="fas fa-star-half-alt"></i> : <i className="fas fa-star"></i>}
              </div>
              <p className="italic mb-6 text-neutral-800">{testimonial.text}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden mr-4">
                  <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-neutral-600">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/reviews">
            <Button variant="outline" className="text-[#3a5a40] border-neutral-200 font-medium py-3 px-8 rounded-full inline-flex items-center">
              Read All Reviews
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
