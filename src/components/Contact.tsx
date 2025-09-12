// Contact Component
import  { useState } from "react";
import { Phone, MapPin, Mail, Send } from "lucide-react";
import electronicsSlider from '../assets/electronics-slider-1.png';



const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thank you for your message! I will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="text-black">
      <div className="container mx-auto">
        <div
          className="text-center mb-12 relative min-h-[500px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${electronicsSlider})`,
          }}
        >
          <div className="bg-black bg-opacity-50 h-full flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-7xl mt-12 font-bold text-white drop-shadow-lg">Contact Me</h1>
            <p className="text-lg text-white mt-4 drop-shadow-md">Get in Touch</p>
          </div>
        </div>

        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div className="contact-info">
            <h3 className="text-2xl mb-4">Let's Connect</h3>
            <p className="leading-relaxed mb-8">
              If you have a question or need help, do not hesitate to contact me. I'm here for you! Contact me for more information and support.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 p-4 bg-opacity-5 bg-white rounded-lg border border-opacity-10">
                <Phone size={24} />
                <div>
                  <strong>Name:</strong> Alliance Ineza
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-opacity-5 bg-white rounded-lg border border-opacity-10">
                <MapPin size={24} />
                <div>
                  <strong>Address:</strong> Nyarugenge, Kigali, Rwanda
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-opacity-5 bg-white rounded-lg border border-opacity-10">
                <Mail size={24} />
                <div>
                  <strong>Email:</strong>
                  <a href="mailto:alliancesgiselienze@gmail.com" className="text-black hover:underline">alliancesgiselienze@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-opacity-5 bg-white p-8 rounded-lg border border-opacity-10">
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-opacity-20 rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-opacity-20 rounded-lg"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full p-4 border border-opacity-20 rounded-lg mb-4"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full p-4 border border-opacity-20 rounded-lg mb-4"
              />
              <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg transition duration-300 hover:bg-gray-800">
                <Send size={16} className="inline-block mr-2" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;