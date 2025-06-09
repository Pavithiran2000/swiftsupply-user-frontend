import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-[white] py-[48px]">
      <div className="container mx-auto px-[16px]">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-[32px] text-center md:text-left">
          {/* Company Info */}
          <div>
            <h3 className="text-[24px] font-bold text-[#7b0a24] mb-[16px]">
              SwiftSupply
            </h3>
            <p className="text-[rgba(255,255,255,0.75)] text-[14px] leading-[1.5]">
              Connecting your business with trusted suppliers across Sri Lanka.
              Your partner for seamless B2B wholesale sourcing and retail
              trading.
            </p>
          </div>

          {/* Website */}
          <div>
            <h4 className="font-semibold mb-[16px]">WEBSITE</h4>
            <ul className="space-y-[8px] text-[14px] text-[rgba(255,255,255,0.75)]">
              {["About", "Features", "Works", "Career"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[white] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-[16px]">HELP</h4>
            <ul className="space-y-[8px] text-[14px] text-[rgba(255,255,255,0.75)]">
              {[
                "Customer Support",
                "Delivery",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[white] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h4 className="font-semibold mb-[16px]">FAQ</h4>
            <ul className="space-y-[8px] text-[14px] text-[rgba(255,255,255,0.75)]">
              {["Account", "Communication", "Orders", "Payments"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-[white] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-[16px]">RESOURCES</h4>
            <ul className="space-y-[8px] text-[14px] text-[rgba(255,255,255,0.75)]">
              {[
                "Free eBooks",
                "Development Tutorial",
                "How to – Blog",
                "YouTube Playlist",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[white] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-[rgba(255,255,255,0.3)] my-[32px]" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0 text-center md:text-left">
          <div className="text-[12px] text-[rgba(255,255,255,0.6)]">
            SwiftSupply © 2024. All Rights Reserved
          </div>

          {/* Social Media */}
          <div className="flex space-x-[16px]">
            <Facebook className="w-[20px] h-[20px] text-[rgba(255,255,255,0.6)] hover:text-[white] cursor-pointer transition-colors" />
            <Twitter className="w-[20px] h-[20px] text-[rgba(255,255,255,0.6)] hover:text-[white] cursor-pointer transition-colors" />
            <Instagram className="w-[20px] h-[20px] text-[rgba(255,255,255,0.6)] hover:text-[white] cursor-pointer transition-colors" />
            <Linkedin className="w-[20px] h-[20px] text-[rgba(255,255,255,0.6)] hover:text-[white] cursor-pointer transition-colors" />
            <Youtube className="w-[20px] h-[20px] text-[rgba(255,255,255,0.6)] hover:text-[white] cursor-pointer transition-colors" />
          </div>

          {/* Payment methods */}
          <div className="flex space-x-[12px]">
            <div className="bg-[#1a56db] text-[white] px-[12px] py-[4px] rounded text-[10px] font-bold">
              VISA
            </div>
            <div className="bg-[#ce0808] text-[white] px-[12px] py-[4px] rounded text-[10px] font-bold">
              Master
            </div>
            <div className="bg-[#005ea1] text-[white] px-[12px] py-[4px] rounded text-[10px] font-bold">
              PayPal
            </div>
            <div className="bg-[#34a853] text-[white] px-[12px] py-[4px] rounded text-[10px] font-bold">
              G Pay
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
