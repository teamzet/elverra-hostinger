import { useState, useEffect } from 'react';

interface ReferralData {
  id: string;
  name: string;
  date: string;
  status: 'Active' | 'Pending';
  earnings: number;
}

interface AffiliateStats {
  referralCode: string;
  totalReferrals: number;
  pendingReferrals: number;
  referralTarget: number;
  totalEarnings: number;
  pendingEarnings: number;
  referralHistory: ReferralData[];
  progress: number;
}

export const useAffiliateData = () => {
  // For demo purposes, we don't need actual user authentication
  const [affiliateData, setAffiliateData] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For demo purposes, always show dummy data instead of making API calls
    const loadDummyData = () => {
      setLoading(true);
      setError(null);

      // Create comprehensive dummy affiliate data for demonstration
      const dummyData: AffiliateStats = {
        referralCode: `ELV${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        totalReferrals: 7,
        pendingReferrals: 2,
        referralTarget: 10,
        totalEarnings: 175000,
        pendingEarnings: 50000,
        referralHistory: [
          {
            id: '1',
            name: 'Aminata Diallo',
            date: '2025-01-10',
            status: 'Active',
            earnings: 25000
          },
          {
            id: '2', 
            name: 'Ibrahim Konaté',
            date: '2025-01-08',
            status: 'Active',
            earnings: 25000
          },
          {
            id: '3',
            name: 'Fatou Ndiaye',
            date: '2025-01-05',
            status: 'Pending',
            earnings: 25000
          },
          {
            id: '4',
            name: 'Moussa Traoré',
            date: '2024-12-28',
            status: 'Active',
            earnings: 25000
          },
          {
            id: '5',
            name: 'Aïsha Ba',
            date: '2024-12-25',
            status: 'Active',
            earnings: 25000
          },
          {
            id: '6',
            name: 'Sekou Camara',
            date: '2024-12-20',
            status: 'Pending',
            earnings: 25000
          },
          {
            id: '7',
            name: 'Mariam Keita',
            date: '2024-12-18',
            status: 'Active',
            earnings: 25000
          }
        ],
        progress: 70
      };

      // Simulate loading delay
      setTimeout(() => {
        setAffiliateData(dummyData);
        setLoading(false);
      }, 500);
    };

    loadDummyData();
  }, []);

  const refreshData = async () => {
    // For demo purposes, refresh with the same dummy data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    affiliateData,
    loading,
    error,
    refreshData
  };
};