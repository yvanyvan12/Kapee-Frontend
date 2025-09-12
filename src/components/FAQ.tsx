import  { useState } from 'react';
import electronicsSlider from '../assets/electronics-slider-1.png';
import { Link } from "react-router-dom";

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
     
    <div className="border-b border-gray-200 py-4">
     
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">{question}</h2>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          &#9654; {/* Arrow icon */}
        </span>
      </div>
      {isOpen && <p className="mt-2 text-gray-600">{answer}</p>}
    </div>
    </>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What are the delivery charges?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pretium nisl feugiat nisl gravida, eget lacinia lacus placerat."
    },
    {
      question: "How do I return something to you?",
      answer: "To return an item, please follow our return process outlined on the Returns page."
    },
    {
      question: "What is your International Returns Policy?",
      answer: "Our international returns policy allows for returns within 30 days of delivery."
    },
    {
      question: "My refund is incorrect, what should I do?",
      answer: "If your refund is incorrect, please contact customer service for assistance."
    },
    {
      question: "Will my parcel be charged customs and import charges?",
      answer: "Yes, international orders may be subject to customs and import charges."
    },
    {
      question: "Do you refund delivery charges if I return something?",
      answer: "We do not refund delivery charges for returns unless the item is faulty."
    },
    {
      question: "What is the estimated delivery time?",
      answer: "The estimated delivery time is 3-5 business days."
    },
    {
      question: "What to track order work?",
      answer: "You can track your order using the tracking link provided in your confirmation email."
    },
  ];

  return (
    <>
     <div
          className="text-center mb-12 relative min-h-[500px] min-w-[900px]"
          style={{
            backgroundImage: `url(${electronicsSlider})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-opacity-50 h-full flex flex-col items-center justify-center">
            <h1 className="text-7xl mt-47 font-bold text-black">FAQ</h1>
            <p className="text-lg text-white"><Link to="Home">Home</Link>/FAQ</p>
          </div>
        </div>
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Shipping Information</h1>
          {faqs.slice(0, 4).map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Returns & Refunds</h1>
          {faqs.slice(4).map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default FAQSection;