export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  unitPrice: number;
  currentStock: number;
  minimalStock: number;
  category: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateProductDto {
  code: string;
  name: string;
  description: string;
  unitPrice: number;
  currentStock: number;
  minimalStock: number;
  category: string;
  imageUrl: string | null;
}

export interface UpdateProductDto {
  code: string;
  name: string;
  description: string;
  unitPrice: number;
  currentStock: number;
  minimalStock: number;
  category: string;
  imageUrl: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: string[];
}
