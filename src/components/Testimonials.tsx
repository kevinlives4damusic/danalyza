import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type TestimonialProps = {
  className?: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
};

const Testimonials = ({ className }: TestimonialProps) => {
  const testimonials: Testimonial[] = [
    {
      quote:
        "The CV analysis was incredibly detailed and helped me identify weaknesses I never noticed. After implementing the suggestions, I received three interview calls in just one week!",
      author: "Sarah Johnson",
      role: "Marketing Specialist",
      company: "Hired at MediaTech",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
    },
    {
      quote:
        "I was skeptical at first, but the ATS compatibility check revealed why my applications weren't getting through. The Premium service completely transformed my CV.",
      author: "Michael Ndlovu",
      role: "Software Engineer",
      company: "Hired at TechSolutions",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 5,
    },
    {
      quote:
        "The industry comparison feature showed me exactly how my qualifications stacked up against other candidates. Worth every rand for the insights alone.",
      author: "Thandi Nkosi",
      role: "Financial Analyst",
      company: "Promoted at Standard Bank",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thandi",
      rating: 4,
    },
  ];

  return (
    <div className={cn("py-16 px-4 bg-gray-50", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who've improved their career
            prospects with our CV services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300",
                    )}
                  />
                ))}
              </div>

              <p className="text-gray-700 italic mb-6 flex-grow">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center mt-auto">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.author}
                  />
                  <AvatarFallback>
                    {testimonial.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm font-medium text-blue-600">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-600 text-white py-8 px-6 rounded-xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to transform your career?
            </h3>
            <p className="mb-6">
              Join over 10,000 professionals who've boosted their job prospects
              with our services
            </p>
            <button
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
              onClick={() => (window.location.href = "/")}
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
