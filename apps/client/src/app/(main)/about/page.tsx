import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

const teamMembers = [
  {
    name: 'Akshay Gole',
    role: 'Founder',
    bio: 'Passionate about bringing authentic BBQ flavors to Thane. With years of culinary experience, Akshay founded Blazing Barbecue to share his love for grilled perfection.',
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Blazing Barbecue</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bringing the authentic taste of BBQ to your doorstep. We believe in quality ingredients,
            traditional recipes, and unforgettable flavors.
          </p>
        </div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Blazing Barbecue started with a simple vision - to bring the authentic taste of
              slow-cooked, smoked BBQ to the people of Thane and beyond. What began as a passion
              project has grown into a beloved local business.
            </p>
            <p className="text-gray-600 mb-4">
              Every dish we prepare is made with care, using only the freshest ingredients and
              traditional recipes that have been perfected over years of experimentation and
              refinement.
            </p>
            <p className="text-gray-600">
              From our signature wings to our tender full legs, each item on our menu is crafted
              to deliver an unforgettable culinary experience.
            </p>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop"
              alt="BBQ Food"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="font-semibold mb-2">Quality First</h3>
              <p className="text-gray-600 text-sm">
                We never compromise on ingredients. Every dish is made with premium, fresh products.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold mb-2">Customer Love</h3>
              <p className="text-gray-600 text-sm">
                Your satisfaction is our priority. We go the extra mile to ensure every order is perfect.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold mb-2">Fresh & Hygienic</h3>
              <p className="text-gray-600 text-sm">
                FSSAI licensed and committed to the highest standards of food safety and hygiene.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Meet Our Founder</h2>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-semibold mb-1">{teamMembers[0].name}</h3>
              <p className="text-primary font-medium mb-4">{teamMembers[0].role}</p>
              <p className="text-gray-600 text-sm">{teamMembers[0].bio}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Business Information</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold mb-3 text-primary">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <span className="text-gray-500">Primary:</span>{' '}
                  <a href="tel:+919321836106" className="hover:text-white">+91 9321836106</a>
                </li>
                <li>
                  <span className="text-gray-500">Thane:</span>{' '}
                  <a href="tel:+918369434959" className="hover:text-white">+91 8369434959</a>
                </li>
                <li>
                  <span className="text-gray-500">Email:</span>{' '}
                  <a href="mailto:blazingbarbecue@gmail.com" className="hover:text-white">
                    blazingbarbecue@gmail.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-primary">Licenses</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <span className="text-gray-500">FSSAI:</span> 21520046000143
                </li>
                <li>
                  <span className="text-gray-500">UDYAM:</span> UDYAM-MH-18-0011811
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-6">Experience the authentic taste of BBQ today!</p>
          <Link
            href="/menu"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            View Our Menu
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
