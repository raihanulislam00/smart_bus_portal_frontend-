import axiosInstance from '../axiosConfig';

export interface Admin {
  id: number;
  fullName: string;
  companyName?: string;
  email: string;
}

export interface Bus {
  id: number;
  busName: string;
  route: string;
  capacity: number;
  fare: number;
  schedule: string;
  isActive: boolean;
  managedBy?: Admin;
  adminId?: number; // For backward compatibility
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusData {
  busName: string;
  route: string;
  capacity: number;
  fare: number;
  schedule: string;
}

export interface UpdateBusData {
  busName?: string;
  route?: string;
  capacity?: number;
  fare?: number;
  schedule?: string;
  isActive?: boolean;
}

// Helper function to normalize bus data
const normalizeBusData = (bus: any): Bus => ({
  ...bus,
  fare: Number(bus.fare) || 0,
  capacity: Number(bus.capacity) || 0,
  adminId: bus.managedBy?.id || bus.adminId,
  // Normalize admin data to match frontend interface
  managedBy: bus.managedBy ? {
    id: bus.managedBy.id,
    fullName: bus.managedBy.fullName || bus.managedBy.name, // Backend uses 'name' field
    companyName: bus.managedBy.companyName,
    email: bus.managedBy.email || bus.managedBy.mail // Backend uses 'mail' field
  } : undefined,
});

// Helper function to normalize multiple buses
const normalizeBusesData = (buses: any[]): Bus[] => 
  buses.map(normalizeBusData);

class BusService {
  async getAllBusesForAdmin(adminId: number): Promise<Bus[]> {
    try {
      const response = await axiosInstance.get(`/admin/${adminId}/bus`);
      return normalizeBusesData(response.data);
    } catch (error: any) {
      console.error('Get buses for admin error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch buses');
    }
  }

  async getBusById(adminId: number, busId: number): Promise<Bus> {
    try {
      const response = await axiosInstance.get(`/admin/${adminId}/bus/${busId}`);
      return normalizeBusData(response.data);
    } catch (error: any) {
      console.error('Get bus by ID error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bus');
    }
  }

  async createBus(adminId: number, busData: CreateBusData): Promise<Bus> {
    try {
      const response = await axiosInstance.post(`/admin/${adminId}/bus`, busData);
      return normalizeBusData(response.data);
    } catch (error: any) {
      console.error('Create bus error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create bus');
    }
  }

  async updateBus(adminId: number, busId: number, busData: UpdateBusData): Promise<Bus> {
    try {
      const response = await axiosInstance.put(`/admin/${adminId}/bus/${busId}`, busData);
      return normalizeBusData(response.data);
    } catch (error: any) {
      console.error('Update bus error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update bus');
    }
  }

  async deleteBus(adminId: number, busId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/admin/${adminId}/bus/${busId}`);
    } catch (error: any) {
      console.error('Delete bus error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete bus');
    }
  }

  // Get all buses (public endpoint)
  async getAllBuses(): Promise<Bus[]> {
    try {
      const response = await axiosInstance.get('/bus');
      return normalizeBusesData(response.data);
    } catch (error: any) {
      console.error('Get all buses error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch buses');
    }
  }

  // Search buses
  async searchBuses(query: string): Promise<Bus[]> {
    try {
      const response = await axiosInstance.get(`/bus/search?q=${encodeURIComponent(query)}`);
      return normalizeBusesData(response.data);
    } catch (error: any) {
      console.error('Search buses error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search buses');
    }
  }
}

export default new BusService();
