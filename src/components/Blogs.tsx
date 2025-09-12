import  { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Flame, Eye, Calendar, User } from "lucide-react";

import image2 from '../assets/blog1.jpg';
import image3 from '../assets/blog2.jpg';
import image4 from '../assets/blog3.jpg';
import image5 from '../assets/blog4.jpg';
import image6 from '../assets/blog1.jpg';


const blogImages = [
  image2,
  image3,
  image4,
  image5,
  image6,
];


const blogs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Blog Post ${i + 1}: Latest Tech Trends`,
  excerpt: "Discover the latest innovations and trends shaping the future of technology and digital commerce...",
  content: "Full article content would go here with detailed insights and analysis...",
  date: `2025-09-${(i % 30) + 1}`,
  author: `Author ${(i % 5) + 1}`,
  comments: Math.floor(Math.random() * 20) + 1,
  views: Math.floor(Math.random() * 200) + 50,
  image: blogImages[i % blogImages.length],
  category: ["Technology", "Business", "Design", "Marketing", "E-commerce"][i % 5],
  readTime: Math.floor(Math.random() * 10) + 2,
}));

// Dummy sidebar data
const recentBlogs = blogs.slice(-5);
const popularBlogs = blogs.sort((a, b) => b.views - a.views).slice(0, 5);
const commentsData = blogs
  .map((b) => ({
    blogId: b.id,
    text: `Great insights on ${b.category}! Thanks for sharing...`,
    author: `User${b.id}`,
  }))
  .slice(0, 5);

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const blogsPerPage = 6;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const [sidebarTab, setSidebarTab] = useState<"recent" | "popular" | "comments">(
    "recent"
  );

  // Get blogs for current page
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Latest Blog Posts</h1>
          <p className="text-gray-600 text-lg">Stay updated with the latest trends and insights</p>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(blog.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Image Container with Hover Effects */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        hoveredCard === blog.id
                          ? 'scale-110 brightness-75'
                          : 'scale-100 brightness-100'
                      }`}
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                      hoveredCard === blog.id ? 'opacity-100' : 'opacity-0'
                    }`}></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                        {blog.category}
                      </span>
                    </div>

                    {/* Hover Content */}
                    <div className={`absolute bottom-4 left-4 right-4 text-white transition-all duration-300 transform ${
                      hoveredCard === blog.id 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-4 opacity-0'
                    }`}>
                      <p className="text-sm mb-2 line-clamp-2">{blog.content}</p>
                      <button className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors">
                        Read More
                      </button>
                    </div>

                    {/* Read Time Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {blog.readTime} min read
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <User size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{blog.author}</span>
                      <Calendar size={14} className="text-gray-500 ml-2" />
                      <span className="text-sm text-gray-600">{blog.date}</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                      {blog.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {blog.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          {blog.comments}
                        </span>
                      </div>
                      
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        hoveredCard === blog.id ? 'bg-yellow-400 scale-150' : 'bg-gray-300'
                      }`}></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Enhanced Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + Math.max(1, currentPage - 2);
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-yellow-400 text-gray-800 shadow-lg scale-110"
                        : "bg-white text-gray-600 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setSidebarTab("recent")}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    sidebarTab === "recent"
                      ? "bg-yellow-400 text-gray-800 shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setSidebarTab("popular")}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    sidebarTab === "popular"
                      ? "bg-yellow-400 text-gray-800 shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => setSidebarTab("comments")}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    sidebarTab === "comments"
                      ? "bg-yellow-400 text-gray-800 shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Comments
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-4 capitalize">
                {sidebarTab} Posts
              </h3>
              
              <div className="space-y-4">
                {sidebarTab === "recent" &&
                  recentBlogs.map((b) => (
                    <div key={b.id} className="group cursor-pointer">
                      <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <img 
                          src={b.image} 
                          alt={b.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 group-hover:text-yellow-600 transition-colors line-clamp-2">
                            {b.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{b.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                {sidebarTab === "popular" &&
                  popularBlogs.map((b) => (
                    <div key={b.id} className="group cursor-pointer">
                      <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <img 
                          src={b.image} 
                          alt={b.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <Flame size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-800 group-hover:text-yellow-600 transition-colors line-clamp-2">
                                {b.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{b.views} views</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {sidebarTab === "comments" &&
                  commentsData.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <p className="text-sm text-gray-700 italic mb-2">"{c.text}"</p>
                      <p className="text-xs text-gray-500">- {c.author}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 text-gray-800">
              <h3 className="font-bold mb-2">Stay Updated!</h3>
              <p className="text-sm mb-4">Get the latest posts delivered to your inbox.</p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="w-full px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white text-sm"
                />
                <button className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}