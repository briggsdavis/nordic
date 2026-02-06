import { Package, Clock, Globe, Shield, FileCheck, MapPin } from "lucide-react";

const WhatWeDo = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Text Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 tracking-wide">
                WHAT WE DO
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We import premium Norwegian salmon directly from Norway to Ethiopia,
                bringing the finest quality seafood right to your doorstep.
              </p>

              {/* USP Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Under 48 Hours Delivery */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Under 48 Hours</h3>
                    <p className="text-xs text-muted-foreground">
                      Delivered right to your doorstep
                    </p>
                  </div>
                </div>

                {/* Order Online */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Order Online</h3>
                    <p className="text-xs text-muted-foreground">
                      Simple, convenient ordering
                    </p>
                  </div>
                </div>

                {/* Norwegian Suppliers */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Trusted Suppliers</h3>
                    <p className="text-xs text-muted-foreground">
                      Direct from Norwegian sources
                    </p>
                  </div>
                </div>

                {/* All Certifications */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Full Certifications</h3>
                    <p className="text-xs text-muted-foreground">
                      Complete transportation docs
                    </p>
                  </div>
                </div>

                {/* Live Order Tracking */}
                <div className="flex gap-3 sm:col-span-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Live Order Updates</h3>
                    <p className="text-xs text-muted-foreground">
                      Real-time tracking from Norway to your doorstep
                    </p>
                  </div>
                </div>

                {/* Direct Import */}
                <div className="flex gap-3 sm:col-span-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Direct Import</h3>
                    <p className="text-xs text-muted-foreground">
                      Premium Norwegian salmon, no middlemen
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-64 lg:h-auto min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&h=600&fit=crop"
                alt="Fresh Norwegian salmon being prepared"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card/80 to-transparent lg:hidden" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
