import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="relative w-10 h-8 mr-2">
                    <div className="absolute top-1/2 w-full h-0.5 bg-primary-cyan rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-3 h-3 bg-primary-blue rounded-full transform -translate-y-1/2"></div>
                  </div>
                  <span className="text-2xl font-bold text-primary-blue">
                    Inkless<span className="text-primary-cyan">Flow</span>
                  </span>
                </div>
              </div>
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/#features" className="text-gray-500 hover:text-primary-blue px-3 py-2 text-sm font-medium">
                  Features
                </Link>
                <Link href="/#how-it-works" className="text-gray-500 hover:text-primary-blue px-3 py-2 text-sm font-medium">
                  How It Works
                </Link>
                <Link href="/blog" className="text-gray-500 hover:text-primary-blue px-3 py-2 text-sm font-medium">
                  Blog
                </Link>
                <Link href="/help-center" className="text-gray-500 hover:text-primary-blue px-3 py-2 text-sm font-medium">
                  Help Center
                </Link>
              </nav>
            </div>
            <div className="hidden md:flex items-center">
              <Link href="/auth/login" className="text-primary-blue hover:text-primary-blue/90 px-3 py-2 text-sm font-medium">
                Log In
              </Link>
              <Link href="/auth/register" className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-orange hover:bg-accent-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange">
                Sign Up Free
              </Link>
            </div>
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-cyan"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <div className="hidden md:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/#features" className="text-gray-500 hover:bg-gray-50 hover:text-primary-blue block px-3 py-2 text-base font-medium">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-gray-500 hover:bg-gray-50 hover:text-primary-blue block px-3 py-2 text-base font-medium">
              How It Works
            </Link>
            <Link href="/blog" className="text-gray-500 hover:bg-gray-50 hover:text-primary-blue block px-3 py-2 text-base font-medium">
              Blog
            </Link>
            <Link href="/help-center" className="text-gray-500 hover:bg-gray-50 hover:text-primary-blue block px-3 py-2 text-base font-medium">
              Help Center
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <Link href="/auth/login" className="block text-primary-blue hover:text-primary-blue/90 text-base font-medium">
                Log In
              </Link>
              <Link href="/auth/register" className="ml-auto block text-accent-orange hover:text-accent-orange/90 text-base font-medium">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-bg-light py-20 overflow-hidden">
        <div className="absolute w-96 h-96 bg-primary-cyan opacity-5 rounded-full -top-20 -right-20"></div>
        <div className="absolute w-96 h-96 bg-accent-orange opacity-5 rounded-full -bottom-20 -left-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:flex-col lg:justify-center">
              <h1 className="text-4xl tracking-tight font-bold text-primary-blue sm:text-5xl md:text-6xl">
                Sign <span className="text-primary-cyan">smarter</span>.<br />
                Sign <span className="text-primary-cyan">free</span>.
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Digital document signing without the cost. No subscriptions, no hidden fees—just simple, legally binding electronic signatures for everyone.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:flex sm:justify-center lg:justify-start">
                <div className="mt-3 rounded-md shadow sm:mt-0">
                  <Link href="/auth/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-orange hover:bg-accent-orange/90 md:py-4 md:text-lg md:px-10">
                    Get Started for Free
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/#how-it-works" className="w-full flex items-center justify-center px-8 py-3 border border-primary-blue text-base font-medium rounded-md text-primary-blue bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    See How It Works
                  </Link>
                </div>
              </div>
              
              <div className="mt-12 flex flex-wrap justify-center gap-8 lg:justify-start">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-blue">100%</p>
                  <p className="text-sm text-gray-500">Free Forever</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-blue">eIDAS</p>
                  <p className="text-sm text-gray-500">Compliant</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-blue">5M+</p>
                  <p className="text-sm text-gray-500">Documents Signed</p>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-cyan">
                  <img className="w-full" src="/api/placeholder/600/400" alt="Inkless Flow Dashboard" />
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <button type="button" className="flex items-center justify-center h-16 w-16 rounded-full bg-white/70 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-cyan">
                      <svg className="h-8 w-8 text-primary-cyan" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-blue sm:text-4xl">
              How Inkless Flow Works
            </h2>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 lg:mx-auto">
              Sign documents legally in four simple steps
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-around">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="bg-white px-4">
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-cyan text-white text-lg font-bold">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 max-w-lg mx-auto grid gap-8 grid-cols-1 lg:max-w-none lg:grid-cols-4">
            <div className="flex flex-col bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-8 flex-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-primary-blue mb-2">Register for Free</h3>
                <p className="text-gray-500">Create your account in seconds. No credit card required, ever.</p>
              </div>
            </div>
            
            <div className="flex flex-col bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-8 flex-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-primary-blue mb-2">Upload a Document</h3>
                <p className="text-gray-500">Upload PDF, Word, or image files with just a drag and drop.</p>
              </div>
            </div>
            
            <div className="flex flex-col bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-8 flex-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-primary-blue mb-2">Sign with SES</h3>
                <p className="text-gray-500">Create your signature and place it on the document in seconds.</p>
              </div>
            </div>
            
            <div className="flex flex-col bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-8 flex-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-primary-blue mb-2">Download & Share</h3>
                <p className="text-gray-500">Your signed document is ready to download, share, or store securely.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-blue sm:text-4xl">
              Why Choose Inkless Flow?
            </h2>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 lg:mx-auto">
              Powerful features that set us apart from expensive alternatives
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-blue mb-3">100% Free Forever</h3>
              <p className="text-gray-500">No subscriptions, no hidden costs, no limits on documents. Sign as much as you need without paying a cent.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-blue mb-3">Legally Binding</h3>
              <p className="text-gray-500">Our Simple Electronic Signatures (SES) are compliant with eIDAS regulations and legally recognized across the EU.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-blue mb-3">Instant Signatures</h3>
              <p className="text-gray-500">Sign documents in seconds, not minutes. Our streamlined process ensures maximum efficiency.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-blue mb-3">Multiple Signers</h3>
              <p className="text-gray-500">Invite others to sign your documents with a simple email. Track signature status in real-time.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-blue mb-3">Sign Anywhere</h3>
              <p className="text-gray-500">Our responsive design works flawlessly on any device. Sign documents on your phone, tablet, or computer.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-cyan/10 text-primary-cyan mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-blue mb-3">Bank-Level Security</h3>
              <p className="text-gray-500">Your documents and data are protected with advanced encryption and secure cloud storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-blue sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 lg:mx-auto">
              Join thousands who&apos;ve switched to free document signing
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="bg-bg-light rounded-lg p-8 relative">
              <div className="absolute top-4 left-4 text-4xl text-primary-cyan opacity-20">"</div>
              <p className="text-gray-600 mb-6 z-10 relative">
                I was paying $30 a month for e-signatures until I found Inkless Flow. I&apos;ve saved hundreds of dollars while getting the same functionality. The fact that it&apos;s free is almost hard to believe!
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-primary-blue">Sarah Williams</h4>
                  <p className="text-xs text-gray-500">Freelance Designer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-bg-light rounded-lg p-8 relative">
              <div className="absolute top-4 left-4 text-4xl text-primary-cyan opacity-20">"</div>
              <p className="text-gray-600 mb-6 z-10 relative">
                As a startup founder, every euro counts. Inkless Flow has saved us thousands while providing a professional signing experience for our clients. The multiple signer feature is fantastic!
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-primary-blue">Michael Chen</h4>
                  <p className="text-xs text-gray-500">Tech Startup CEO</p>
                </div>
              </div>
            </div>
            
            <div className="bg-bg-light rounded-lg p-8 relative">
              <div className="absolute top-4 left-4 text-4xl text-primary-cyan opacity-20">"</div>
              <p className="text-gray-600 mb-6 z-10 relative">
                I was skeptical about a free e-signature service, but Inkless Flow delivers everything they promise. The interface is intuitive, and I can sign documents from my phone in seconds.
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-primary-blue">Elena Rodríguez</h4>
                  <p className="text-xs text-gray-500">Legal Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to sign documents the smart way?
          </h2>
          <p className="max-w-2xl mt-4 text-xl text-blue-100 mx-auto">
            Join thousands of users who&apos;ve made the switch to free, legal electronic signatures.
          </p>
          <div className="mt-8">
            <Link href="/auth/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-blue bg-white hover:bg-gray-50 sm:px-8">
              Get Started Now — It&apos;s Free!
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2">
              <div className="flex items-center">
                <div className="relative w-10 h-8 mr-2">
                  <div className="absolute top-1/2 w-full h-0.5 bg-primary-cyan rounded-full transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-0 w-3 h-3 bg-primary-cyan rounded-full transform -translate-y-1/2"></div>
                </div>
                <span className="text-2xl font-bold text-white">
                  Inkless<span className="text-primary-cyan">Flow</span>
                </span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                The completely free electronic signature solution for businesses and individuals. No hidden costs, no limitations.
              </p>
              <div className="flex space-x-6 mt-6">
              <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#features" className="text-base text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-base text-gray-400 hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="/blog" className="text-base text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/help-center" className="text-base text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Templates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="/about" className="text-base text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Inkless Flow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
