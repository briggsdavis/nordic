import { LayoutDashboard, ShoppingCart, Utensils } from "lucide-react"

const steps = [
  {
    icon: ShoppingCart,
    step: "01",
    title: "Order Online",
    description:
      "Place your order on our secure platform, then upload your proof of payment as instructed to confirm your purchase.",
  },
  {
    icon: LayoutDashboard,
    step: "02",
    title: "Track Your Order",
    description:
      "Use the client dashboard to monitor your order status in real time and view quality certificates for your delivery.",
  },
  {
    icon: Utensils,
    step: "03",
    title: "Enjoy Your Salmon",
    description:
      "Simple and easy: your sushi grade, vacuum packed Norwegian salmon arrives fresh and ready to enjoy.",
  },
]

const HowItWorks = () => {
  return (
    <section className="bg-secondary py-20 lg:py-28" aria-labelledby="how-it-works-title">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs tracking-[0.3em] text-primary uppercase">Simple Process</p>
          <h2 id="how-it-works-title" className="font-serif text-4xl text-foreground md:text-5xl">
            How It Works
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-5xl">
          {/* Horizontal connector line (desktop) */}
          <div className="absolute top-16 right-0 left-0 hidden h-px bg-border lg:block" />

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-background shadow-sm">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>

                {/* Step number */}
                <p className="mb-2 text-xs font-medium tracking-[0.2em] text-primary uppercase">
                  Step {step.step}
                </p>

                {/* Title */}
                <h3 className="mb-3 font-serif text-xl text-foreground">{step.title}</h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
