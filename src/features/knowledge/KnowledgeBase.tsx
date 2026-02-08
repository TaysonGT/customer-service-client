// File: src/features/knowledge/KnowledgeBase.tsx
import React, { useState } from 'react';
import { Input, Card } from '../../components/ui';
import { FiSearch, FiBook, FiHelpCircle, FiCreditCard, FiSettings } from 'react-icons/fi';
import CategoryCard from './CategoryCard';
import ArticleItem from './ArticleItem';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">Knowledge Base</h2>
        <p className="text-gray-600 text-center mb-8">
          Find answers to common questions and solutions to frequent issues
        </p>
        
        <Input 
          placeholder="Search knowledge base..." 
          icon={<FiSearch />}
          value={searchQuery}
          onChange={(e)=>setSearchQuery(e.currentTarget.value)}
          className="mb-8"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard 
            icon={<FiBook />}
            title="Getting Started"
            count={12}
            description="Learn how to use our products and services"
          />
          <CategoryCard 
            icon={<FiCreditCard />}
            title="Billing & Payments"
            count={8}
            description="Questions about payments and subscriptions"
          />
          <CategoryCard 
            icon={<FiSettings />}
            title="Account Settings"
            count={5}
            description="Manage your account preferences"
          />
          {/* More categories... */}
        </div>
        
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
          <div className="space-y-3">
            <ArticleItem 
              title="How to reset your password" 
              views={1243}
            />
            <ArticleItem 
              title="Understanding your invoice" 
              views={987}
            />
            {/* More articles... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase