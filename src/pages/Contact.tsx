import { MapPin, Mail, Phone, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-secondary py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">
                Get in Touch
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're a restaurant, hotel, or retailer looking for premium Norwegian salmon, 
                we're here to help. Reach out to discuss your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Location */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">Visit Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Bole Road, Atlas District<br />
                    Addis Ababa, Ethiopia
                  </p>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="mailto:orders@nordicseafood.et" 
                    className="text-primary hover:underline"
                  >
                    orders@nordicseafood.et
                  </a>
                  <p className="text-muted-foreground text-sm mt-2">
                    For orders and general inquiries
                  </p>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">Call Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="tel:+251911000000" 
                    className="text-primary hover:underline"
                  >
                    +251 911 000 000
                  </a>
                  <p className="text-muted-foreground text-sm mt-2">
                    Monday - Saturday, 8am - 6pm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* B2B Section */}
        <section className="bg-secondary py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
                  Business Inquiries
                </h2>
                <p className="text-muted-foreground text-lg">
                  Looking to establish a regular supply of premium Norwegian salmon for your business?
                </p>
              </div>

              <Card className="border-border">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">WhatsApp Business</h3>
                          <a 
                            href="https://wa.me/251911000000" 
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            +251 911 000 000
                          </a>
                          <p className="text-muted-foreground text-sm mt-1">
                            Quick responses for urgent inquiries
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">Business Hours</h3>
                          <p className="text-muted-foreground text-sm">
                            Monday - Friday: 8:00 AM - 6:00 PM<br />
                            Saturday: 9:00 AM - 2:00 PM<br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">We serve:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Hotels & Resorts
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Restaurants & Cafes
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Catering Companies
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Supermarkets & Retailers
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Food Distributors
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border text-center">
                    <p className="text-muted-foreground mb-4">
                      Ready to discuss your requirements?
                    </p>
                    <Button asChild size="lg">
                      <a href="mailto:orders@nordicseafood.et?subject=B2B Inquiry">
                        Send Business Inquiry
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
