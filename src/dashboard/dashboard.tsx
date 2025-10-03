import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  DollarSign,
  UserCheck,
  Package2,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Interfaces
interface User {
  _id: string;
  username: string;
  email: string;
  userRole: 'user' | 'admin';
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  items: {
    productId: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  total: number;
  status?: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentUsers: User[];
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Form states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Search states
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Check if user is admin
  const checkAdminAccess = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      window.location.href = "/";
      return false;
    }
    return true;
  };

  // API helper
  const apiCall = async (endpoint: string, method: string = 'GET', body?: any) => {
    const token = getToken();
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  };

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        apiCall('/user/user/users'),
        apiCall('/products'),
        apiCall('/orders')
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum: number, order: Order) => sum + order.total, 0) || 0;

      setStats({
        totalUsers: usersRes.users?.length || 0,
        totalProducts: productsRes.data?.length || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalRevenue,
        recentOrders: ordersRes.data?.slice(0, 5) || [],
        recentUsers: usersRes.users?.slice(0, 5) || []
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/user/users');
      setUsers(response.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/products');
      setProducts(response.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/orders');
      setOrders(response.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      console.log('Deleting user with ID:', userId); // Debug log
      
      // Try the delete request
      const response = await apiCall(`/user/user/users/${userId}`, 'DELETE');
      console.log('Delete response:', response); // Debug log
      
      // Refresh the users list
      await fetchUsers();
      
      // Show success message (optional)
      setError('');
    } catch (err: any) {
      console.error('Delete user error:', err); // Debug log
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await apiCall(`/products/${productId}`, 'DELETE');
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  // Load data based on active tab
  useEffect(() => {
    if (!checkAdminAccess()) return;

    switch (activeTab) {
      case 'overview':
        fetchStats();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'products':
        fetchProducts();
        break;
      case 'orders':
        fetchOrders();
        break;
    }
  }, [activeTab]);

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-600' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-green-600' },
    { id: 'products', label: 'Products', icon: Package, color: 'text-purple-600' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, color: 'text-orange-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
  ];

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    order.userId.email.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Animated stat card component
  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, bgColor, iconBg }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    color: string;
    bgColor: string;
    iconBg: string;
  }) => (
    <div className={`${bgColor} backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">{title}</p>
          <p className={`text-3xl font-bold ${color} transition-all duration-300`}>{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="ml-1">{trendValue}</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${iconBg} ${iconBg.includes('gradient') ? '' : 'bg-gradient-to-br'} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <Icon size={28} className={`${color} drop-shadow-sm`} />
        </div>
      </div>
    </div>
  );

  // Render overview section with enhanced visuals
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Animated Welcome Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {localStorage.getItem('userName') || 'Admin'}! 👋</h1>
          <p className="text-yellow-100 text-lg">Here's what's happening with your business today.</p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -mr-48 -mt-48"></div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers.toLocaleString() || '0'}
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100/50"
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts.toLocaleString() || '0'}
          icon={Package2}
          trend="up"
          trendValue="+8%"
          color="text-green-600"
          bgColor="bg-gradient-to-br from-green-50 to-green-100/50"
          iconBg="bg-gradient-to-br from-green-500 to-green-600 text-white"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders.toLocaleString() || '0'}
          icon={ShoppingCart}
          trend="up"
          trendValue="+23%"
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100/50"
          iconBg="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue.toLocaleString() || '0'}`}
          icon={DollarSign}
          trend="up"
          trendValue="+31%"
          color="text-orange-600"
          bgColor="bg-gradient-to-br from-orange-50 to-orange-100/50"
          iconBg="bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        />
      </div>

      {/* Enhanced Activity Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders with enhanced styling */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-bold">Recent Orders</h3>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Live</span>
            </div>
          </div>
          <div className="p-6">
            {stats?.recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No recent orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentOrders.map((order, index) => (
                  <div 
                    key={order._id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        order.status === 'completed' ? 'bg-green-100 text-green-600' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {order.status === 'completed' ? <CheckCircle size={20} /> :
                         order.status === 'pending' ? <Clock size={20} /> :
                         <ShoppingCart size={20} />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">#{order._id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">{order.userId.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Users with enhanced styling */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <UserCheck size={24} />
                </div>
                <h3 className="text-xl font-bold">Recent Users</h3>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">New</span>
            </div>
          </div>
          <div className="p-6">
            {stats?.recentUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No recent users</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentUsers.map((user, index) => (
                  <div 
                    key={user._id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                        <span className="font-semibold text-gray-600">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        user.userRole === 'admin' 
                          ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' 
                          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                      }`}>
                        {user.userRole === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced users section
  const renderUsers = () => (
    <div className="space-y-8">
      {/* Header with gradient */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            User Management
          </h2>
          <p className="text-gray-600 mt-2">Manage and monitor all users in your system</p>
        </div>
        <button 
          onClick={() => setShowUserModal(true)}
          className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-3 rounded-2xl flex items-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="bg-white/20 p-1 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
            <Plus size={20} />
          </div>
          Add User
        </button>
      </div>

      {/* Enhanced search with glass effect */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all duration-300 text-lg"
          />
        </div>
      </div>

      {/* Enhanced table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{user.username}</div>
                        <div className="text-gray-600">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-2 text-sm rounded-full font-semibold ${
                      user.userRole === 'admin' 
                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' 
                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                    }`}>
                      {user.userRole === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-gray-600 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Enhanced products section
  const renderProducts = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Product Catalog
          </h2>
          <p className="text-gray-600 mt-2">Manage your product inventory and listings</p>
        </div>
        <button 
          onClick={() => setShowProductModal(true)}
          className="group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl flex items-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="bg-white/20 p-1 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
            <Plus size={20} />
          </div>
          Add Product
        </button>
      </div>

      {/* Enhanced search */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/20 focus:border-purple-400 transition-all duration-300 text-lg"
          />
        </div>
      </div>

      {/* Product grid with enhanced cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div key={product._id} className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  In Stock
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                  <Star size={16} className="text-yellow-500" />
                </div>
              </div>
              <div className="flex items-center justify-center h-full">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={64} className="text-gray-400" />
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">{product.description}</p>
                </div>
                <div className="text-right ml-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowProductModal(true);
                    }}
                    className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Enhanced orders section
  const renderOrders = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Order Management
          </h2>
          <p className="text-gray-600 mt-2">Track and manage all customer orders</p>
        </div>
        <button className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl flex items-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="bg-white/20 p-1 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
            <Download size={20} />
          </div>
          Export Orders
        </button>
      </div>

      {/* Enhanced search */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders by ID or customer email..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-400/20 focus:border-orange-400 transition-all duration-300 text-lg"
          />
        </div>
      </div>

      {/* Enhanced orders table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Order</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Items</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="font-mono text-lg font-bold text-gray-900">#{order._id.slice(-8)}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="font-bold text-white text-sm">{order.userId.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{order.userId.username}</div>
                        <div className="text-gray-600 text-sm">{order.userId.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                      <Package size={16} className="text-gray-400" />
                      <span className="font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-2 text-sm rounded-full font-semibold flex items-center w-fit ${
                      order.status === 'completed' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' :
                      order.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
                      order.status === 'shipped' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' :
                      'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                    }`}>
                      {order.status === 'completed' ? <CheckCircle size={16} className="mr-2" /> :
                       order.status === 'pending' ? <Clock size={16} className="mr-2" /> :
                       order.status === 'shipped' ? <Package size={16} className="mr-2" /> :
                       <AlertCircle size={16} className="mr-2" />}
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-gray-600 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Enhanced settings section
  const renderSettings = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          System Settings
        </h2>
        <p className="text-gray-600 mt-2">Configure and manage your system preferences</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* System Info Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <h3 className="text-2xl font-bold flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Settings size={24} />
              </div>
              System Information
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
              <span className="text-gray-700 font-medium">Admin User:</span>
              <span className="font-bold text-gray-900">{localStorage.getItem('userName') || 'Admin User'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
              <span className="text-gray-700 font-medium">Role:</span>
              <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full text-sm font-semibold">
                👑 {localStorage.getItem('userRole') || 'Administrator'}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
              <span className="text-gray-700 font-medium">Last Login:</span>
              <span className="font-bold text-gray-900">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
              <span className="text-gray-700 font-medium">System Status:</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="font-bold text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-red-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <h3 className="text-2xl font-bold flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <AlertCircle size={24} />
              </div>
              Danger Zone
            </h3>
          </div>
          <div className="p-8">
            <p className="text-gray-700 mb-8 text-lg">
              These actions are irreversible and will permanently affect your system.
            </p>
            <div className="space-y-4">
              <button className="w-full group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center">
                  <AlertCircle size={20} className="mr-3" />
                  Clear All Data
                </div>
              </button>
              <button className="w-full group bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center">
                  <Settings size={20} className="mr-3" />
                  Reset System
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Enhanced Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white/80 backdrop-blur-xl border-r border-white/50 transition-all duration-500 flex flex-col shadow-2xl`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-3">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-4 rounded-2xl text-left transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-white hover:shadow-md hover:scale-105'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'} transition-all duration-300`}>
                    <Icon size={20} className={isActive ? 'text-white' : item.color} />
                  </div>
                  {sidebarOpen && (
                    <span className={`ml-4 font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Enhanced Sidebar Footer */}
        <div className="p-6 border-t border-white/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-4 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="p-2 rounded-xl bg-red-100 group-hover:bg-red-200 transition-all duration-300">
              <LogOut size={20} className="text-red-600" />
            </div>
            {sidebarOpen && (
              <span className="ml-4 font-semibold">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold capitalize bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {activeTab}
              </h1>
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                activeTab === 'overview' ? 'bg-blue-500' :
                activeTab === 'users' ? 'bg-green-500' :
                activeTab === 'products' ? 'bg-purple-500' :
                activeTab === 'orders' ? 'bg-orange-500' :
                'bg-gray-500'
              }`}></div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <span className="text-sm text-gray-600">Welcome back,</span>
                <span className="font-bold text-gray-900">{localStorage.getItem('userName') || 'Admin User'}</span>
              </div>
              {loading && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="font-bold text-white">{(localStorage.getItem('userName') || 'AU').substring(0, 2).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle size={20} className="mr-3" />
                  <span className="font-semibold">{error}</span>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-200 transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="animate-fadeIn">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>

      {/* Enhanced Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            fetchProducts();
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          apiCall={apiCall}
        />
      )}

      {/* Enhanced User Modal */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSave={() => {
            fetchUsers();
            setShowUserModal(false);
            setEditingUser(null);
          }}
          apiCall={apiCall}
        />
      )}
    </div>
  );
};

// Enhanced Product Modal Component
const ProductModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
  apiCall: (endpoint: string, method?: string, body?: any) => Promise<any>;
}> = ({ product, onClose, onSave, apiCall }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    category: product?.category || '',
    imageUrl: product?.imageUrl || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (product) {
        await apiCall(`/products/${product._id}`, 'PUT', formData);
      } else {
        await apiCall('/products', 'POST', formData);
      }
      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full shadow-2xl border border-white/50 animate-scaleIn">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-3xl text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Package size={24} />
              </div>
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center">
              <AlertCircle size={20} className="mr-3" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/20 focus:border-purple-400 transition-all duration-300"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/20 focus:border-purple-400 transition-all duration-300"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/20 focus:border-purple-400 transition-all duration-300"
                placeholder="Product category"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/20 focus:border-purple-400 transition-all duration-300 resize-none"
              placeholder="Product description..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/20 focus:border-purple-400 transition-all duration-300"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:hover:translate-y-0"
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                product ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced User Modal Component
const UserModal: React.FC<{
  user: User | null;
  onClose: () => void;
  onSave: () => void;
  apiCall: (endpoint: string, method?: string, body?: any) => Promise<any>;
}> = ({ user, onClose, onSave, apiCall }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    userRole: user?.userRole || 'user',
    password: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = { ...formData };
      // Don't include password if it's empty during edit
      if (user && !submitData.password) {
        delete (submitData as any).password;
      }

      if (user) {
        // Update existing user
        await apiCall(`/user/user/users/${user._id}`, 'PUT', submitData);
      } else {
        // Create new user
        if (!submitData.password) {
          throw new Error('Password is required for new users');
        }
        await apiCall('/user/user/register', 'POST', submitData);
      }
      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full shadow-2xl border border-white/50 animate-scaleIn">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-3xl text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Users size={24} />
              </div>
              {user ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center">
              <AlertCircle size={20} className="mr-3" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-400/20 focus:border-green-400 transition-all duration-300"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-400/20 focus:border-green-400 transition-all duration-300"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.userRole}
              onChange={(e) => handleInputChange('userRole', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-400/20 focus:border-green-400 transition-all duration-300"
              required
            >
              <option value="user">👤 User</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password {user ? '(leave empty to keep current)' : '*'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-400/20 focus:border-green-400 transition-all duration-300"
              placeholder={user ? "Enter new password (optional)" : "Enter password"}
              required={!user}
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:hover:translate-y-0"
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                user ? 'Update User' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;