import { Check, Clock, FileCheck, MapPin, MousePointer, Shield } from "lucide-react"
import salmonImage from "@/assets/hero-banner.jpg" // We'll use this temporarily

const features = [
  {
    icon: MapPin,
    title: "Direct Import from Norway",
    description: "We import premium Norwegian salmon directly from trusted Norwegian suppliers to Ethiopia",
  },
  {
    icon: Clock,
    title: "48-Hour Delivery",
    description: "Your order arrives right at your doorstep in under 48 hours, guaranteed fresh",
  },
  {
    icon: MousePointer,
    title: "Order Online Seamlessly",
    description: "Browse, select, and purchase our premium salmon products with just a few clicks",
  },
  {
    icon: Shield,
    title: "Trusted Norwegian Suppliers",
    description: "We partner exclusively with certified Norwegian suppliers with proven track records",
  },
  {
    icon: FileCheck,
    title: "Complete Certifications",
    description: "All transportation certifications and documentation provided for full transparency",
  },
  {
    icon: Check,
    title: "Live Order Tracking",
    description: "Get real-time updates on your order status from dispatch to delivery",
  },
]

const WhatWeDo = () => {
  return (
    <section className="bg-accent/30 py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-card shadow-2xl">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Left Side - Content */}
            <div className="px-8 py-12 lg:px-12 lg:py-16">
              {/* Header */}
              <div className="mb-8">
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">
                  What We Do
                </p>
                <h2 className="mb-4 font-serif text-4xl text-foreground lg:text-5xl">
                  Norwegian Excellence,
                  <br />
                  <span className="italic">Ethiopian Convenience</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  We bridge the gap between Norway's pristine fjords and your kitchen
                  in Addis Ababa, delivering premium Atlantic salmon with
                  uncompromising quality and transparency.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] lg:h-auto">
              <img
                src={salmonImage}
                alt="Fresh Norwegian salmon with ice and garnish"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent lg:bg-gradient-to-r" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
