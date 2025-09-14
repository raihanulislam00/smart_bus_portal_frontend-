import axiosInstance from '../axiosConfig';

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  photo?: string;
  isActive: boolean;
  dateOfBirth: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAdminData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  photo?: File;
}

class AdminService {
  async getAllAdmins(): Promise<Admin[]> {
    try {
      const response = await axiosInstance.get('/admin');
      return response.data;
    } catch (error: any) {
      console.error('Get all admins error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch admins');
    }
  }

  async getAdminById(id: number): Promise<Admin> {
    try {
      const response = await axiosInstance.get(`/admin/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get admin by ID error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch admin');
    }
  }

  async getAdminsWithDefaultCountry(): Promise<Admin[]> {
    try {
      const response = await axiosInstance.get('/admin/defaultCountry');
      return response.data;
    } catch (error: any) {
      console.error('Get admins with default country error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch admins');
    }
  }

  async updateAdmin(id: number, updateData: UpdateAdminData): Promise<Admin> {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.entries(updateData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      const response = await axiosInstance.put(`/admin/${id}`, formData);
      
      return response.data;
    } catch (error: any) {
      console.error('Update admin error:', error);
      console.error('Error details:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to update admin');
    }
  }

  async deleteAdmin(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/admin/${id}`);
    } catch (error: any) {
      console.error('Delete admin error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete admin');
    }
  }

  async searchAdmins(searchTerm: string): Promise<Admin[]> {
    try {
      const response = await axiosInstance.get(`/admin/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error: any) {
      console.error('Search admins error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search admins');
    }
  }

  async getProfile(id: number): Promise<Admin> {
    return this.getAdminById(id);
  }

  async updateProfile(id: number, updateData: UpdateAdminData): Promise<Admin> {
    return this.updateAdmin(id, updateData);
  }
}

export default new AdminService();
