import React, { useState } from 'react';
import { X, Plus, Trash2, Edit, Camera } from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  completedDate: string;
  clientName?: string;
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioItem[];
  onUpdatePortfolio: (portfolio: PortfolioItem[]) => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ 
  isOpen, 
  onClose, 
  portfolio, 
  onUpdatePortfolio 
}) => {
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    completedDate: '',
    clientName: ''
  });

  const sampleImages = [
    'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/209274/pexels-photo-209274.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: PortfolioItem = {
      id: editingItem?.id || Date.now(),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || sampleImages[Math.floor(Math.random() * sampleImages.length)],
      category: formData.category,
      completedDate: formData.completedDate,
      clientName: formData.clientName
    };

    let updatedPortfolio;
    if (editingItem) {
      updatedPortfolio = portfolio.map(item => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedPortfolio = [...portfolio, newItem];
    }

    onUpdatePortfolio(updatedPortfolio);
    resetForm();
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category,
      completedDate: item.completedDate,
      clientName: item.clientName || ''
    });
    setIsAddingNew(true);
  };

  const handleDelete = (id: number) => {
    const updatedPortfolio = portfolio.filter(item => item.id !== id);
    onUpdatePortfolio(updatedPortfolio);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      completedDate: '',
      clientName: ''
    });
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const selectSampleImage = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Portfolio Management</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!isAddingNew ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">Showcase your best work to attract more clients</p>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </button>
              </div>

              {portfolio.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
                  <p className="text-gray-600 mb-4">Start building your portfolio by adding your completed projects</p>
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                          <span>{new Date(item.completedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex-1 bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 flex items-center justify-center"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Kitchen Plumbing Installation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Tutoring">Tutoring</option>
                      <option value="Car Repair">Car Repair</option>
                      <option value="Painting">Painting</option>
                      <option value="Carpentry">Carpentry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      name="completedDate"
                      value={formData.completedDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Client name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the project, challenges faced, and results achieved..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Image
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    placeholder="Enter image URL or select from samples below"
                  />
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {sampleImages.map((imageUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSampleImage(imageUrl)}
                        className={`relative rounded-md overflow-hidden border-2 transition-colors ${
                          formData.imageUrl === imageUrl ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingItem ? 'Update Project' : 'Add Project'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;