// components/layout/Footer.tsx
import { ChefHat, Linkedin, Instagram, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
             <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
  <ChefHat className="text-white w-4 h-4" />
</div>

              <h3 className="text-xl font-semibold">AI Recipe Generator</h3>
            </div>
            <p className="text-slate-400 mb-4">
              Create personalized, AI-powered recipes based on your ingredients or favorite cuisines.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/fatima-zafar-b9167a2a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/fatemah_2156?igsh=MTAybmhuMTJ2bXhoMw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
    href="https://68638a9edf34a2e34bef8e79--portfoliofatimah.netlify.app"
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-400 hover:text-white transition-colors"
  >
    <Globe className="w-5 h-5" />
  </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Ingredient-based Recipes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Recipe by Dishname</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Save & Manage Recipes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Continue with Google</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Developer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 AI Recipe Generator. Crafted with ❤️ by Fatima Zafar.</p>
        </div>
      </div>
    </footer>
  );
}
