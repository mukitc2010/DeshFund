"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const subjectOptions = [
  { label: "General Inquiry", value: "general" },
  { label: "Campaign Support", value: "campaign" },
  { label: "Technical Issue", value: "technical" },
  { label: "Partnership", value: "partnership" },
  { label: "Press & Media", value: "press" },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-secondary-600">
            Have a question or need help? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-secondary-900">
                  Get in touch
                </h2>
                <div className="mt-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-700">
                        Email
                      </p>
                      <a
                        href="mailto:hello@fundbd.com"
                        className="text-sm text-primary-600 hover:underline"
                      >
                        hello@fundbd.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-700">
                        Phone
                      </p>
                      <p className="text-sm text-secondary-600">
                        +880-2-XXXX-XXXX
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-700">
                        Office
                      </p>
                      <p className="text-sm text-secondary-600">
                        House 42, Road 11
                        <br />
                        Banani, Dhaka 1213
                        <br />
                        Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Map placeholder */}
              <div className="flex h-48 items-center justify-center rounded-xl border border-secondary-200 bg-secondary-100 text-secondary-500">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm font-medium">Banani, Dhaka</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-secondary-900">
                  Send us a message
                </h2>
                <form
                  className="mt-6 space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Name" placeholder="Your full name" />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </div>
                  <Select
                    label="Subject"
                    options={subjectOptions}
                    placeholder="Select a topic"
                    defaultValue=""
                  />
                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    icon={<Send className="h-4 w-4" />}
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
